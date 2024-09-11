import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-getlist-user',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getListUsers: {
            path: "users/index/getlist",
            token: 'getListUsers'
        },
        removeUsers: {
            path: "users/index/remove",
            token: 'removeUsers'
        },
    }

    private cols = [
        { title: "lblStt", field: "index", show: true },
        { title: "id", field: "id", show: false },
        { title: "lblAvatar", field: "avatar", show: true },
        { title: "lblName", field: "name", show: true, filter: true },
        { title: "lblPhone", field: "phone", show: true, filter: true },
        { title: "lblEmail", field: "email", show: true, filter: true },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: "lblAction", field: "action", show: true },
        { title: "", field: "status", show: true, filter: true }
    ];

    isAdmin = 1;

    loggedAccount = this.globals.USERS.get();

    public validPermission = (account): boolean => {
        
        let { email, is_delete } = this.loggedAccount;
        
        email = email.trim();
        
        const emailAccount = account.email.trim();

        if(is_delete === account.is_delete && email !== emailAccount) return false;

        if(is_delete === this.isAdmin) return true;
        
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
            switch (resp.token) {
                case this.conf.getListUsers.token:
                    if (resp.status == 1) {
                        this.tableService._concat(resp.data, true);
                    }
                    break;

                case this.conf.removeUsers.token:
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.tableService._delRowData(this.id);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'user', sorting: { field: "maker_date", sort: "DESC", type: "" } });
        this.getList();
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getList() {
        this.globals.send({ path: this.conf.getListUsers.path, token: this.conf.getListUsers.token });
    }

    onRemove(id: number, name: any) {
        this.id = id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'user.remove', name: name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.removeUsers.path, token: this.conf.removeUsers.token, params: { id: id } });
            }
        });
    }
}
