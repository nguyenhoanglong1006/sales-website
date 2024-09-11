import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-content',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnChanges, OnDestroy {
    @Input("filter") filterId: number;

    private connect;
    private conf = {
        getListContent: {
            path: "contents/index/getlist",
            token: 'getlistcontent'
        },
        changeStatusContent: {
            path: "contents/index/changestatus",
            token: 'changeStatusContent'
        },
        removeContent: {
            path: "contents/index/remove",
            token: 'removeContent'
        },
        changePin: {
            path: "contents/index/changepin",
            token: 'changepin'
        },
    }

    private cols = [
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblGroup', field: 'name_group', show: true, filter: true },
        { title: 'contents.date', field: 'date', show: true, filter: true },
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

                case this.conf.getListContent.token:
                    if (resp.status == 1) {
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "date", sort: "DESC", type: 'date' };
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.changePin.token:
                case this.conf.changeStatusContent.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.getList()
                    }
                    break;

                case this.conf.removeContent.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.tableService._delRowData(this.id); }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.getList();
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'content', sorting: { field: "date_client", sort: "DESC", type: "" } });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getList() {
        this.globals.send({ path: this.conf.getListContent.path, token: this.conf.getListContent.token, });
    }

    ngOnChanges() {
        if (this.filterId === 0) {
            this.tableService._delFilter('page_id');
        } else {
            this.tableService._setFilter('page_id', [this.filterId], 'in', 'number');
        }
    }

    changeStatus(id) {
        this.globals.send({ path: this.conf.changeStatusContent.path, token: this.conf.changeStatusContent.token, params: { id: id } });
    }

    changePin(item) {
        this.globals.send({ path: this.conf.changePin.path, token: this.conf.changePin.token, params: { id: +item.id } });
    }

    onRemove(item) {
        this.id = +item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'contents.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true && this.id > 0) {
                let data = item.images ? {
                    del: [item.images],
                    path: 'uploads/contents/',
                    multiple: false
                } : {}
                this.globals.send({ path: this.conf.removeContent.path, token: this.conf.removeContent.token, data: data, params: { id: this.id} });
            }
        });
    }
}
