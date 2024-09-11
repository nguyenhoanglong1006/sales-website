import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../globals';
import { TagsService } from '../../../../services/integrated/tags.service';

@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
    providers: [TagsService]
})
export class ProcessComponent implements OnInit, OnDestroy {


    private connect;
    private conf = {
        getRow: {
            path: "settings/pagebuilder/getrow",
            token: 'getRowPageBuilder'
        },
        process: {
            path: "settings/pagebuilder/process",
            token: 'processPageBuilder'
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
        public tags: TagsService,
    ) {

        this.connect = this.globals.result.subscribe((resp: any) => {

            switch (resp.token) {

                case this.conf.getRow.token:
                    if (Object.keys(resp.data).length > 0) {
                        this.fmConfigs(resp.data);
                    } else {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/category/page-builder/get-list']);
                        }, 100);
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp['message'], type);
                    if (resp.status == 1) {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/category/page-builder/get-list']);
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
            name: [item.name ? item.name : '', [Validators.required]],
            description: item.description ? item.description : '',
            detail: item.detail ? item.detail : '',
            status: (item.status && item.status == 1) ? true : false,
        });
    }

    changeUrlVideo(e) {
        e.target.value = +this.fm.value.type === 2 ? e.target.value.replace('watch?v=', 'embed/') : e.target.value;
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false
            var data: any = this.fm.value;
            data.status = data.status == true ? 1 : 0;
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0 } })
        }
    }
}
