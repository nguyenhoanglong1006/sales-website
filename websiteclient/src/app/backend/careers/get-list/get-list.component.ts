import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-careers',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnChanges, OnDestroy {
    @Input("filter") filterId: number;

    private connect;
    private conf = {
        getlist: {
            path: "careers/index/getlist",
            token: 'getlistCareers'
        },
        changeStatus: {
            path: "careers/index/changestatus",
            token: 'changeStatusCareers'
        },
        changePin: {
            path: "careers/index/changepin",
            token: 'changePinCareers'
        },
        remove: {
            path: "careers/index/remove",
            token: 'removeCareers'
        }
    }

    private cols = [
        { title: 'careers.name', field: 'name', show: true, filter: true },
        { title: 'careers.workplace', field: 'workplace', show: true, filter: true },
        { title: 'careers.deadline', field: 'deadline', show: true, filter: true },
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
        private toastr: ToastrService
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {

            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");

            switch (resp.token) {

                case this.conf.getlist.token:
                    if (resp.status == 1) {
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.changeStatus.token:
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
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'Careers', sorting: { field: "maker_date", sort: "DESC", type: "" } });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getList() {
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token, });
    }

    ngOnChanges() {
        if (this.filterId === 0) {
            this.tableService._delFilter('workplace_id');
        } else {
            this.tableService._setFilter('workplace_id', [this.filterId], 'in', 'number');
        }
    }

    changeStatus(id) {
        this.globals.send({ path: this.conf.changeStatus.path, token: this.conf.changeStatus.token, params: { id: id, } });
    }

    changePin(id) {
        this.globals.send({ path: this.conf.changePin.path, token: this.conf.changePin.token, params: { id: id } });
    }

    onRemove(item) {
        this.id = +item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'careers.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true && this.id > 0) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: this.id } });
            }
        });
    }
}
