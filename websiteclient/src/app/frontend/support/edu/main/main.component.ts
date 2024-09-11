import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { PageService } from '~/services/page/page.service';
import { AppService } from '~/services/app.service';
import { Globals } from '~/globals';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

    navigationSubs;

    public linkMain: string = '';

    constructor(
        public router: Router,
        public pageService: PageService,
        private appService: AppService,
        public globals: Globals
    ) {

        this.navigationSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let link = window.location.pathname.split('/');
                this.getLink(link)
            }
        })
    }

    getLink(link) {
        // check case: if link is detail and click menu back main link
        if (link.length == this.globals.language.lengthLink && this.linkMain == link[this.globals.language.numberLink] && this.edu.data && this.edu.data.data) {
            if (this.router.url != '') {
                let link = this.router.url.split('/');
                if (link.length == this.globals.language.lengthLink) {
                    let data = this.edu.data.data[0];
                    if (data.data.length == 0) {
                        this.router.navigate([this.globals.language._language == 'vn' ? data.href : ('en/' + data.href)]);
                    } else {
                        this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
                    }
                }
            }
        }
        if (this.router.url != '' && (this.globals.language._language == 'vn' && this.router.url.split('/').length != 3) || (this.globals.language._language == 'en' && this.router.url.split('/').length != 4)) {
            this.appService.updateTags(this.router.url);
        }
    }

    ngOnInit(): void {
        if (this.router.url != '') {
            let link = this.router.url.split('/');
            this.getLink(link);
            this.linkMain = this.router.url.split('/')[this.globals.language.numberLink] + '/' + this.router.url.split('/')[this.globals.language.lengthLink]
            this.edu.get(this.router.url.split('/')[this.globals.language.lengthLink], this.router.url.split('/')[this.globals.language.numberLink]);
        }
    }

    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    public edu = {
        nameGroup: '',
        data: <any>{},
        get: (link, parent_link) => {
            this.pageService.getPagesLink({ link: link, parent_link: '/' + parent_link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.edu.data = resp.data.data;
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
        },
    }
}
