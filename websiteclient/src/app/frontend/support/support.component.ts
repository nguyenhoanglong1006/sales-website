import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

    constructor(
        public router: Router,
        public pageService: PageService,
        public globals: Globals
    ) {

    }

    ngOnInit() {
        if (this.router.url != '') {
            let link = this.router.url.split('/');
            this.support.get(link[this.globals.language.numberLink]);
        }
    }

    public support = {
        data: <any>{},
        get: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.support.data = resp.data;
                }
            });
        },
    }
}
