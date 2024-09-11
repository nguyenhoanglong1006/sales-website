import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../globals';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy, AfterViewInit {

    public hide = true;
    public type = "password";
    public fm: FormGroup;
    public company: any;
    public connect;
    flag: boolean = false;
    conf = {
        login: {
            path: 'browsers/index/login',
            token: 'loginAdmin'
        }
    }
    constructor(
        public formBuilder: FormBuilder,
        public toastr: ToastrService,
        private globals: Globals,
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.fm = formBuilder.group({
            'email': ['', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
            'password': ['', [Validators.required, Validators.minLength(8)]]
        });

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.login.token:
                    this.flag = !this.flag;
                    let type = (+resp.status == 1) ? "success" : (+resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type);
                    if (+resp.status === 1) {
                        setTimeout(() => {
                            this.globals.USERS.set(resp.data);
                            this.router.navigate([this.globals.admin + '/dashboard']);
                        }, 500);
                    }
                    break;
                default:
                    break;
            }
        })
    }

    ngOnInit() {
        
    }

    ngAfterViewInit() {
        if (this.globals.USERS.check()) {
            this.router.navigate(['/admin/dashboard']);
        }
    }

    ngOnDestroy() {
        if(this.connect){
            this.connect.unsubscribe();
        }
    }

    onSubmit() {
        if (!this.flag && this.fm.valid) {
            this.flag = !this.flag;
            let data = this.fm.value;
            this.globals.send({ path: this.conf.login.path, token: this.conf.login.token, params: data });
        }
    }
}