import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../../globals';
import { TableService } from '../../../../services/integrated/table.service';
import { AlertComponent } from '../../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-tag',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        getlist: {
            path: "settings/redirect/getlist",
            token: 'getListRedirect'
        },
        remove: {
            path: "settings/redirect/remove",
            token: 'removeRedirect'
        }
    }
    private cols = [
        { title: 'lblStt', field: 'index', show: true },
        { title: 'settings.redirect.status_code', field: 'status_code', show: true, filter: true },
        { title: 'settings.redirect.link', field: 'link', show: true, filter: true },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '#', field: 'status', show: true, filter: true },
    ];
    public id: number = 0;
    public tableService = new TableService();
    private modalRef: BsModalRef;
    public flags: boolean = true
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
                        this.tableService._concat(resp['data'], true);
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) { this.tableService._delRowData(this.id) }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'getListRedirect' });
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token, });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    onRemove(item: any): void {
        this.id = item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'settings.redirect.remove', name: item.link } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: item.id } });
            }
        });
    }


}
