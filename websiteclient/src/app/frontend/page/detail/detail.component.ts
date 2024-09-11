import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';
import { RecruitmentService } from '~/services/recruitment/recruitment.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    public data = <any>{};

    public itemDetail: any = {};

    public linkDetail: string = '';

    public parentLink: string = '';

    public parentLinks: string = '';

    public link: string = '';

    public linkMainCareer: string = '';

    public linkCheck: '';

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private pageService: PageService,
        public globals: Globals,
        private recruitmentService: RecruitmentService
    ) {

    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.parentLinks = params.parent_links || '';
            this.parentLink = params.parent_link || '';
            this.linkDetail = params.link || '';
            this.link = window.location.pathname.replace('/' + window.location.pathname.split('/')[4], '');
            let pathname = window.location.pathname;
            this.linkMainCareer = pathname.substring(0, pathname.length - this.parentLink.length - this.linkDetail.length - 2);
            if ((this.parentLink == 'co-hoi-nghe-nghiep' || this.parentLink == 'career-opportunities' || this.parentLinks != '') && this.linkDetail != '') {
                if (this.parentLinks != '') {
                    this.getDetailPageByLink(params.link, params.parent_link);
                } else {
                    this.getListPageByLink(params.parent_link);
                }

            } else {
                this.getListPageByLink(params.link);
            }

            if (params.link != 'chang-duong-phat-trien' && params.link != 'milestones') {
                this.checkLink(params.link, this.router.url.split('/').length)
            }

        })
    }

    getListPageByLink(link): void {
        this.pageService.getListPageByLink({ link: link || '', limit: 12 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.itemDetail = resp.data;
                this.itemDetail.detail = this.globals._html._detail(this.itemDetail.detail);
                this.itemDetail.builder = this.globals._html._builder(this.itemDetail.builder);
                if (window['viewImages']) {
                    setTimeout(() => {
                        window['viewImages']();
                    }, 500);
                }
                setTimeout(() => {
                    this.globals._html.renderHtml();
                }, 200);
            } else {
                this.router.navigate([this.globals.language._language == 'vn' ? '/404' : '/en/404']);
            }
        });
    }

    getDetailPageByLink(link, parent_link): void {
        this.recruitmentService.getDetail({ link: link || '', parent_link: parent_link }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.data = resp.data;
                this.data.item.detail = this.globals._html._detail(this.data.item.detail);
                this.data.item.builder = this.globals._html._builder(this.data.item.builder);
                setTimeout(() => {
                    this.globals._html.renderHtml();
                }, 200);
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
