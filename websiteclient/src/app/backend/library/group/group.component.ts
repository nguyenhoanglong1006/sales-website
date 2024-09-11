import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Globals } from "../../../globals";
import { TableService } from "../../../services/integrated/table.service";

@Component({
    selector: "app-group",
    templateUrl: "./group.component.html"
})
export class GroupComponent implements OnInit, OnDestroy {

    @Output("filter") filter = new EventEmitter();

    private connect;

    private conf = {
        getlist: {
            path: 'pages/index/getlistgroup',
            token: 'getListGroup',
            params: { type: 5 }
        }
    }

    private cols = [
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblCount', field: 'count', show: true, filter: true }
    ];

    public tableService = new TableService();

    constructor(
        public globals: Globals
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {

                case this.conf.getlist.token:
                    if (resp.status == 1) {
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token, params: this.conf.getlist.params });
        this.tableService._ini({ cols: this.cols, data: [], keyword: "librarygroup" });
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    onCheckItem(item) {
        item.check = item.check == true ? false : true;
        this.filter.emit(item.id);
    }
}
