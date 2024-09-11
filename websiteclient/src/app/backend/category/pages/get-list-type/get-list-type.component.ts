import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../../globals';
import { TableService } from '../../../../services/integrated/table.service';
import { AlertComponent } from '../../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-type',
    templateUrl: './get-list-type.component.html',
})
export class GetListTypeComponent implements OnInit, OnDestroy {

    private connect: any;
    private conf = {
        getListPage: {
            path: "pages/index/getlist",
            token: 'getListPage'
        },
        changePin: {
            path: "pages/index/changepin",
            token: 'changepin'
        },
        changestatus: {
            path: "pages/index/changestatus",
            token: 'changestatus'
        },
        remove: {
            path: "pages/index/remove",
            token: 'removePage'
        }
    }

    private cols = [
        { title: 'lblStt', field: 'index', show: true },
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblParentName', field: 'parent_name', show: true, filter: true },
        { title: 'lblOrders', field: 'orders', show: true, filter: true, type: 'number' },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: '', field: 'is_delete', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '#', field: 'status', show: true, filter: true },

    ];

    private modalRef: BsModalRef;
    public tableService = new TableService();
    public type: number = 0;
    public id: number = 0;
    public translateTitle: string = '';
    public flags: boolean = true;
    constructor(
        public globals: Globals,
        private modalService: BsModalService,
        private router: Router,
        private toastr: ToastrService
    ) {

        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
            switch (resp.token) {

                case this.conf.getListPage.token:
                    if (resp.status == 1) {
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                        this.tableService._concat(resp['data'], true);
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.tableService._delRowData(this.id) }
                    break;

                case this.conf.changePin.token:
                case this.conf.changestatus.token:
                    this.flags = true;
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.getList(this.type) }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'getListPages', count: 50 });
        this.translateTitle = this.router.url.split('/')[3];
        switch (this.router.url.split('/')[3]) {
            case 'product':
                this.type = 3
                break;
            case 'content':
                this.type = 4
                break;
            case 'library':
                this.type = 5
                break;
            case 'customer':
                this.type = 6
                break;
            case 'analysis-center':
                this.type = 7
                break;
            case 'shareholder':
                this.type = 8
                break;
            default:
                break;
        }

        this.getList(this.type)
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getList(type) {
        this.globals.send({ path: this.conf.getListPage.path, token: this.conf.getListPage.token, params: { type: type } });
    }

    changePin(item) {
        if (this.flags) {
            this.flags = false;
            this.globals.send({ path: this.conf.changePin.path, token: this.conf.changePin.token, params: { id: +item.id, pin: +item.pin } });
        }
    }

    changeStatus = (id, status) => {
        if (this.flags) {
            this.flags = false;
            this.globals.send({ path: this.conf.changestatus.path, token: this.conf.changestatus.token, data: { status: status == 1 ? 0 : 1 }, params: { id: id, } });
        }
    }

    onRemove(item: any): void {
        this.id = item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'pages.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: item.id, type: item.type } });
            }
        });
    }
}
