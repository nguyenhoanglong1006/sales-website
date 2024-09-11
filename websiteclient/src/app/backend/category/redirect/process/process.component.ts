import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../globals';


@Component({
    selector: 'app-process-tag',
    templateUrl: './process.component.html'
})
export class ProcessComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        getRow: {
            path: "settings/redirect/getrow",
            token: 'getRowRedirect'
        },
        process: {
            path: "settings/redirect/process",
            token: 'processRedirect'
        }
    }
    public id: number = 0;
    public fm: FormGroup;
    public flags: boolean = true
    constructor(
        public fb: FormBuilder,
        public router: Router,
        private toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
    ) {

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getRow.token:
                    if (Object.keys(resp.data).length > 0) {
                        this.fmConfigs(resp.data);
                    } else {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/category/redirect/get-list']);
                        }, 100);
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp['message'], type);
                    if (resp.status == 1) {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/category/redirect/get-list']);
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
            this.id = +params.id || 0;
            if (this.id > 0) {
                this.getRow(this.id);
            } else {
                this.fmConfigs();
            }
        })
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getRow(id) {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: id } });
    }

    fmConfigs(item: any = "") {
        item = typeof item === 'object' ? item : { status: 1, type: 1, orders: 0 };
        this.fm = this.fb.group({
            status_code: [item.status_code ? item.status_code : '200', [Validators.required]],
            link: [item.link ? item.link : '', [Validators.required]],
            link_redirect: [item.link_redirect ? item.link_redirect : '', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false
            var data: any = this.fm.value;
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0 } })
        }
    }
}
