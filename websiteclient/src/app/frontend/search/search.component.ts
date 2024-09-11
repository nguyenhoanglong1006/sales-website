import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Globals } from '~/globals';
import { ToslugService } from '~/services/integrated/toslug.service';
import { SearchService } from '~/services/search/search.service';
import { PageService } from '~/services/page/page.service'

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    providers: [ToslugService]
})
export class SearchComponent implements OnInit {
    public contentNew = [];

    public width: number;

    public isBrowser: boolean;

    typeNews = 4;

    constructor(
        private toSlug: ToslugService,
        public route: ActivatedRoute,
        public globals: Globals,
        public router: Router,
        public searchService: SearchService,
        public pageService: PageService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
        this.route.params.subscribe(params => {
            this.search.nameSearch = params.keywords || '';
            this.search._getData(params)
        });

        if (this.router.url != '') {
            let link = this.router.url.split('/');
            this.search.get(link[this.globals.language.numberLink]);
        }
        this.getContentNew();
    }

    public search = {
        page: <any>{},
        nameSearch: '',
        show: -1,
        lengthList: 0,
        finish: false,
        data: [],

        get: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.search.page = resp.data;
                }
            });
        },

        _getData: (params) => {
            let keywords = this.toSlug._ini(params.keywords);
            this.searchService.search({ keywords: keywords }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.search.data = resp.data;
                    this.search.show = resp.data.length > 0 ? 1 : 0;
                    if (resp.data.length > 0) {
                        this.search.lengthList = resp.data.count;
                    }
                }
            });
        },

        _viewMore: (length) => {
            this.searchService.search({ keywords: this.search.nameSearch, start: length }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.search.data = this.search.data.concat(resp.data.list);
                    this.search.finish = this.search.lengthList != this.search.data.length ? false : true;
                }
            });
        }
    }

    getContentNew(): void {
        this.searchService.getContentNew().subscribe((resp: any) => {
            if (resp.status == 1) {
                this.contentNew = resp.data;
            }
        });
    }
}
