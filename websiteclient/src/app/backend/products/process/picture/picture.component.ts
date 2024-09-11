import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { uploadFileService } from '../../../../services/integrated/upload.service'
import { Globals } from '../../../../globals';
import { ToastrService } from 'ngx-toastr'
import { TagsService } from '../../../../services/integrated/tags.service';import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-picture',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.css'],
    providers: [TagsService]
})
export class PictureComponent implements OnInit, OnDestroy {
    fm: FormGroup;
    public id: number;
    public connect;
    public code: string = '';
    public link: string = '';
    private conf = {
        getListGroup: {
            path: "pages/index/getlistgroup",
            token: 'getListGroup'
        },
        getRow: {
            path: "products/index/getrow",
            token: 'getRowProduct'
        },
        process: {
            path: "products/index/process",
            token: 'processProduct'
        }
    }
    public images = new uploadFileService();
    public video = new uploadFileService();
    public listimages = new uploadFileService();
    public items: any = {}
    constructor(
        public fb: FormBuilder,
        public globals: Globals,
        private toastr: ToastrService,
        public routerAct: ActivatedRoute,
        public tags: TagsService,
    ) {

        this.routerAct.queryParams.subscribe(params => this.code = params.code)

        this.routerAct.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id && this.id > 0) {
                this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: +this.id } });
            } else {

            }
        })
        this.connect = this.globals.result.subscribe((res: any) => {
            switch (res.token) {
                case this.conf.getRow.token:
                    let data = res.data;
                    this.items = res.data;
                    if (data.id && +data.id == this.id) {
                        const imagesConfig = { path: this.globals.BASE_API_URL + 'public/products/', data: data.images };
                        this.images._ini(imagesConfig);
                        const videoConfig = { path: this.globals.BASE_API_URL + 'public/products/', data: data.video };
                        this.video._ini(videoConfig);
                        
                        const listimagesConfig = { path: this.globals.BASE_API_URL + 'public/products/', data: data.listimages, multiple: true };
                        this.listimages._ini(listimagesConfig);
                    }
                    this.fmConfigs(this.items)
                    break;
                case "processProduct":
                    let type = res.status == 1 ? "success" : res.status == 0 ? "warning" : "danger";
                    this.toastr[type](res["message"], type);
                    break;
                default:
                    break;
            }
        });
    }
    ngOnInit() {

    }
    fmConfigs(item: any = '') {
        item = typeof item === 'object' ? item : { status: 1, type: 1 };
        this.fm = this.fb.group({
          video_link: item.video_link ? item.video_link : '',
        });
      }
    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }
    changeUrlVideo(e) {
      e.target.value = e.target.value.replace('watch?v=', 'embed/');
      this.link = e.target.value
    }

    onSubmit() {
        let data = { images: this.images._get(true), video: this.video._get(true), listimages: this.listimages._get(true), video_link: this.link }
        this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id } });
    }
}
