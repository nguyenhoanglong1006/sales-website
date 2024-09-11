import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AUTHORIZATION_LIST } from '~/backend/authorization';

import { Globals } from '~/globals';
import { uploadFileService } from '~/services/integrated/upload.service';

@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getRow: {
            path: "customers/index/getrow",
            token: 'getRowUser'
        },
        process: {
            path: "customers/index/process",
            token: 'processUser'
        }
    }

    public fm: FormGroup;
    public id: number = 0;
    public type = "password";
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
                    let data = resp.data;
                    this.fmConfigs(data);
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/customers/get-list']);
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
            this.id = +params['id'] || 0;
            if (+this.id > 0) {
                this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } });
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
            phone: [data.phone ? data.phone : '', [Validators.pattern("^[0-9]*$")]],
            email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
            address: data.address ? data.address : '',
            password: [data.password ? data.password : '', [Validators.required, Validators.minLength(8)]],
            note: data.note ? data.note : '',
            status: (data.status && data.status == 1) ? true : false,
        })
        if (data.code) {
            this.fm.controls['code'].disable();
        }
    }

    randomPass() {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()<>?{}[]";
        var value = "";
        for (var x = 0; x < 9; x++) {
            var i = Math.floor(Math.random() * chars.length);
            value += chars.charAt(i);
        }
        this.fm.get('password').setValue(value);
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
