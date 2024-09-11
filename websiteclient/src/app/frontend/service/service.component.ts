import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { PageService } from '~/services/page/page.service';
import { AppService } from '~/services/app.service';
import { Globals } from '~/globals';

@Component({
    selector: 'app-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit, OnDestroy {

    navigationSubs;

    public parentLink: string = '';

    public link: string = '';

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

                if (link.length > this.globals.language.numberLink) {
                    this.parentLink = link[this.globals.language.lengthLink];
                    this.link = link[(this.globals.language._language == 'vn' ? 3 : 4)] || '';
                }

                // check case: if link is detail and click menu back main link
                if (link.length == this.globals.language.lengthLink && this.linkMain == link[this.globals.language.numberLink] && this.service.data && this.service.data.data) {
                    if (this.router.url != '') {
                        let link = this.router.url.split('/');
                        if (link.length == this.globals.language.lengthLink) {
                            let data = this.service.data.data[0];
                            if (data.data.length == 0) {
                                this.router.navigate([this.globals.language._language == 'vn' ? data.href : ('en/' + data.href)]);
                            } else {
                                this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
                            }
                        }
                    }
                }
                if (this.router.url != '' && (this.globals.language._language == 'vn' && this.router.url.split('/').length != 2) || (this.globals.language._language == 'en' && this.router.url.split('/').length != 3)) {
                    this.appService.updateTags(this.router.url);
                }
            }
        })
    }

    ngOnInit(): void {
        if (this.router.url != '') {
            let link = this.router.url.split('/');
            this.linkMain = link[this.globals.language.numberLink];
            this.service.get(link[this.globals.language.numberLink]);
        }
    }
    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }
    public service = {
        nameGroup: '',
        data: <any>{},
        get: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.service.data = resp.data;
                    if (this.router.url != '') {
                        let link = this.router.url.split('/');
                        if (link.length == this.globals.language.lengthLink) {
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
