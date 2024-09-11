import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';

@Component({
    selector: 'app-group-careers',
    templateUrl: './group.component.html'
})
export class GroupComponent implements OnInit, OnDestroy {
    @Output("filter") filter = new EventEmitter();

    private connect;
    private conf = {
        getListGroup: {
            path: "careers/index/workplace",
            token: 'getListWorkplace'
        }
    }

    private cols = [
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblCount', field: 'count', show: true, filter: true },
    ];

    public tableService = new TableService();

    filterId: number;

    constructor(
        public globals: Globals
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {

            switch (resp.token) {
                case this.conf.getListGroup.token:
                    if (resp.status == 1) {
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                default:
                    break;
            };

        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'careersgroup' });
        this.globals.send({ path: this.conf.getListGroup.path, token: this.conf.getListGroup.token });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : ''
    }

    onCheckItem(item) {
        this.filterId = this.filterId !== item.id ? item.id : 0;

        this.filter.emit(this.filterId);
    }
}