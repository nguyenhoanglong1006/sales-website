import { Component, OnInit, OnDestroy } from '@angular/core';
import { Globals } from '../../../globals';
import { TableService } from '../../../services/integrated/table.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AlertComponent } from '~/backend/modules/alert/alert.component';

@Component({
    selector: 'app-getlist',
    templateUrl: './getlist.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;

    private cols = [
        { title: 'lblStt', field: 'index', show: true, filter: true },
        { title: 'contact.email', field: 'email', show: true, filter: true },
        { title: 'contact.message', field: 'message', show: true, filter: true },
        { title: 'contact.maker_date', field: 'maker_date', show: true, filter: true },
        { title: 'contact.id_checked', field: 'user_name', show: true, filter: true },
        { title: '', field: 'checked', show: true, filter: true },
        { title: '#', field: 'action', show: true, filter: false }
    ];

    private conf = {
        getlist: {
            path: 'contacts/index/getlist',
            token: 'getListContacts'
        },

        remove: {
            path: 'contacts/index/remove',
            token: 'removeContacts'
        }
    }

    private modalRef: BsModalRef;
    private idRemove: number = 0
    constructor(
        public tableService: TableService,
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
                        this.tableService.sorting = { field: "maker_date", sort: "DESC", type: 'date' };
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) { this.tableService._delRowData(this.idRemove); }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token });
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'contact', sorting: { field: "maker_date", sort: "DESC", type: "date" } });
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    onRemove(item) {
        this.idRemove = +item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'Xoá liên hệ' } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true && item.id > 0) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: +item.id } });
            }
        });
    }
}
