import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Globals } from '~/globals';
import { AppService } from '~/services/app.service';
import { FrontendService } from '~/services/frontend/frontend.service';

@Component({
    selector: 'app-frontend',
    templateUrl: './frontend.component.html',
    styleUrls: ['./frontend.component.scss'],
})
export class FrontendComponent implements OnInit, OnDestroy {
    navigationSubs;

    public lange = {};
    public item: boolean = false;
    public loading: boolean = false;
    public width: number;
    public isBrowser: boolean;

    constructor(
        public translate: TranslateService,
        public router: Router,
        public globals: Globals,
        public appService: AppService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public frontendService: FrontendService,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.navigationSubs = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (this.isBrowser) {
                    this.globals.language.process();
                    this.translate.use(this.globals.language._language);
                    setTimeout(() => {
                        this.getLanguageSetting();
                    }, 100);
                }
                this.appService.updateTags(this.router.url);
            }
            this.appService.setScript();
        });
    }

    ngOnInit() {
        this.appService.setScript();
        if (this.isBrowser) {
            this.width = window.innerWidth;
            window.scroll(0, 0);
        }
    }
    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    getLanguageSetting(): void {
        this.frontendService.getLanguageSetting().subscribe((resp: any) => {
            if (resp.data && resp.data.length > 0) {
                let lang = {};
                this.lange = resp.data.reduce((n, o, i) => {
                    if (!n[o.text_key]) {
                        n[o.text_key] = o;
                    }
                    return n;
                }, []);
                for (let key in this.lange) {
                    lang[key] = !lang[key] ? this.lange[key]['value'] : '';
                    if (lang[key] != '' && key && key != '') {
                        this.translate.set(key, lang[key]);
                    }
                }
            }
        });
    }

    ngAfterViewInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (this.isBrowser) {
                    window.scroll(0, 0);
                }
            }
        });
    }

    eventLoading = (e) => {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 250);
    };

    @HostListener('window:scroll', ['$event']) checkScroll(e) {
        if (isPlatformBrowser(this.platformId)) {
            const scrollElm = document.getElementById('scroll-top');
            if (!scrollElm) return;

            if (e.target['scrollingElement'].scrollTop > 150) {
                document.getElementById('scroll-top').style.display = 'block';
            } else {
                document.getElementById('scroll-top').style.display = 'none';
            }
        }
    }

    scrollTop() {
        const element = document.getElementById('header');
        window.scroll({
            top: element.offsetTop,
            behavior: 'smooth'
        });
    }
}
