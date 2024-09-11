import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../globals';

@Component({
    selector: 'app-changespassword',
    templateUrl: './changespassword.component.html',
})
export class ChangespasswordComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        changesPassword: {
            path: "customers/index/changepassword",
            token: 'changesPassword'
        },
        getRow: {
            path: "customers/index/getrow",
            token: 'getRowUser'
        },
    }
    public id: number = 0;
    public item: any = {};
    public fm: FormGroup;
    public type = "password";
    public flags: boolean = true
    constructor(
        public router: Router,
        public toastr: ToastrService,
        private routerAct: ActivatedRoute,
        public fb: FormBuilder,
        public globals: Globals
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {

            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");

            switch (resp.token) {

                case this.conf.getRow.token:
                    if (resp.status == 1) {
                        this.item = resp.data;
                    }
                    break;

                case this.conf.changesPassword.token:
                    this.flags = true;
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        setTimeout(() => {
                            if (resp.data.skip) {
                                this.globals.USERS.remove();
                                this.router.navigate(['/login']);
                            } else {
                                this.router.navigate([this.globals.admin + '/customers/get-list']);
                            }
                        }, 100);
                    }
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.fm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]]
        })
        this.routerAct.params.subscribe(params => {
            this.id = +params['id'] || 0;
            if (this.id > 0) {
                this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } })
            }
        })
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    onSubmit() {
        if (this.flags && this.fm.valid) {
            this.flags = false;
            let data = this.fm.value;
            
            this.globals.send({ path: this.conf.changesPassword.path, token: this.conf.changesPassword.token, data: data, params: { id: this.id || 0 } });
        }
    }
}
