import { Component, OnInit, OnDestroy,Renderer2  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../globals';
import { tryCatch } from 'rxjs/internal-compatibility';

@Component({
    selector: 'app-sitemap',
    templateUrl: './sitemap.component.html',
    styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit, OnDestroy {
    displayViButton = false;
    displayEnButton = false
    private languageKey = 'localStorageLanguage';
    private connect;
    private conf = {
        createPage: {
            path: "settings/sitemap/createsitemappage",
            token: 'createPage'
        },
        createPost: {
            path: "settings/sitemap/createsitemappost",
            token: 'createPost'
        },
        changeSitemap: {
            path: "settings/sitemap/changesitemap",
            token: 'changeSitemap'
        },
        process: {
            path: "settings/other/process",
            token: 'processOther'
        },
        getListOther: {
            path: "settings/other/getlist",
            token: 'getListOther'
        },
    }
    constructor(
        private globals: Globals,
        private renderer: Renderer2,
        public toastr: ToastrService,
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";
            switch (resp.token) {
                case this.conf.createPage.token:
                case this.conf.createPost.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.sitemap.loading = 0;
                        this.sitemap.length = resp.data.length;
                        this.sitemap.href = this.globals.BASE_API_URL + (resp.data.type == 'page' ? 'uploads/sitemap/page/' : 'uploads/sitemap/post/');
                    }
                    break;

                case this.conf.changeSitemap.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.sitemap.loading = 0;
                        this.sitemap.href = this.globals.BASE_API_URL + 'uploads/sitemap.xml';
                    }
                    break;

                case this.conf.getListOther.token:
                    if (resp.status == 1) {
                        this.domain.name = resp.data[0].value;
                        this.domain.domain_id = resp.data[0].id;
                    }
                    break;

                case this.conf.process.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.domain.skip = false
                    }
                    break;

                default:
                    break;
            }
        });

    }

    ngOnInit(): void {
        this.globals.send({ path: this.conf.getListOther.path, token: this.conf.getListOther.token, params: { group: 3 } });

        const localLanguage = localStorage.getItem('localStoragelanguage');
        
        if (localLanguage) {
            try {
                const languageObj = JSON.parse(localLanguage);

                if (languageObj.length > 0) { 
                    languageObj.map((lang: any) => {
                        console.log(lang)
                        if (lang?.code === 'vn') this.displayViButton = true;
                        if (lang?.code === 'en' ) this.displayEnButton = true;
                    })
                }
                
            } catch (error) {
                // console.log(error);
            }
        }
        
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : ''
    }

    sitemap = {
        loading: -1,
        percent: 0,
        length: 0,
        href: '',
        type: '',

        create: (type) => {
            this.sitemap.clear();
            this.sitemap.loading = 1;
            this.sitemap.progress();
            this.sitemap.type = type;
            if (type == 'page') {
                this.globals.send({ path: this.conf.createPage.path, token: this.conf.createPage.token });
            } else if (type == 'post') {
                this.globals.send({ path: this.conf.createPost.path, token: this.conf.createPost.token });
            } else {
                this.globals.send({ path: this.conf.changeSitemap.path, token: this.conf.changeSitemap.token });
            }

        },
        progress: () => {
            let time = setInterval(() => {
                this.sitemap.percent = this.sitemap.percent + 5;
                if (this.sitemap.percent == 90) {
                    clearInterval(time);
                }
            }, 200);

        },
        



        clear: () => {
            this.sitemap.percent = 0;
            this.sitemap.length = 0
        },
        
    }


    domain = {
        name: '',
        domain_id: 0,
        skip: false,
        flags: true,

        submit: () => {
            this.domain.checkDomain()
            if (this.domain.flags) {
                let data = { value: this.domain.name };
                this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.domain.domain_id } });
            }
        },

        checkDomain: () => {
            let format = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/;
            this.domain.flags = format.test(this.domain.name) ? true : false;
        }
    }
}
