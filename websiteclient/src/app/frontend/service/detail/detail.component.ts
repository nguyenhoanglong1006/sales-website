import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

    public data = <any>{};

    public contentNew = <any>[];

    public parent_link: any;

    public link = '';

    public linkCheck: '';

    constructor(
        public globals: Globals,

        public route: ActivatedRoute,

        public router: Router,

        public pageService: PageService,
    ) {


    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.link = params.link || '';
            this.checkLink(this.link, this.router.url.split('/').length)

        })
    }

    getContentDetail(link): void {
        this.pageService.getDetailPageByLink({ link: link || '', type: 2 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.data = resp.data;
                this.data.detail = this.globals._html._detail(this.data.detail);
                this.data.builder = this.globals._html._builder(this.data.builder);
                setTimeout(() => {
                    this.globals._html.renderHtml();
                }, 200);
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
                    this.getContentDetail(this.linkCheck.split('/')[this.linkCheck.split('/').length - 1]);
                }
            }
        });
    }

}
