import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { Globals } from '../../../globals';
import { TableService } from '../../../services/integrated/table.service';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-getlist-pages',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;

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
        { title: 'lblType', field: 'type_builder', show: true, filter: true },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: '#', field: 'action', show: true }
    ];

    public modalRef: BsModalRef;

    public id: number = 0;

    public tableService = new TableService();

    public flags: boolean = true;

    constructor(
        private modalService: BsModalService,
        public router: Router,
        public toastr: ToastrService,
        public globals: Globals
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {

            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");

            switch (resp.token) {

                case this.conf.getListPage.token:
                    if (resp.status == 1) {
                        this.tableService._concat(resp['data'], true);
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.tableService._delRowData(this.id) }
                    break;

                case this.conf.changestatus.token:
                case this.conf.changePin.token:
                    this.flags = true;
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.getList() }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'getListPages', sorting: { field: "maker_date", sort: "DESC", type: "" } });
        this.getList()
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : ''
    }

    getList() {
        this.globals.send({ path: this.conf.getListPage.path, token: this.conf.getListPage.token, params: { type: 11 } });
    }

    changePin(item) {
        if (this.flags) {
            this.flags = false;
            this.globals.send({ path: this.conf.changePin.path, token: this.conf.changePin.token, params: { id: +item.id, pin: +item.pin } });
        }
    }

    changeStatus(id, status) {
        if (this.flags) {
            this.flags = false;
            this.globals.send({ path: this.conf.changestatus.path, token: this.conf.changestatus.token, params: { id: id, status: status == 1 ? 0 : 1 } });
        }
    }

    onRemove(item: any): void {
        this.id = item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'pageBuilder.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: item.id, type: item.type } });
            }
        });
    }
}

