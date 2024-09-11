import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';
import { AppService } from '~/services/app.service';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit, OnDestroy {

    navigationSubs;

    public menu: any = [];

    public link;

    public linkMain: string = '';

    public isBrowser: boolean;
    constructor(
        public globals: Globals,
        private router: Router,
        private pageService: PageService,
        private appService: AppService,
    ) {
        this.navigationSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url != '' && (this.globals.language._language == 'vn' && this.router.url.split('/').length != 3) || (this.globals.language._language == 'en' && this.router.url.split('/').length != 4)) {
                    this.appService.updateTags(this.router.url);
                }
            }
        })
    }

    ngOnInit() {
        if (this.router.url != '') {
            this.link = this.router.url.split('/')[this.globals.language.lengthLink];
            this.linkMain = this.router.url.split('/')[this.globals.language.numberLink] + '/' + this.router.url.split('/')[this.globals.language.lengthLink]
            this.getList(this.router.url.split('/')[this.globals.language.lengthLink], this.router.url.split('/')[this.globals.language.numberLink]);
            this.appService.updateTags(this.router.url);
        }
    }

    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    getList(link, parent_link) {
        this.pageService.getPagesLink({ link: link, parent_link: '/' + parent_link }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.menu = resp.data.data;
                if (this.router.url != '') {
                    let link = this.router.url.split('/');
                    if (link.length == (this.globals.language._language == 'vn' ? 3 : 4)) {
                        let data = resp.data.data[0];
                        if (data.data.length == 0) {
                            this.router.navigate([this.globals.language._language == 'vn' ? data.href : ('en/' + data.href)]);
                        } else {
                            this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
                        }
                    }
                }
            }
        });
    }





}
