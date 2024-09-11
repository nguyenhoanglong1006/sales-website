import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '~/globals';
import { LinkService } from '~/services/integrated/link.service';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    providers: [LinkService]
})
export class PriceComponent implements OnInit {

    fm: FormGroup;

    private connect;

    private conf = {
        getListGroup: {
            path: "pages/index/getlistgroup",
            token: 'getListGroup'
        },
        getRow: {
            path: "products/index/getrow",
            token: 'getRowProduct'
        },
        updatePrice: {
            path: "products/index/updateprice",
            token: 'updatePrice'
        }
    }

    public group = [];

    public id: number = 0;

    public flags: boolean = true;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
        public link: LinkService,
    ) {

        this.globals.send({ path: this.conf.getListGroup.path, token: this.conf.getListGroup.token, params: { type: 3 } });

        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
            switch (resp.token) {
                case this.conf.getListGroup.token:
                    if (+resp.status == 1) {
                        this.group = resp.data;
                    }
                    break;

                case this.conf.getRow.token:
                    if (+resp.status == 1 && Object.keys(resp.data).length > 0) {
                        this.fmConfigs(resp.data);
                    } else {
                        this.router.navigate(['/admin/products/process/update/'+this.id])
                    }
                    break;

                case this.conf.updatePrice.token:
                    this.toastr[type](resp.message, type, { timeOut: 1000 });
                    this.flags = true
                    
                    if (+resp.data.id > 0) {
                        if (resp.data.images == null) {
                            this.router.navigate(['/admin/products/process/picture/' + +resp.data.id])
                        } else {
                            setTimeout(() => {
                                this.router.navigate(['/admin/products/process/price/'+this.id])
                            }, 100);
                        }
                    } else {
                        setTimeout(() => {
                            this.router.navigate(['/admin/products/process/price/'+this.id])
                        }, 100);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.routerAct.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id && +this.id > 0) {
                this.getRow();
            } else {
                this.fmConfigs();
            }
        })
    }

    fmConfigs(item: any = '') {

        item = typeof item === 'object' ? item : {}

        this.fm = this.fb.group({
            name: [item.name ? item.name : ''],
            price: [item.price ? +item.price : 0, [Validators.min(0)]],
            price_sale: [item.price_sale ? +item.price_sale : 0, [Validators.min(0)]],
            percent: [item.percent ? +item.percent : 0, [Validators.min(0), Validators.max(100)]],
        })
    }

    getRow() {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : true
    }

    // percent = (skip) => {

    //     let price = this.globals.price.format(this.fm.value.price) || 0;

    //     if (skip === true) {

    //         let percent = +this.fm.value.percent

    //         let price_sale = Math.round((price * percent) / 100).toString();

    //         this.fm.controls['price_sale'].setValue(this.globals.price.change(price_sale))

    //     } else if(skip ===false) {

    //         let price_sale = this.globals.price.format(this.fm.value.price_sale) || 0;

    //         let percent = Math.round((price_sale * 100) / price).toString();


    //         this.fm.controls['percent'].setValue(percent)
    //     }
    // }
    percent = (skip) => {

        let price = this.globals.price.format(this.fm.value.price) || 0;

        if (skip === true) {

            let percent = +this.fm.value.percent

            let price_sale = Math.round(price-(price * percent) / 100).toString();

            this.fm.controls['price_sale'].setValue(this.globals.price.change(price_sale))

        } else if (skip === false) {

            let price_sale = this.globals.price.format(this.fm.value.price_sale) || 0;

            let percent = Math.round( (price - price_sale)/ price * 100 ).toString();


            this.fm.controls['percent'].setValue(percent)
        }
    }
    checkValidtor = () => {

        const obj = this.fm.value;

        obj.price_sale = this.globals.price.format(obj.price_sale);

        obj.price = this.globals.price.format(obj.price);

        return this.flags && this.fm.valid && obj.price_sale <= obj.price && obj.price > 0 && this.id > 0
    }

    onSubmit() {

        if (this.checkValidtor()) {

            this.flags = false;

            const obj = this.fm.value;

            obj.status = obj.status === true ? 1 : 0;

            obj.price_sale = this.globals.price.format(obj.price_sale);

            obj.price = this.globals.price.format(obj.price);

            this.globals.send({ path: this.conf.updatePrice.path, token: this.conf.updatePrice.token, data: obj, params: { id: this.id || 0 } });
        }
    }

}
