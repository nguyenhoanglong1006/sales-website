import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../globals';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-forget',
    templateUrl: './forget.component.html',
    styleUrls: ['./forget.component.css']
})

export class ForgetCustomerComponent implements OnInit, OnDestroy {
    public type = "password";
    public connect;
    public fmSendMail: FormGroup;
    public fmOtpCheckMail: FormGroup;
    public resetPassword: FormGroup;
    public hide: boolean = true;
    public conf = {
        forget: {
            token: 'forgetPassword',
            path: 'browsers/index/forgetcustomer'
        },
        otp: {
            token: 'checkOtpForget',
            path: 'browsers/index/otpcheckcustomer'
        },
        resetPass: {
            token: 'resetPasswordForget',
            path: 'browsers/index/resetcustomerpassword'
        }
    }
    index = 0;
    public flag = true;
    constructor(
        public fmBuilder: FormBuilder,
        public globals: Globals,
        public router: Router,
        public toastr: ToastrService,
        public modalRef: BsModalRef,
    ) {
        let type = '';
        this.connect = this.globals.result.subscribe((resp: any) => {

            switch (resp.token) {

                case this.conf.forget.token:
                    type = (+resp.status == 1) ? "success" : (+resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.index = 1;
                    }
                    this.flag = true;
                    break;

                case this.conf.otp.token:
                    if (resp.status == 1) {
                        this.index = 2;
                    } else {
                        type = (+resp.status == 1) ? "success" : (+resp.status == 0 ? "warning" : "danger");
                        this.toastr[type](resp.message, type);
                    }
                    this.flag = true;
                    break;

                case this.conf.resetPass.token:
                    type = (+resp.status == 1) ? "success" : (+resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.router.navigate(['/dang-nhap'])
                    }
                    break;
                default:
                    break;
            }
        });
    }



    ngOnInit() {

        this.fmSendMail = this.fmBuilder.group({
            email: ['', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]]
        });

        this.fmOtpCheckMail = this.fmBuilder.group({
            otp: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]]
        });

        this.resetPassword = this.fmBuilder.group({
            password: ['',  [Validators.required, Validators.minLength(8)]]
        });
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    _sendOTPMail() {
        if (this.flag) {

            this.flag = false;

            let data = this.fmSendMail.value;

            this.globals.send({ path: this.conf.forget.path, token: this.conf.forget.token, data: data });
        }
    }

    _submitOTPMail() {

        if (this.flag) {

            this.flag = false;

            let data = this.fmOtpCheckMail.value;

            data.email = this.fmSendMail.value.email;

            this.globals.send({ path: this.conf.otp.path, token: this.conf.otp.token, data: data });
        }
    }

    _resetPassword() {

        if (this.flag) {

            let data = this.resetPassword.value;

            data.email = this.fmSendMail.value.email;

            this.globals.send({ path: this.conf.resetPass.path, token: this.conf.resetPass.token, data: data });

            this.modalRef.hide();
        }
    }
}
