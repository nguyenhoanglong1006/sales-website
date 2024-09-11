import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { TagsService } from '~/services/integrated/tags.service';
import { uploadFileService } from '~/services/integrated/upload.service';

@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
    providers: [TagsService]
})
export class ProcessComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getRow: {
            path: "settings/sliders/getrow",
            token: 'getRow'
        },
        process: {
            path: "settings/sliders/process",
            token: 'processSliders'
        }
    }

    public images = new uploadFileService();

    public imagesMobile = new uploadFileService();

    public id: number = 0;

    public fm: FormGroup;
    public flag: boolean = true;

    /* public position = [
        { value: 1, name: "settings.slide.left" },
        { value: 2, name: "settings.slide.center" },
        { value: 3, name: "settings.slide.right" },
        { value: 4, name: "settings.slide.hidden" },
    ] */

    public mutiLang: any = [];
    public lang_id: any;
    public code: string = '';

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
        public tags: TagsService,
    ) {

        this.lang_id = this.globals.language.get(true);

        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getRow.token:
                    if (resp.status == 1 && Object.keys(resp.data).length > 0) {
                        this.fmConfigs(resp.data);
                    } else {
                        this.id = 0;
                        this.fmConfigs();
                    }
                    break;

                case this.conf.process.token:
                    this.flag = true;
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp['message'], type);
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/category/slide/update/', +resp.data.id])
                    }
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.code = String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);

        this.routerAct.params.subscribe(params => {
            this.id = +params.id || 0;
            +this.id > 0 ? this.getRow(+this.id) : this.fmConfigs();
        })
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getRow(id) {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: id } });
    }

    fmConfigs(item: any = "") {

        item = typeof item === 'object' ? item : { status: 1, type: 1 };

        this.fm = this.fb.group({
            name: [item.name ? item.name : '', [Validators.required]],
            link: item.link ? item.link : '',
            orders: +item.orders ? +item.orders : 0,
            type: +item.type ? +item.type : '',
            title: item.title ? item.title : '',
            title_seo: item.title_seo ? item.title_seo : '',
            // position: item.position ? item.position : 0,
            description: item.description ? item.description : '',
            status: (item.status && item.status == 1) ? true : false,
        });

        this.images = new uploadFileService();
        this.imagesMobile.data = [];

        const imagesConfig = {
            path: this.globals.BASE_API_URL + ((item.images && !item.images.includes('uploads/sliders/')) ? 'uploads/sliders/' : ''),
            data: item.images ? item.images : ''
        };
        this.images._ini(imagesConfig);

        const imagesMobileConfig = {
            path: this.globals.BASE_API_URL + ((item.images && !item.images.includes('uploads/sliders/')) ? 'uploads/sliders/' : ''),
            data: item.images_mobile ? item.images_mobile : ''
        };
        this.imagesMobile._ini(imagesMobileConfig);
    }

    onSubmit() {
        if (this.fm.valid && this.flag) {
            this.flag = false;

            const data = this.fm.value;
            data.code = this.code;
            data.images = this.images._get(true);
            data.images_mobile = this.imagesMobile._get(true);
            data.images.path = 'uploads/sliders/';
            data.images_mobile.path = 'uploads/sliders/';
            data.status = data.status == true ? 1 : 0;

            this.globals.send({
                path: this.conf.process.path,
                token: this.conf.process.token,
                data: data, params: { id: this.id || 0 } 
            });
        }
    }
}
