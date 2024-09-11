import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../globals';
import { LinkService } from '../../../../services/integrated/link.service';
import { ToslugService } from '../../../../services/integrated/toslug.service';

@Component({
    selector: 'app-process-tag',
    templateUrl: './process.component.html',
    providers: [LinkService, ToslugService]
})
export class ProcessComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        getRow: {
            path: "settings/tags/getrow",
            token: 'getRowtags'
        },
        process: {
            path: "settings/tags/process",
            token: 'processtags'
        },
    }
    public id: number = 0;
    public fm: FormGroup;
    public flags: boolean = true;

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
        public link: LinkService,
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
                        this.router.navigate(['/admin/category/tags/update', resp.data])
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
        this.code = 't' + String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);
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
            link: [item.link ? item.link : '', [Validators.required]],
            title: [item.title ? item.title : '', [Validators.maxLength(75)]],
            description: [item.description ? item.description : '', [Validators.maxLength(325)]],
            status: (item.status && item.status == 1) ? true : false,
        });
    }


    onChangeLink(e) {
        const url = this.link._convent(e.target.value);
        this.fm.value.link = url;
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
