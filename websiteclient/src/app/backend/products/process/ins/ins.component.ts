import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { TagsService } from '../../../../services/integrated/tags.service';
import { Globals } from '../../../../globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LinkService } from '../../../../services/integrated/link.service';

@Component({
    selector: 'app-ins',
    templateUrl: './ins.component.html',
    providers: [TagsService, LinkService]
})
export class InsComponent implements OnInit, OnDestroy {

    fm: FormGroup;

    private connect;

    public listtype = [

        { title: "product.general", check: true, value: 0 },
        { title: "product.featured", check: true, value: 1 },
        { title: "product.hot", check: true, value: 2 },

    ];

    private conf = {
        getListGroup: {
            path: "pages/index/getlistgroup",
            token: 'getListGroup'
        },
        getRow: {
            path: "products/index/getrow",
            token: 'getRowProduct'
        },
        process: {
            path: "products/index/process",
            token: 'processProduct'
        }
    }

    public group = [];

    public mutiLang: any = [];
    public language_id: any;
    public id: number = 0;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
        public link: LinkService,
    ) {

        this.globals.send({ path: this.conf.getListGroup.path, token: this.conf.getListGroup.token, params: { type: 3 } });

        this.connect = this.globals.result.subscribe((res: any) => {
            switch (res.token) {

                case this.conf.getListGroup.token:
                    if (+res.status == 1) {
                        this.group = res.data;
                    }
                    break;

                case this.conf.getRow.token:

                    if (+res.status == 1 && Object.keys(res.data).length > 0) {
                        this.fmConfigs(res.data);
                        if (res.data.id && +res.data.id == this.id) {

                            this.listtype = this.listtype.filter(item => {

                                item.check = (res.data.type.find((row) => row == item.value) == undefined) ? false : true;

                                return true;
                            })

                        }
                        break;
                    } else {
                        this.router.navigate(['admin/products/process/update/'+this.id])
                    }
                    break;

                case this.conf.process.token:
                    let type = res['status'] == 1 ? 'success' : res['status'] == 0 ? 'warning' : 'danger'
                    this.toastr[type](res['message'], type, { timeOut: 1000 })
                    parseInt(res.data.id)
                    if (parseInt(res.data.id) > 0) {
                        if (res.data.price == 0) {
                            this.router.navigate(['/admin/products/process/price/' + +res.data.id]);
                        }
                        else {
                            setTimeout(() => {
                                this.router.navigate(['admin/products/process/update/'+this.id])
                            }, 100);
                        }
                    } else {
                        setTimeout(() => {
                            this.router.navigate(['admin/products/process/update/'+this.id])
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

        item = typeof item === 'object' ? item : { status: 1 };

        this.fm = this.fb.group({

            name: [item.name, [Validators.required, Validators.minLength(6)]],

            code: item.code ? item.code : '',

            link: item.link ? item.link : '',

            info: item.info ? item.info : '',

            views: item.views ? item.views : Math.floor(Math.random() * 6) + 1,

            detail: [item.detail ? item.detail : ''],

            page_id: item.page_id ? +item.page_id : 0,

            status: +item.status && +item.status === 1 ? true : false,
        });
    }

    getRow() {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } });
    }

    onChangeLink(e) {
        const url = this.link._convent(e.target.value);
        this.fm.value.link = url;
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : true
    }

    onSubmit() {

        const obj = this.fm.value;

        obj.type = JSON.stringify(Object.keys(this.listtype.reduce((n, o, i) => {

            if (o.check == true) {

                n[o.value] = o.value;

            }

            return n;
        }, {})));

        obj.status = obj.status === true ? 1 : 0;

        this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: obj, params: { id: this.id || 0 } });
    }
}