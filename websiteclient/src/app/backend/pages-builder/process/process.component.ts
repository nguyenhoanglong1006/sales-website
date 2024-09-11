import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";

import { Globals } from "../../../globals";
import { LinkService } from "../../../services/integrated/link.service";
import { PagebuilderComponent } from "../../modules/pagebuilder/pagebuilder.component";
import { ToslugService } from '../../../services/integrated/toslug.service';
import { AlertComponent } from "../../modules/alert/alert.component";


@Component({
    selector: "app-process",
    templateUrl: "./process.component.html",
    styleUrls: ['./process.component.css'],
    providers: [ToslugService, LinkService]
})
export class ProcessComponent implements OnInit, OnDestroy {
    public fm: FormGroup;
    private connect;
    private conf = {
        getRow: {
            path: "pages/index/getrow",
            token: 'getRowPage'
        },
        process: {
            path: "pages/index/process",
            token: 'processPage'
        }
    }
    public id: number;
    public required: boolean = false;
    public listPages: any = [];
    public type: number = 11;
    public modalRef: BsModalRef;
    public flags: boolean = true;
    public changeLink: boolean = true;

    public mutiLang: any = [];
    public lang_id: any;
    public idTamp: number = 0;
    public code: string = '';
    public idGroup: number = 0;

    constructor(
        public globals: Globals,
        public fb: FormBuilder,
        public router: Router,
        public link: LinkService,
        private toastr: ToastrService,
        private routerAct: ActivatedRoute,
        private modalService: BsModalService,
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getRow.token:
                    if (resp.status == 1) {
                        if (Object.keys(resp.data).length > 0) {
                            this.code = resp.data.code;
                            this.id = resp.data.id;
                            this.idGroup = resp.data.group_id;
                            this.lang_id = resp.data.language_id;
                            this.fmConfigs(resp.data);
                        } else {
                            this.id = 0;
                            this.fmConfigs();
                        }
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";
                    this.toastr[type](resp["message"], type);
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/pages-builder/update/', resp.data])
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.routerAct.params.subscribe((params) => {
            this.id = +params["id"] || 0;
            this.idTamp = +params.id || 0;
            if (this.id && this.id > 0) {
                this.getRow(this.id);
            } else {
                this.fmConfigs();
            }
        });
        this.code = 'p' + String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getRow(id) {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: id, lang_id: this.lang_id } });
    }

    fmConfigs(item: any = "") {

        item = typeof item === "object" ? item : { status: 1, page_id: 0, orders: 0 };

        this.fm = this.fb.group({
            name: [item.name ? item.name : "", [Validators.required]],
            orders: +item.orders ? +item.orders : 0,
            link: [item.link ? item.link : "", [Validators.required]],
            page_id: +item.page_id ? +item.page_id : 0,
            detail: item.detail ? item.detail : "",
            icon: item.icon ? item.icon : "",
            link_video: item.link_video ? item.link_video : "",
            list_library: item.list_library ? item.list_library : "",
            info: item.info ? item.info : "",
            title: item.title ? item.title : "",
            type_builder: item.type_builder ? item.type_builder : 1,
            title_seo: [item.title_seo ? item.title_seo : "", [Validators.maxLength(75)]],
            description: [item.description ? item.description : "", [Validators.maxLength(325)]],
            keywords: item.keywords ? item.keywords : "",
            status: item.status && item.status == 1 ? true : false,
        });

    }

    onChangeLink(e, skip = 0) {
        const url = this.link._convent(e.target.value.trim());
        if (skip == 0) {
            this.fm.controls['link'].setValue(url);
            this.changeLink = true;
        } else {
            this.changeLink = false;
        }
    }

    public language = {
        _change: (id) => {
            if (id != this.lang_id) {
                this.lang_id = id;
                this.id = this.idTamp > 0 ? this.idTamp : this.id;
                if (this.id && this.id > 0) {
                    this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { code: this.code, lang_id: this.lang_id } });
                } else {
                    this.fmConfigs();
                }
            }
        },
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false;
            let data: any = this.fm.value;
            data.code = this.code;
            data.name = data.name.trim();
            data.status = data.status == true ? 1 : 0;
            this.changeLink ? data.link = this.link._convent(data.link) : '';
            data.type = this.type;

            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0, lang_id: this.lang_id } });
        }
    }

    pageBuilder = {
        flag: false,
        _openModal: () => {
            this.pageBuilder.flag = true;
            this.modalRef = this.modalService.show(PagebuilderComponent, {
                class: 'full-screen-modal',
                initialState: { data: this.fm.value.detail }
            });
            this.modalRef.content.onClose.subscribe(result => {
                this.pageBuilder.flag = (result.length > 0 || result == true) ? false : true;
                if (result.length > 0) {
                    this.fm.controls['detail'].setValue(result);
                }
                document.querySelector('.fp-add-view') ? document.querySelector('.fp-add-view').classList.remove('fp-add-view') : '';
                document.querySelector('.fp-full-view') ? document.querySelector('.fp-full-view').classList.remove('fp-full-view') : '';
                let toolbar = document.querySelectorAll('.fp-block-toolbar');
                if (toolbar.length > 0) {
                    for (let i = 0; i < toolbar.length; i++) {
                        toolbar[i].remove()
                    }
                }
            })
        },

        _clear: () => {
            this.modalRef = this.modalService.show(AlertComponent, {
                initialState: { messages: 'pageBuilder.removeBlock' }
            });
            this.modalRef.content.onClose.subscribe(result => {
                if (result == true && this.id > 0) {
                    this.fm.controls['detail'].setValue('');
                }
            });
        }
    }

    onChangeType() {
        this.fm.controls['detail'].setValue('');
    }
}
