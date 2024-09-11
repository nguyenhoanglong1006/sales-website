import { Component, OnInit, Input, OnDestroy, OnChanges } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { Globals } from "../../../globals";
import { TableService } from "../../../services/integrated/table.service";
import { AlertComponent } from "../../modules/alert/alert.component";

@Component({
    selector: "app-getlist",
    templateUrl: "./getlist.component.html"
})
export class GetlistComponent implements OnInit, OnChanges, OnDestroy {

    @Input("filter") filter: any;

    @Input("change") change: any;

    private cols = [
        { field: "id", filter: true },
        { title: "lblStt", field: "index", show: true },
        { title: "library.lblSubject", field: "name", show: true, filter: true },
        { title: "library.lblValue", field: "images", show: true, filter: true },
        { title: "lblType", field: "type", show: true, filter: true },
        { title: 'lblOrders', field: 'orders', show: true, filter: true, type: 'number' },
        { title: "lblMakerDate", field: "maker_date", show: true, filter: true },
        { title: "lblAction", field: "action", show: true },
    ];

    private id: number;

    modalRef: BsModalRef;

    private connect;

    private conf = {
        getlist: {
            path: 'library/index/getlist',
            token: 'getListLibrary'
        },
        remove: {
            path: 'library/index/remove',
            token: 'removeLibrary'
        },
        getlistgroup: {
            path: 'pages/index/getlistgroup',
            token: 'getListGroup',
            params: { type: 5 }
        }
    }

    constructor(
        private modalService: BsModalService,
        public globals: Globals,
        public tableService: TableService,
        public toastr: ToastrService
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {

            let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";

            switch (resp.token) {

                case this.conf.getlist.token:
                    if (resp.status == 1) {
                        this.tableService.sorting = { field: "maker_date", sort: "DESC", type: "", };
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.tableService._delRowData(this.id);
                        this.globals.send({ path: this.conf.getlistgroup.path, token: this.conf.getlistgroup.token, params: this.conf.getlistgroup.params });
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token });
        this.tableService._ini({ cols: this.cols, data: [], keyword: "library", count: 50 });
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    ngOnChanges() {
        if (typeof this.filter === "object") {
            let value = Object.keys(this.filter);
            if (value.length == 0) {
                this.tableService._delFilter("page_id");
            } else {
                this.tableService._setFilter("page_id", value, "in", "number");
            }
        }
    }

    onRemove(item) {
        this.id = +item.id;
        this.modalRef = this.modalService.show(AlertComponent, {
            initialState: { messages: "library.remove", name: item.name },
        });
        this.modalRef.content.onClose.subscribe((result) => {
            if (result == true) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: item.id } });
            }
        });
    }
}
