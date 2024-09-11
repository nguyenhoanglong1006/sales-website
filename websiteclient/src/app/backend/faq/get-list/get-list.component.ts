import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../globals';
import { TableService } from '../../../services/integrated/table.service';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-faq',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;

    private conf = {
        getlist: {
            path: "faq/index/getlist",
            token: 'getListFaq'
        },
        changePin: {
            path: "faq/index/changepin",
            token: 'changePinFaq'
        },
        remove: {
            path: "faq/index/remove",
            token: 'removeFaq'
        }
    }

    private cols = [
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblOrders', field: 'orders', show: true, filter: true, type: 'number' },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '', field: 'status', show: true },
    ];

    public modalRef: BsModalRef;

    public tableService = new TableService();

    public id: number = 0;

    constructor(
        public globals: Globals,
        private modalService: BsModalService,
        private toastr: ToastrService,
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {

            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");

            switch (resp.token) {

                case this.conf.getlist.token:
                    if (resp.status == 1) {
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.changePin.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.getList()
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.tableService._delRowData(this.id); }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.getList()
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'listFaq', sorting: { field: "date_client", sort: "DESC", type: "" } });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getList() {
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token, });
    }

    changePin(id) {
        this.globals.send({ path: this.conf.changePin.path, token: this.conf.changePin.token, params: { id: id, } });
    }

    onRemove(item) {
        this.id = +item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'faq.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true && this.id > 0) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: this.id } });
            }
        });
    }
}
