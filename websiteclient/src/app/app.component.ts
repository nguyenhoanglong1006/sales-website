import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { Globals } from './globals';
import { AppService } from './services/app.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


    public isBrowser: boolean;

    constructor(
        public translate: TranslateService,

        private globals: Globals,

        private title: Title,

        private meta: Meta,

        public appService: AppService,

        public router: Router,

        @Inject(PLATFORM_ID) private platformId: Object,
    ) {

        translate.setDefaultLang('vn');

        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.getCompany();
            let is_admin = (window.location.pathname.split('/')[1] == 'admin' || window.location.pathname.split('/')[1] == 'login') ? true : false;
            this.getlanguage();
        }
    }

    getCompany(): void {

        this.appService.getMenu().subscribe((resp: any) => {

            if (resp.status == 1) {

                let data = resp.data;

                this.globals.company = data;

                if (data.shortcut) {

                    data.shortcut = data.shortcut;
                }

                this.title.setTitle(data.name);

                this.meta.addTag({ name: 'description', content: data.description });

                let shortcut = document.querySelector("[type='image/x-icon']");

                if (shortcut && data.shortcut) {

                    shortcut.setAttribute('href', data.shortcut);
                }
            }
        })
    }

    getlanguage(): void {



        this.appService.getListLang().subscribe((resp: any) => {
            if (resp.status == 1) {
                let data = resp.data;
                if (data && data.length > 0) {
                    let languageCode = [];
                    data.reduce((n, o, i) => { if (o.status > 0) { languageCode.push(o.code) }; return n }, []);
                    this.translate.addLangs(languageCode);
                    this.globals.language.setData(data);
                } else {
                    this.getlanguage();
                }
            }
        })
    }




}
