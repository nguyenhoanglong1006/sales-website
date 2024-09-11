import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SupportService } from '~/services/support/support.service';
import { AppService } from '~/services/app.service';
import { Globals } from '~/globals';

@Component({
    selector: 'app-detail-faq',
    templateUrl: './detail-faq.component.html',
    styleUrls: ['./detail-faq.component.css']
})
export class DetailFaqComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private supportService: SupportService,
        private appService: AppService,
        public globals: Globals
    ) { }

    ngOnInit(): void {

        if (this.router.url != '') {
            this.appService.updateTags(this.router.url);
        }

        this.route.params.subscribe(params => {
            let link = params.link;
            this.detailFaq.get(link);
        })
    }

    public detailFaq = {
        item: <any>{},
        get: (link) => {
            this.supportService.getDetailFaq({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.detailFaq.item = resp.data;
                    this.detailFaq.item.detail = this.globals._html._detail(this.detailFaq.item.detail);
                    this.detailFaq.item.builder = this.globals._html._builder(this.detailFaq.item.builder);
                    setTimeout(() => {
                        this.globals._html.renderHtml();
                    }, 200);
                }
            });
        }
    }

}
