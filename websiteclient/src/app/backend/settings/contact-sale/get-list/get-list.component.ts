import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../globals';
import { AlertComponent } from '../../../modules/alert/alert.component';
import { TableService } from '../../../../services/integrated/table.service';
@Component({
    selector: 'app-get-list',
    templateUrl: './get-list.component.html',
})

export class ContactSalelistComponent implements OnInit, OnDestroy {

    public connect;

    public show;

    public id;

    public flag: boolean = false

    public table = new TableService();

    public token: any = {

        getlist: "settings/contactsale/getlist",

        remove: "settings/contactsale/remove"
    }

    private cols = [
        { title: 'lblStt', field: 'index', show: true },
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblMaker_date', field: 'maker_date', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '#', field: 'status', show: true, filter: true },
    ];

    modalRef: BsModalRef;

    constructor(

        public toastr: ToastrService,

        public globals: Globals,

        private modalService: BsModalService,
    ) {



        this.connect = this.globals.result.subscribe((response: any) => {

            switch (response.token) {

                case "getlistcontactsale":

                    this.table.sorting = { field: "maker_date", sort: "DESC", type: "" };

                    this.table._concat(response.data, true);

                    break;
                case "removecontactsale":

                    this.flag = !this.flag

                    let type = (response.status == 1) ? "success" : (response.status == 0 ? "warning" : "danger");

                    this.toastr[type](response.message, type, {closeButton: true });

                    if (response.status == 1) {

                        setTimeout(() => {

                            this.table._delRowData(this.id);

                        }, 1000);
                    }

                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.getlist();
    }
     ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }
    getlist = () => {

        this.table._ini({ cols: this.cols, data: [], count: 10 });

        this.globals.send({ path: this.token.getlist, token: 'getlistcontactsale' });

    }
    onRemove(item) {
        this.id = item.id;

        this.flag = !this.flag

        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'contactsale.remove', name: item.name } });

        this.modalRef.content.onClose.subscribe(result => {

            if (result == true && this.flag) {

                this.globals.send({ path: this.token.remove, token: 'removecontactsale', params: { id: item.id } });
            }
        });
    }
}
