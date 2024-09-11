import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../globals';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
})
export class EmailComponent implements OnInit, OnDestroy {

    fm: FormGroup;

    public connect: any;

    public flag: boolean = true;

    private conf = {
        getrow: {
            path: 'settings/email/get',
            token: 'getRowEmail'
        },
        process: {
            path: 'settings/email/set',
            token: 'processEmail'
        }
    }

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public globals: Globals,
    ) {
        this.connect = this.globals.result.subscribe((response: any) => {

            let type = (response['status'] == 1) ? "success" : (response['status'] == 0 ? "warning" : "danger");

            switch (response['token']) {

                case this.conf.getrow.token:
                    if (response.status == 1) {
                        let data = response['data'];
                        this.fm = this.fb.group({
                            server: data.server ? data.server : '',
                            protocol: data.protocol ? data.protocol : '',
                            port: data.port ? data.port : '',
                            timeconnect: data.timeconnect ? data.timeconnect : '',
                            password: [data.password ? data.password : '', [Validators.required]],
                            email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
                        });
                    }
                    break;

                case this.conf.process.token:
                    this.toastr[type](response['message'], type);
                    if (response['status'] == 1) {
                        this.getRow()
                    }
                    this.flag = true;
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.getRow()
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe()
        }
    }

    getRow() { this.globals.send({ path: this.conf.getrow.path, token: this.conf.getrow.token }); }

    onSubmit() {
        if (this.flag) {
            this.flag = false;
            let data = this.fm.value;
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data });
        }
    }
}
