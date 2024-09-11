import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';
import { AlertComponent } from '../../modules/alert/alert.component';
import { AlertSendMailComponent } from '../alert-send-mail/alert-send-mail.component';

@Component({
    selector: 'app-getlist-user',
    templateUrl: './get-list.component.html',
    styleUrls: ['./get-list.component.css']
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;

    public flags = true;

    private conf = {

        getListOrders: {
            path: "orders/index/getlist",
            token: 'getListOrders'
        },

        removeOrders: {
            path: "orders/index/remove",
            token: 'removeOrders'
        },

        sendMail: {
            path: "orders/index/sendmail",
            token: 'senmailOrders'
        },

        changestatus: {
            path: "orders/index/changedeliverystatus",
            token: 'changestatus'
        },
    }

    private cols = [
        { title: "lblStt", field: "index", show: true },
        { title: "id", field: "id", show: false },
        { title: "orders.code", field: "code", show: true, filter: true },
        { title: "orders.name", field: "name", show: true, filter: true },
        { title: "orders.total_price", field: "total_price", show: true, filter: true, class: 'text-right' },
        { title: "orders.total_sale", field: "total_sale", show: true, filter: true, class: 'text-right' },
        { title: "orders.total_payment", field: "total_payment", show: true, filter: true, class: 'text-right' },
        { title: "orders.delivery_status", field: "delivery_status", show: true, filter: true, class: 'text-left' },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: "Chi tiết", field: "action", show: true },
        { title: "", field: "status", show: true, filter: true }
    ];

    isAdmin = 1;

    loggedAccount = this.globals.USERS.get();

    public validPermission = (account): boolean => {
        let { email, is_delete } = this.loggedAccount;
        email = email.trim();
        const emailAccount = account.email.trim();

        if (is_delete === account.is_delete && email !== emailAccount) return false;

        if (is_delete === this.isAdmin) return true;

        return email === emailAccount;
    };

    public id: number = 0;

    public tableService = new TableService();

    private modalRef: BsModalRef;

    constructor(
        public globals: Globals,
        public toastr: ToastrService,
        public modalService: BsModalService
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
            switch (resp.token) {
                case this.conf.getListOrders.token:
                    if (resp.status == 1) {
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.sendMail.token:
                case this.conf.changestatus.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.getList()
                    }
                    break;

                case this.conf.removeOrders.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.flags = true;
                        this.getList()
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'user', sorting: { field: "status", sort: "DESC", type: "" } });
        this.getList();
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    changeStatus(id, status) {
        if (this.flags) {
            this.globals.send({ path: this.conf.changestatus.path, token: this.conf.changestatus.token, data: { delivery_status: status }, params: { id: id, } });
        }
    }

    getList() {
        this.globals.send({ path: this.conf.getListOrders.path, token: this.conf.getListOrders.token });
    }

    onRemove(item: { id: number, name: any }) {
        this.id = +item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'Huỷ đơn hàng', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.removeOrders.path, token: this.conf.removeOrders.token, params: { id: +item.id } });
            }
        });
    }

    onSendMail(item: { id: number, name: any }) {
        this.id = item.id;
        this.modalRef = this.modalService.show(AlertSendMailComponent, { initialState: {} });
        this.modalRef.content.onClose.subscribe(result => {
            if (result.skip == true) {
                this.globals.send({ path: this.conf.sendMail.path, data: result.sale, token: this.conf.sendMail.token, params: { id: +item.id } });
            }
        });
    }

}
