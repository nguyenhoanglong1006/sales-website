import { Component, OnInit, OnDestroy } from '@angular/core';
import { Globals } from '../../../../globals';
import { TableService } from '../../../../services/integrated/table.service';

@Component({
    selector: 'app-get-list',
    templateUrl: './get-list.component.html',
})
export class MenuGetListComponent implements OnInit, OnDestroy {

    private connect;

    private conf = {
        getlist: {
            path: "settings/menu/getlist",
            token: 'getListMenu'
        }
    }

    private cols = [
        { title: 'lblStt', field: 'index', show: true },
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblOrders', field: 'orders', show: false, filter: true },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '#', field: 'status', show: true, filter: true },
    ];

    public tableService = new TableService();

    constructor(
        public globals: Globals,
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getlist.token:
                    this.tableService._ini({ data: [] });
                    this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                    this.tableService._concat(resp.data, true);
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'getListMenu' });
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }
}
