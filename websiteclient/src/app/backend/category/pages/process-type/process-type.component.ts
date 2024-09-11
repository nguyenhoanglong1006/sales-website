import { Component, OnInit, OnDestroy, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Globals } from '../../../../globals';
import { ToslugService } from '../../../../services/integrated/toslug.service';
import { uploadFileService } from '../../../../services/integrated/upload.service';
import { LinkService } from '../../../../services/integrated/link.service';
import { PagebuilderComponent } from "../../../modules/pagebuilder/pagebuilder.component";
import { AlertComponent } from 'src/app/backend/modules/alert/alert.component';

@Component({
    selector: 'app-process-type',
    templateUrl: './process-type.component.html',
    styleUrls: ['./process-type.component.css'],
    providers: [ToslugService, LinkService]
})
export class ProcessTypeComponent implements OnInit, OnDestroy {

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
        process: {
            path: "pages/index/process",
            token: 'processPage'
        },
        getHrefLang: {
            path: "pages/index/gethreflang",
            token: 'gethreflang'
        },
    }
    @ViewChild('inputSearchhreflang') private inputSearchhreflang: ElementRef;
    public fm: FormGroup;
    public id: number = 0;
    public listPages: any = [];
    public images = new uploadFileService();
    public icon = new uploadFileService();
    public background = new uploadFileService();
    public listimages = new uploadFileService();
    public type: number = 0;
    public flags: boolean = true;
    public modalRef: BsModalRef;
    public changeLink: boolean = true;

    public options = {
        fields: [
            { name: "Icon", empty: "", field: "icon", enable: true },
            { name: "Video", empty: "", field: "link_video", enable: false },
            { name: "Info", empty: "", field: "info", enable: false },
            { name: "background", empty: "", field: "background", enable: true },
            { name: "List images", empty: "[]", field: "listimages", enable: false },
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
        public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public globals: Globals,
        public link: LinkService,
        private routerAct: ActivatedRoute,
        private modalService: BsModalService,
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getListPage.token:
                    if (resp.status == 1) {
                        this.listPages = this.pageParent._compaid(resp.data);
                    }
                    break;

                case this.conf.getRow.token:
                    if (resp.status == 1 && Object.keys(resp.data).length > 0) {
                        this.pageParent.name = resp.data.parent_name;
                        this.fmConfigs(resp.data);
                        this.getListPages(this.type);
                    } else {
                        this.id = 0;
                        this.fmConfigs();
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";
                    this.toastr[type](resp["message"], type);
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/category/' + this.router.url.split('/')[3] + '/update', resp.data])
                    }
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        switch (this.router.url.split('/')[3]) {
            case 'product':
                this.type = 3
                break;
            case 'content':
                this.type = 4
                break;
            case 'library':
                this.type = 5
                break;
            case 'customer':
                this.type = 6
                break;
            default:
                break;
        }
        this.getListPages(this.type);
        this.routerAct.params.subscribe((params) => {
            this.id = +params["id"] || 0;
            this.idTamp = +params.id || 0;
            if (+this.id > 0) {
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

    getListPages(type = 0) {
        this.globals.send({ path: this.conf.getListPage.path, token: this.conf.getListPage.token, params: { type: type, lang_id: +this.lang_id } });
    }

    fmConfigs(item: any = "") {

        item = typeof item === "object" ? item : { status: 1, page_id: +this.idGroup > 0 ? this.idGroup : 0, orders: 0 };

        this.fm = this.fb.group({
            name: [item.name ? item.name : "", [Validators.required]],
            orders: +item.orders ? +item.orders : 0,
            link: [item.link ? item.link : "", [Validators.required]],
            page_id: +item.page_id ? +item.page_id : 0,
            info: item.info ? item.info : "",
            detail: item.detail ? item.detail : "",
            description: [item.description ? item.description : "", [Validators.maxLength(325)]],
            icon: item.icon ? item.icon : "",
            link_video: item.link_video ? item.link_video : "",
            code: item.code ? item.code : "",
            title: item.title ? item.title : "",
            title_seo: [item.title_seo ? item.title_seo : "", [Validators.maxLength(75)]],
            builder: item.builder ? item.builder : '',
            position: item.position ? item.position : 0,
            status: item.status && item.status == 1 ? true : false,
        });
        this.images = new uploadFileService();
        this.icon.data = [];
        this.background.data = [];
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

    public pageParent = {
        name: '',
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
            this.flags = false
            let data: any = this.fm.value;
            data.code = this.code;
            data.name = data.name.trim();
            data.status = data.status == true ? 1 : 0;
            this.changeLink ? data.link = this.link._convent(data.link) : '';
            data.images = this.images._get(true);
            data.icon = this.icon._get(true);
            data.background = this.background._get(true);
            data.listimages = this.listimages._get(true);
            data.images.path = 'uploads/pages/';
            data.icon.path = 'uploads/pages/';
            data.background.path = 'uploads/pages/';
            data.listimages.path = 'uploads/pages/';
            data.type = this.type;
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0, lang_id: this.lang_id } });
        }
    }
}
