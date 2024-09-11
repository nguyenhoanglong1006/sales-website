import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { isPlatformBrowser } from '@angular/common';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';

@Component({
    selector: 'app-edu-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListEduComponent implements OnInit {

    @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

    public width: number;

    public link;

    public isBrowser: boolean;

    public linkCheck: '';

    constructor(
        public globals: Globals,
        public route: ActivatedRoute,
        public router: Router,
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
            this.link = params.link || '';
            this.getListPageByLink();
        })

    }

    getListPageByLink(): void {
        this.filter._reset();
        this.pageService.getListPageByLink({
            link: this.link || '',
            limit: 8,
            start: this.filter.date.start,
            end: this.filter.date.end,
        }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.edu._ini(resp.data);
                setTimeout(() => {
                    this.globals._html.renderHtml();
                }, 200);
            }
        });
    }

    public edu = {

        lengthList: 0,

        loading: -1,

        data: <any>[],

        _ini: (data) => {
            this.edu._reset();
            this.edu.data = data;
            this.edu.data.builder = this.globals._html._builder(this.edu.data.builder);
            this.edu.loading = data.list.length > 0 ? 1 : 0;
            if (data.list && data.list.length > 0 && data.code == 'sharingProgram') {
                this.filter.data = data.list;
                this.edu.lengthList = data.count.count_list;
            } else {
                this.checkLink(data.link, this.router.url.split('/').length)
            }
        },

        _reset: () => {
            this.filter.data = [];
            this.edu.lengthList = 0;
            this.filter.finish = false;
        },

        _viewMore: (length) => {
            this.pageService.getListPageByLink({
                link: this.link || '',
                limit: 8,
                length: length,
                start: this.filter.date.start,
                end: this.filter.date.end,
            }).subscribe((resp: any) => {
                this.filter.data = this.filter.data.concat(resp.data.list);
                this.filter.finish = this.edu.lengthList != this.filter.data.length ? false : true;
            });
        }
    }

    public filter = {
        finish: false,
        data: [],
        date: {
            start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            end: new Date()
        },
        _search: () => {
            this.pageService.search({
                start: this.filter.date.start,
                end: this.filter.date.end,
                link: this.link,
                limit: 8
            }).subscribe((resp: any) => {
                this.filter.data = resp.data.list;
                if (resp.data.list.length) {
                    this.edu.lengthList = resp.data.count.count_list;
                    this.filter.finish = this.edu.lengthList != this.filter.data.length ? false : true;
                }
            });
        },
        _reset: () => {
            this.filter.date.start = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            this.filter.date.end = new Date();
        }
    }

    checkLink(link, level) {
        this.pageService.checkPageLink({ link: link, level: level }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.linkCheck = resp.data;
                if (this.linkCheck.length > 0) {
                    this.router.navigate([this.router.url.replace(link, this.linkCheck)]);
                }
            }
        });
    }
}
