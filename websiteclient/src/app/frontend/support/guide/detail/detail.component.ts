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

    public linkCheck: '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        public globals: Globals
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (this.router.url != '') {
                let link = this.router.url.split('/');
                this.checkLink(params.link, link.length);
            }
        });
    }

    public list = {
        active: '',
        detail: '',
        _change: (item) => {
            this.list.active = item.link;
            this.list.detail = item.detail;
            setTimeout(() => {
                this.globals._html.renderHtml();
            }, 200);
        }
    }

    getDetail(link) {
        this.pageService.getDetailPageByLink({ link: link, type: 2 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.data = resp.data;
                this.data.detail = this.globals._html._detail(this.data.detail);
                this.data.builder = this.globals._html._builder(this.data.builder);
                if (this.data.list.length > 0) {
                    this.list._change(this.data.list[0]);
                }
            }
        });
    }

    checkLink(link, level) {
        this.pageService.checkPageLink({ link: link, level: level }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.linkCheck = resp.data;
                if (this.linkCheck.length > 0) {
                    this.router.navigate([this.router.url.replace(link, this.linkCheck)]);
                    this.getDetail(this.linkCheck.split('/')[this.linkCheck.split('/').length - 1]);
                }
            }
        });
    }
}
