import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";

import { Globals } from "../../../globals";
import { uploadFileService } from "../../../services/integrated/upload.service";
import { LinkService } from "../../../services/integrated/link.service";
import { ToslugService } from '../../../services/integrated/toslug.service';
import { PagebuilderComponent } from "../../modules/pagebuilder/pagebuilder.component";
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
        getListPage: {
            path: "pages/index/getlist",
            token: 'getListPage'
        },
        getRow: {
            path: "pages/index/getrow",
            token: 'getRowPage'
        },
        // getListLibrary: {
        //     path: "pages/index/getlistlibrary",
        //     token: 'getListLibrary'
        // },

        process: {
            path: "pages/index/process",
            token: 'processPage'
        }
    }

    public options = {
        fields: [
            { name: "Icon", empty: "", field: "icon", enable: false },
            { name: "Video", empty: "", field: "link_video", enable: false },
            { name: "Info", empty: "", field: "info", enable: false },
            { name: "Background", empty: "", field: "background", enable: false },
            { name: "List images", empty: "[]", field: "listimages", enable: false },
            // { name: "List library", empty: "[]", field: "list_library", enable: false },
        ],
        dataCheck: [],
        _ini: (data = []) => {
            if (data && Object.keys(data).length > 0) {
                this.options.fields.forEach(f => {
                    if (data[f.field] && data[f.field].toString().length > 0 && data[f.field].toString() != f.empty) {
                        f.enable = true
                    }
                })
            }
            this.options.dataCheck = this.options.fields.reduce((n, o, i) => { n[o.field] = o; return n }, [])
        },
        onChange: (option) => {
            option.enable = !option.enable;
        },
        openModal: (template: TemplateRef<any>) => {
            this.modalRef = this.modalService.show(template);
        }
    }

    public id: number;
    public listPage: [];
    public required: boolean = false;
    public images = new uploadFileService();
    public background = new uploadFileService();
    public icon = new uploadFileService();
    public listimages = new uploadFileService();
    public modalRef: BsModalRef;
    public flags: boolean = true;
    public changeLink: boolean = true;

    public library = {
        data: [],
        _get: () => {
            let result = this.library.data.filter((item: any) => item.checked == true);
            return JSON.stringify(Object.keys(result.reduce((n, o) => { n[o.id] = o; return n; }, [])));
        },
        _check: (item, e) => {
            item.checked = e.target.checked;
        },
        _ini: (data) => {
            data = JSON.parse(data && data != '' ? data : '[]').reduce((n, o) => { n[o] = o; return n }, []);
            for (let i = 0; i < this.library.data.length; i++) {
                let item = this.library.data[i];
                item.checked = data[item.id] ? true : false;
            }
        }
    };

    public position = [
        { value: 0, name: "pages.hidden" },
        { value: 1, name: "pages.top" },
        { value: 2, name: "pages.bottom" },
    ];

    public mutiLang: any = [];
    public lang_id: any;
    public idTamp: number = 0;
    public code: string = '';
    public idGroup: number = 0;
    public parent_name_lang: string = '';

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
                            this.pageParent.name = resp.data.parent_name;
                            this.fmConfigs(resp.data);
                            this.onChangeType(this.fm.value.type);
                        } else {
                            this.id = 0;
                            this.fmConfigs();
                        }
                    }
                    break;

                case this.conf.getListPage.token:
                    if (resp.status == 1) {
                        this.listPage = this.pageParent._compaid(resp.data);
                    }
                    break;

                // case this.conf.getListLibrary.token:
                //     if (resp.status == 1) {
                //         this.library.data = resp.data;
                //     }
                //     break;


                case this.conf.process.token:
                    this.flags = true
                    let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";
                    this.toastr[type](resp["message"], type);
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/pages/update/', resp.data])
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        // this.globals.send({ path: this.conf.getListLibrary.path, token: this.conf.getListLibrary.token, params: { lang_id: +this.lang_id } });
        this.routerAct.params.subscribe((params) => {
            this.id = +params["id"] || 0;
            this.idTamp = +params.id || 0;
            if (+this.id && +this.id > 0) {
                this.getRow(this.id);
            } else {
                this.fmConfigs();
                this.onChangeType(this.fm.value.type)
            }
        });
        this.code = 'p' + String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);
    }
    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    onChangeType(value, flag = false) {
        this.fm.controls['type'].setValue(value);
        if (flag) {
            this.fm.controls['link'].setValue('');
            this.fm.controls['target_blank'].setValue(0);
        }
        this.fm.value.type == 2 ? this.fm.controls["link"].setValidators([Validators.required]) : this.fm.controls["link"].clearValidators();
        this.fm.controls["link"].updateValueAndValidity();

        this.getListPages();

    }

    getRow(id) {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: id, lang_id: this.lang_id } });
    }

    getListPages() {
        this.globals.send({ path: this.conf.getListPage.path, token: this.conf.getListPage.token, params: { type: 0, lang_id: +this.lang_id } });
    }

    fmConfigs(item: any = "") {

        item = typeof item === "object" ? item : { status: 1, page_id: +this.idGroup > 0 ? this.idGroup : 0, orders: 0, type: 2 };

        this.fm = this.fb.group({
            name: [item.name ? item.name : "", [Validators.required]],
            orders: +item.orders ? +item.orders : 0,
            link: [item.link ? item.link : "", [Validators.required]],
            page_id: +item.page_id ? +item.page_id : 0,
            detail: item.detail ? item.detail : "",
            description: [item.description ? item.description : "", [Validators.maxLength(325)]],
            icon: item.icon ? item.icon : "",
            link_video: item.link_video ? item.link_video : "",
            list_library: item.list_library ? item.list_library : "",
            type: item.type ? item.type : 2,
            info: item.info ? item.info : "",
            code: item.code ? item.code : "",
            title: item.title ? item.title : "",
            title_seo: [item.title_seo ? item.title_seo : "", [Validators.maxLength(75)]],
            target_blank: item.target_blank ? item.target_blank : 0,
            builder: item.builder ? item.builder : '',
            position: item.position ? item.position : 0,
            status: item.status && item.status == 1 ? true : false,
        });
        this.images = new uploadFileService();
        this.background.data = [];
        this.icon.data = [];
        const imagesConfig = {
            path: this.globals.BASE_API_URL + ((item.images && !item.images.includes('uploads/pages/')) ? 'uploads/pages/' : ''),
            data: item.images ? item.images : "",
        };
        this.images._ini(imagesConfig);

        const backgroundConfig = {
            path: this.globals.BASE_API_URL + ((item.background && !item.background.includes('uploads/pages/')) ? 'uploads/pages/' : ''),
            data: item.background ? item.background : "",
        };
        this.background._ini(backgroundConfig);

        const iconConfig = {
            path: this.globals.BASE_API_URL + ((item.icon && !item.icon.includes('uploads/pages/')) ? 'uploads/pages/' : ''),
            data: item.icon ? item.icon : "",
        };
        this.icon._ini(iconConfig);

        const listimagesConfig = {
            path: this.globals.BASE_API_URL + ((item.images && !item.images.includes('uploads/pages/')) ? 'uploads/pages/' : ''),
            data: item.listimages ? item.listimages : "",
            multiple: true,
        };
        this.listimages._ini(listimagesConfig);

        this.options._ini(item);

        this.library._ini(item.list_library);
    }


    public pageParent = {
        name: '',
        item: <any>false,

        _compaid: (data) => {
            let list = [];
            data = data.filter(function (item) {
                let v = (isNaN(+item.page_id) && item.page_id) ? 0 : +item.page_id;
                v == 0 ? '' : list.push(item);
                return v == 0 ? true : false;
            })
            let compaidmenu = (data, skip, level = 0) => {
                level = level + 1;
                if (skip == true) {
                    return data;
                } else {
                    for (let i = 0; i < data.length; i++) {
                        let obj = data[i]['data'] && data[i]['data'].length > 0 ? data[i]['data'] : []
                        list = list.filter(item => {
                            let skip = (+item.page_id == +data[i]['id']) ? false : true;
                            if (skip == false) { obj.push(item); }
                            return skip;
                        })
                        let skip = (obj.length == 0) ? true : false;

                        data[i]['level'] = level;
                        data[i]['data'] = compaidmenu(obj, skip, level);
                    }
                    return data;
                }
            };

            return compaidmenu(data, false);
        },

        _select: (item) => {
            this.pageParent.name = this.id > 0 ? ((item.id == this.id) || (item.page_id == this.id) ? '' : item.name) : item.name;
            this.fm.controls['page_id'].setValue(this.id > 0 ? ((item.id == this.id) || (item.page_id == this.id) ? 0 : item.id) : item.id);
            if (this.id > 0 && ((item.id == this.id) || (item.page_id == this.id))) {
                let type = "warning";
                this.toastr[type]('Không chọn chính nó làm trang cha hoặc trang con làm trang cha', type);
            }
        },
    }

    onChangeLink(e) {
        if (this.fm.value.type == 2) {
            const url = this.link._convent(e.target.value.trim());
            this.fm.controls['link'].setValue(url);
        }
    }

    pageBuilder = {
        flag: false,
        _openModal: () => {
            this.pageBuilder.flag = true;
            this.modalRef = this.modalService.show(PagebuilderComponent, {
                class: 'full-screen-modal',
                initialState: { data: this.fm.value.builder }
            });
            this.modalRef.content.onClose.subscribe(result => {
                this.pageBuilder.flag = (result.length > 0 || result == true) ? false : true;
                if (result.length > 0) {
                    this.fm.controls['builder'].setValue(result);
                }
                document.querySelector('.fp-add-view') ? document.querySelector('.fp-add-view').classList.remove('fp-add-view') : '';
                document.querySelector('.fp-full-view') ? document.querySelector('.fp-full-view').classList.remove('fp-full-view') : '';
                document.querySelector('.fr-tooltip') ? document.querySelector('.fr-tooltip').classList.remove('fr-tooltip') : '';
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
                    this.fm.controls['builder'].setValue('');
                }
            });
        }
    }


    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false;
            let data: any = this.fm.value;
            data.code = this.code;
            data.name = data.name.trim();
            data.link = data.link.trim();
            data.status = data.status == true ? 1 : 0;
            this.fm.value.type == 2 ? data.link = this.link._convent(data.link) : '';
            data.images = this.images._get(true);
            data.background = this.background._get(true);
            data.icon = this.icon._get(true);
            data.listimages = this.listimages._get(true);
            data.list_library = this.library._get();
            data.images.path = 'uploads/pages/';
            data.icon.path = 'uploads/pages/';
            data.background.path = 'uploads/pages/';
            data.listimages.path = 'uploads/pages/';

            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0, lang_id: this.lang_id } });
        }
    }
}
