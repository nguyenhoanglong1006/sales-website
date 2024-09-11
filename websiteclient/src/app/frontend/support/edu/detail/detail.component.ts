import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';

@Component({
    selector: 'app-detail-edu',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
})
export class DetailEduComponent implements OnInit {

    public data = <any>{};

    public contentRelated = <any>[];

    public parent_links: any;

    public link = '';

    public linkCheck: '';

    public type: number = 0;

    constructor(
        public globals: Globals,

        public route: ActivatedRoute,

        public router: Router,

        public pageService: PageService,
    ) {
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.link = params.link;
            this.parent_links = params.parent_links;
            setTimeout(() => {
                this.getEduDetail(this.link);
            }, 50);
            this.checkLink(params.link, this.router.url.split('/').length)
        });
    }

    getEduDetail(link): void {
        this.type = ((this.globals.language._language == 'vn' && this.router.url.split('/')[3] != 'chuong-trinh-chia-se') || (this.globals.language._language == 'en' && this.router.url.split('/')[4] != 'webinar-series')) ? 2 : 12;
        this.pageService.getDetailPageByLink({ link: link || '', type: this.type }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.data = resp.data;
                this.data.detail = this.globals._html._detail(this.data.detail);
                this.data.builder = this.globals._html._builder(this.data.builder);
                this.contentRelated = resp.data.list;
                if (resp.data.keywords && resp.data.keywords.length > 0) {
                    this.data.keywords = JSON.parse(resp.data.keywords);
                }
                setTimeout(() => {
                    this.globals._html.renderHtml();
                }, 1000);
            } else {
                this.router.navigate([this.globals.language._language == 'vn' ? '/404' : '/en/404']);
            }
        });
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