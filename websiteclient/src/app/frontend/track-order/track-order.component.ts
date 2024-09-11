import { CustomerService } from '~/services/customer/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { ToslugService } from '~/services/integrated/toslug.service';
import { SearchService } from '~/services/search/search.service';
import { PageService } from '~/services/page/page.service';
import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';

@Component({
    selector: 'app-track-order',
    templateUrl: './track-order.component.html',
    styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit, OnDestroy {

    private connect;

    public tableService = new TableService()

    constructor(
        public globals: Globals,
        public toastr: ToastrService,
        public route: ActivatedRoute,
        public router: Router,
        public modalService: BsModalService,
        public toSlug: ToslugService,
        public searchService: SearchService,
        public pageService: PageService,
    ) { }

    ngOnInit() {
        this.page.get('tra-cuu-don-hang')
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    public search = {

        data: <any>{},

        token: '',

        value: '',

        skip: true,

        onSearch: () => {
            if (this.search.value != '' && this.search.skip == true) {
                this.search.skip = false
                this.search._getData(this.search.value)
            }
        },

        _getData: (params) => {
            this.searchService.searchOrder({ keywords: params }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.search.data = resp.data
                    this.search.skip = true
                }
            });
        },
    };

    public page = {
        data: <any>{},
        get: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.page.data = resp.data;
                    if (this.router.url != '') {
                        let link = this.router.url.split('/');
                        if (link.length == this.globals.language.lengthLink) {
                            let data = resp.data.data[0] || {};
                            if (data.data && data.data.length > 0) {
                                this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
                            } else { }
                        }
                    }
                }
            });
        },
    }
}
