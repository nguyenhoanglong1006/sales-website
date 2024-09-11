import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../globals';

@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        getRow: {
            path: "settings/address/getrow",
            token: 'getRowAddress'
        },
        process: {
            path: "settings/address/process",
            token: 'processAddress'
        }
    }
    public id: number = 0;
    public fm: FormGroup;
    public flags: boolean = true

    public mutiLang: any = [];
    public lang_id: any;
    public idTamp: number = 0;
    public code: string = '';

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getRow.token:
                    if (Object.keys(resp.data).length > 0) {
                        this.code = resp.data.code;
                        this.id = resp.data.id;
                        this.lang_id = resp.data.language_id;
                        this.fmConfigs(resp.data);
                    } else {
                        this.id = 0;
                        this.fmConfigs();
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp['message'], type);
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/category/address/get-list/'])
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.routerAct.params.subscribe(params => {
            this.id = +params.id || 0;
            this.idTamp = +params.id || 0;
            if (this.id > 0) {
                this.getRow(this.id);
            } else {
                this.fmConfigs();
            }
        })
        this.code = String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getRow(id) {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: id, lang_id: this.lang_id } });
    }


    fmConfigs(item: any = "") {
        item = typeof item === 'object' ? item : { status: 1, type: 1, orders: 0 };
        this.fm = this.fb.group({
            name: [item.name ? item.name : '', [Validators.required]],
            orders: +item.orders ? +item.orders : 0,
            address: item.address ? item.address : '',
            phone: [item.phone ? item.phone : '', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
            email: [item.email ? item.email : '', [Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
            note: item.note ? item.note : '',
            status: (item.status && item.status == 1) ? true : false,
        });
    }

    onSubmit() {
        
        if (this.fm.valid && this.flags) {
            this.flags = false
            var data: any = this.fm.value;
            data.code = this.code;
            data.status = data.status == true ? 1 : 0;

            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0, lang_id: this.lang_id } });
        }
    }
}


