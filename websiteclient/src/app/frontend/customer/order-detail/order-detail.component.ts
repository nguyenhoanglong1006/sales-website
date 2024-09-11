import { TableService } from '../../../services/integrated/table.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { uploadFileService } from '~/services/integrated/upload.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getRow: {
            path: "orders/index/getrow",
            token: 'getRowUser'
        },
        getItem: {
            path: "orders/index/getitem",
            token: 'getItem'
        },
        process: {
            path: "orders/index/process",
            token: 'processUser'
        }
    }

    private cols = [
        { title: "lblStt", field: "index", show: true },
        { title: "orders.code", field: "code", show: true },
        { title: "orders.product_name", field: "name", show: true, filter: true },
        { title: "orders.amount", field: "amount", show: true, filter: true, class: 'text-center' },
        { title: "orders.price", field: "price", show: true, filter: true, class: 'text-right'},
        { title: "orders.total", field: "total", show: true, filter: true, class: 'text-right'},
        { title: 'orders.maker_date', field: 'maker_date', show: true, filter: true },
    ];

    public fm: FormGroup;
    public data = <any>{};
    public id: number = 0;
    public type = "password";
    public tableService = new TableService()
    public avatar = new uploadFileService();
    public flags: boolean = true;

    constructor(
        public globals: Globals,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private routerAct: ActivatedRoute,
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            
            switch (resp.token) {

                case this.conf.getRow.token:

                    this.data = resp.data

                    break;

                case this.conf.getItem.token:
                    this.tableService._concat(resp.data, true);
                    this.fmConfigs(resp.data);
                    
                    break;


                case this.conf.process.token:
                    this.flags = true
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/items/get-list']);
                        }, 100);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {

        this.tableService._ini({ cols: this.cols, data: [], keyword: 'user', sorting: { field: "maker_date", sort: "DESC", type: "" } });
        this.routerAct.params.subscribe(params => {
            this.id = +params['id'] || 0;
            if (+this.id > 0) {
                this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } });
                this.globals.send({ path: this.conf.getItem.path, token: this.conf.getItem.token, params: { id: this.id } });
            } else {
                this.fmConfigs();
            }
        })
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    fmConfigs(data: any = "") {
        data = typeof data === 'object' ? data : { status: 1, sex: 1, birth_date: new Date() };
        const imagesConfig = { path: this.globals.BASE_API_URL + ((data.images && !data.images.includes('uploads/avatar/')) ? 'uploads/avatar/' : ''), data: data.avatar ? data.avatar : '' };
        this.avatar._ini(imagesConfig);
        this.fm = this.fb.group({
            name: [data.name ? data.name : '', [Validators.required]],
            code: [data.code ? data.code : ''],
            sex: data.sex ? +data.sex : '',
            // orders: data.orders ? +data.orders : 0,
            phone: [data.phone ? data.phone : '', [Validators.pattern("^[0-9]*$")]],
            email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
            address: data.address ? data.address : '',
            password: [data.password ? data.password : '', [Validators.required, Validators.minLength(8)]],
            note: data.note ? data.note : '',
            // is_delete: data.is_delete ? data.is_delete : 0,
            status: (data.status && data.status == 1) ? true : false,
        })
        if (data.code) {
            this.fm.controls['code'].disable();
        }
    }


    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false;
            let data = this.fm.value;
            data.avatar = this.avatar._get(true);
            data.avatar.path = 'uploads/avatar/';
            data.status = data.status == true ? 1 : 0;

            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id } });
        }
    }


}
