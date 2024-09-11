import { Component, OnInit, OnDestroy } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Globals } from "../../../globals";
import { uploadFileService } from "../../../services/integrated/upload.service";

@Component({
    selector: "app-process",
    templateUrl: "./process.component.html"
})
export class ProcessComponent implements OnInit, OnDestroy {

    fm: FormGroup;

    private connect;

    public listgrouplibrary: any;

    private conf = {
        getrow: {
            path: 'library/index/getrow',
            token: 'getRowLibrary'
        },
        process: {
            path: 'library/index/process',
            token: 'processLibrary'
        },
        getlistgroup: {
            path: 'pages/index/getlistgroup',
            token: 'getListGroup'
        }
    }

    public images = new uploadFileService();

    public id: number;

    public flag: boolean = true;

    public mutiLang: any = [];
    public lang_id: any;
    public idTamp: number = 0;
    public code: string = '';
    public idGroup: number = 0;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";
            switch (resp.token) {
                case this.conf.getrow.token:
                    if (resp.status == 1) {
                        if (Object.keys(resp.data).length > 0) {
                            this.code = resp.data.code;
                            this.id = resp.data.id;
                            this.idGroup = resp.data.group_id;
                            this.lang_id = resp.data.language_id;
                            this.globals.send({ path: this.conf.getlistgroup.path, token: this.conf.getlistgroup.token, params: { type: 5, lang_id: +this.lang_id } });
                            this.fmConfigs(resp.data);
                        } else {
                            this.id = 0;
                            this.fmConfigs();
                        }
                    }
                    break;

                case this.conf.getlistgroup.token:
                    if (resp.status == 1) {
                        this.listgrouplibrary = resp.data;
                    }
                    break;

                case this.conf.process.token:
                    this.flag = true;
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/library/update/', resp.data])
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
            if (this.id && this.id != 0) {
                this.globals.send({ path: this.conf.getrow.path, token: this.conf.getrow.token, params: { id: this.id, lang_id: this.lang_id } });
            } else {
                this.fmConfigs();
                this.globals.send({ path: this.conf.getlistgroup.path, token: this.conf.getlistgroup.token, params: { type: 5, lang_id: +this.lang_id } });

            }
        });
        this.code = String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    fmConfigs(item: any = "") {

        item = typeof item === "object" ? item : { status: 1, type: 1, page_id: +this.idGroup > 0 ? this.idGroup : "" };

        this.fm = this.fb.group({

            name: [item.name ? item.name : "", [Validators.required]],

            images: item.images ? item.images : "",

            value: item.value ? item.value : "",

            orders: +item.orders ? +item.orders : 0,

            page_id: [item.page_id ? item.page_id : "", [Validators.required]],

            type: +item.type ? +item.type : "",

            description: item.description ? item.description : "",

            note: item.note ? item.note : "",

            status: item.status && item.status == 1 ? true : false,
        });
        const imagesConfig = {

            path: this.globals.BASE_API_URL + ((item.images && !item.images.includes('uploads/library/')) ? 'uploads/library/' : ''),
            data: item.images ? item.images : "",
        };
        this.images = new uploadFileService();
        this.images._ini(imagesConfig);
    }

    changeUrlVideo(e) {
        e.target.value = e.target.value.replace("watch?v=", "embed/");
    }

    onSubmit() {
        if (this.flag) {
            this.flag = false;
            var data: any = this.fm.value;
            data.code = this.code;
            data.name = data.name.trim();
            data.images = this.images._get(true);
            data.images.path = 'uploads/library/';
            data.status = data.status == true ? 1 : 0;

            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: +this.id, lang_id: this.lang_id } });
        }
    }
}
