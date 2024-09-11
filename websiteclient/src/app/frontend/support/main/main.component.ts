import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { Globals } from '~/globals';
import { AppService } from '~/services/app.service';
import { TableService } from '~/services/integrated/table.service';
import { ToslugService } from '~/services/integrated/toslug.service';
import { PageService } from '~/services/page/page.service';
import { SupportService } from '~/services/support/support.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    providers: [ToslugService, TableService],
})
export class MainComponent implements OnInit, OnDestroy {
    navigationSubs;

    public width: number;

    public link: any;
    public isBrowser: boolean;
    public tableFaq = new TableService();

    constructor(
        private router: Router,
        private toSlug: ToslugService,
        private supportService: SupportService,
        public pageService: PageService,
        private appService: AppService,
        public globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.navigationSubs = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (this.router.url != '') {
                    this.appService.updateTags(this.router.url);
                }
            }
        });
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        this.support.getFaq();
        if (this.router.url != '') {
            this.link = this.router.url.split('/');
            this.support.getPage(this.link[this.globals.language._language == 'vn' ? 1 : 2]);
            this.appService.updateTags(this.router.url);
        }
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
    }

    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    public support = {
        faq: [],
        data: <any>{},
        getFaq: () => {
            this.supportService.getFaq().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.tableFaq._ini({ data: [], count: this.Pagination.itemsPerPage });
                    this.tableFaq.sorting = { field: 'orders', sort: 'ASC', type: 'number' };
                    this.tableFaq._concat(resp.data, true);
                }
            });
        },
        getPage: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.support.data = resp.data;
                }
            });
        },
    };
    public search = {
        hide: true,
        value: '',

        _getValue: () => {
            this.search.hide = this.search.value != '' ? false : true;
            this.search.value = this.toSlug._ini(this.search.value);
            this.supportService
                .searchFaq({ keywords: this.search.value })
                .subscribe((resp: any) => {
                    if (resp.status == 1) {
                        this.tableFaq.data = [];
                        this.tableFaq._concat(resp.data, true);
                    } else {
                        this.tableFaq._concat([], true);
                    }
                });
        },
        _hide: () => {
            this.search.hide = true;
        },
    };

    public Pagination = {
        maxSize: 5,

        itemsPerPage: 10,

        changeFaq: (event: PageChangedEvent) => {
            const startItem = (event.page - 1) * event.itemsPerPage;

            const endItem = event.page * event.itemsPerPage;

            this.tableFaq.data = this.tableFaq.dataList.slice(startItem, endItem);

            let element = document.getElementById('fag');

            window.scroll({ top: element.offsetTop, behavior: 'smooth' });
        },
    };
}
