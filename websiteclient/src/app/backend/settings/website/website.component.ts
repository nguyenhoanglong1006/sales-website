import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../globals';
import { uploadFileService } from '../../../services/integrated/upload.service';
import { TagsService } from '../../../services/integrated/tags.service';

@Component({
    selector: 'app-website',
    templateUrl: './website.component.html',
    providers: [uploadFileService, TagsService],
})
export class WebsiteComponent implements OnInit, OnDestroy {

    fm: FormGroup;

    public connect: any;

    private conf = {
        getrow: {
            path: 'settings/website/get',
            token: 'getRowWebsite'
        },
        process: {
            path: 'settings/website/set',
            token: 'processWebsite'
        }
    }

    public logo = new uploadFileService();

    public shortcut = new uploadFileService();

    public flags: Boolean = true;

    public id;

    public mutiLang: any = [];
    public lang_id: any;
    public idTamp: number = 0;
    public code: string = '';
    public logoOld: any = [];
    public shortcutOld: any = [];

    constructor(
        public globals: Globals,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tags: TagsService,
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getrow.token:
                    let data: any = resp.data;
                    const logoConfig = { path: this.globals.BASE_API_URL + 'public/website/', data: data.logo };
                    this.logo._ini(logoConfig);
                    const shortConfig = { path: this.globals.BASE_API_URL + 'public/website/', data: data.shortcut };
                    this.shortcut._ini(shortConfig);
                    this.fm = this.fb.group({
                        name: [data.name ? data.name : "", [Validators.required, Validators.maxLength(75)]],
                        description: [data.description ? data.description : "", [Validators.maxLength(325)]],
                    });
                    this.id = resp.data.id;
                    this.lang_id = resp.data.language_id;
                    break;

                case this.conf.process.token:
                    this.flags = true
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type);
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.globals.send({ path: this.conf.getrow.path, token: this.conf.getrow.token });
    }

    ngOnDestroy() {
        this.connect.unsubscribe()
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false
            let data: any = this.fm.value;
            data.logo = this.logo._get(true);
            data.shortcut = this.shortcut._get(true);
            data.status = 1;
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id } });
        }
    }
}
