import { Component, OnInit, ViewChild, Inject, PLATFORM_ID, OnDestroy, } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { isPlatformBrowser } from '@angular/common';
import { Location } from "@angular/common";

import { PageService } from '~/services/page/page.service';
import { AppService } from '~/services/app.service';
import { Globals } from '~/globals';
import { defineLocaleDatepicker } from '~/frontend/typings';

@Component({
    selector: 'app-content-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListContentComponent implements OnInit, OnDestroy {
    @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

    navigationSubs;

    public width: number;

    public isBrowser: boolean;

    public parentLink: string = '';

    public link: string = '';

    public linkMain: string = '';

    public flag: boolean = false;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public pageService: PageService,
        private appService: AppService,
        public globals: Globals,
        private loction: Location,
        @Inject(PLATFORM_ID) private platformId: Object,
        private localeService: BsLocaleService,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        this.navigationSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let link = this.loction.path().split('/');
                this.getLink(link)
                if (this.isBrowser) {
                }
            }
        });


    }

    getLink(link) {
        // check case: if link is detail and click menu back main link
        if (link.length == this.globals.language.lengthLink && this.linkMain == link[this.globals.language.numberLink] && this.page.data && this.page.data.data) {
            if (this.router.url != '') {
                let link = this.router.url.split('/');
                if (link.length == this.globals.language.lengthLink) {
                    let data = this.page.data.data[0];
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
        this.page.get(link[this.globals.language.numberLink]);

    }

    ngOnInit() {
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
        if (this.router.url != '') {
            let link = this.router.url.split('/');
            this.getLink(link)
            this.linkMain = link[this.globals.language.numberLink];            
        }

        if ((this.globals.language._language == 'vn' && this.router.url.split('/').length != 2) || (this.globals.language._language == 'en' && this.router.url.split('/').length != 3)) {
            this.route.params.subscribe(params => {
                this.link = params.link || '';
                if (this.link != '') {
                    this.getListPageByLink()
                }
            })
        }
    }
    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    public page = {
        data: <any>{},
        get: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.page.data = resp.data;
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

    getListPageByLink(): void {
        this.filter._reset()
        this.pageService.getListPageByLink({
            link: this.link || '',
            limit: 12,
            start: this.filter.date.start,
            end: this.filter.date.end,
        }).subscribe((resp: any) => {
            this.content._clear();
            this.flag = false;
            if (resp.status == 1) {
                this.content._ini(resp.data);
            } else {
                this.flag = true;
                this.getContentDetail(this.link);
            }
                
        });
    }

    public content = {

        lengthList: 0,
        loading: -1,
        data: <any>{},

        _ini: (data) => {
            this.content._reset();
            this.content.data = data;
            this.content.data.builder = this.globals._html._builder(this.content.data.builder);
            this.content.loading = data.length > 0 ? 1 : 0;
            if (data.list && data.list.length > 0) {
                this.filter.data = data.list;
                this.content.lengthList = data.count.count_list;
            }
        },

        _reset: () => {
            this.filter.data = [];
            this.content.lengthList = 0;
            this.filter.finish = false;
        },

        _clear: () => {
            this.content.data = {}
        },

        _viewMore: (length) => {
            this.pageService.getListPageByLink({
                link: this.link || '',
                limit: 12,
                length: length,
                start: this.filter.date.start,
                end: this.filter.date.end,
            }).subscribe((resp: any) => {
                this.filter.data = this.filter.data.concat(resp.data.list);
                this.filter.finish = this.content.lengthList != this.filter.data.length ? false : true;
            });
        }
    }

    public filter = {
        finish: false,
        value: '',
        data: [],
        date: {
            start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            end: new Date()
        },

        _search: () => {
            this.pageService.search({
                value: this.filter.value,
                start: this.filter.date.start,
                end: this.filter.date.end,
                link: this.link,
                limit: 12
            }).subscribe((resp: any) => {
                this.filter.data = resp.data.list;
                this.content.lengthList = resp.data.count.count_list;
                this.filter.finish = this.content.lengthList != this.filter.data.length ? false : true;

            });
        },
        _reset: () => {
            this.filter.date.start = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            this.filter.date.end = new Date()
        }
    }

    public detail = {
        data: <any>{},
        contentNew: <any>[],
    }


    getContentDetail(link): void {
        this.pageService.getDetailPageByLink({ link: link || '', type: 4 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.detail.data = resp.data;
                this.detail.data.detail = this.globals._html._detail(this.detail.data.detail);
                this.detail.data.builder = this.globals._html._builder(this.detail.data.builder);
                this.detail.contentNew = resp.data.list;
                setTimeout(() => {
                    this.globals._html.renderHtml();
                }, 200);
            } else {
                this.router.navigate([this.globals.language._language == 'vn' ? '/404' : (this.globals.language._language + '/404')]);
            }

        });
    }
}
