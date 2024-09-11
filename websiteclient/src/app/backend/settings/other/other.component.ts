import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../globals';
import { uploadFileService } from '../../../services/integrated/upload.service';

@Component({
    selector: 'app-other',
    templateUrl: './other.component.html',
    providers: [uploadFileService]
})
export class OtherComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getListOther: {
            path: "settings/other/getlist",
            token: 'getListOther'
        },
        process: {
            path: "settings/other/process",
            token: 'processOther'
        }
    }
    public item: any = { title: '', key: '', value: '', type: 'text', skip: false };
    public data: any = [];
    public flags: boolean = true;
    public page = { group: 0, name: '' }

    public mutiLang: any = [];
    public lang_id: any;

    constructor(
        private globals: Globals,
        public toastr: ToastrService,
        public router: Router,
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getListOther.token:
                    this.data = [];
                    for (var key in resp.data) {
                        let item: any = resp.data[key];
                        item.skip == false;
                        if (item.type == 2) {                            
                            item.images = new uploadFileService();
                            let configImages = { path: this.globals.BASE_API_URL + 'public/settings/', data: item.value || '' };
                            item.images._ini(configImages);
                        }                        
                        this.data.push(item);
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true;
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.getListOther(this.page.group)
                    }
                    break;
                default:
                    break;
            }
        });

    }

    ngOnInit() {

        switch (this.router.url.split('/')[3]) {
            case 'info-company':
                this.page.group = 2
                this.page.name = 'settings.infoCompany';
                break;
            case 'social-network':
                this.page.group = 1;
                this.page.name = 'settings.socialNetwork'
                break;
            case 'orther':
                this.page.group = 0;
                this.page.name = 'settings.other'
                break;
            default:
                break;
        }
        this.getListOther(this.page.group)
    }
    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : ''
    }

    getListOther = (group) => {
        this.globals.send({ path: this.conf.getListOther.path, token: this.conf.getListOther.token, params: { group: group || 0, lang_id: this.lang_id } });
    }

    public language = {
        _change: (id) => {
            if (id != this.lang_id) {
                this.lang_id = id;
                this.getListOther(this.page.group)
            }
        },
    }

    onSubmit(item: any = {}) {

        if (this.flags && item.skip == true) {
            this.flags = false;
            let data: any = {};
            data = { text_key: item.text_key, value: item.value, title: item.title, type: item.type };
            if (data.type == 2) {
                data.value = item.images._get(true);
            }
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: item.id || 0 } });
        }
    }
}
