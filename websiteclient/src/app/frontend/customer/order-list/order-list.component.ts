import { CustomerService } from './../../../services/customer/customer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';
import { AlertComponent } from 'ngx-bootstrap/alert';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
    private connect;

    private cols = [
        { title: "orders.stt", field: "index", show: true },
        { title: "id", field: "id", show: false },
        { title: "orders.code", field: "code", show: true, filter: true },
        { title: "orders.name", field: "name", show: true, filter: true },
        { title: "orders.total_price", field: "total_price", show: true, filter: true, class: 'text-right'},
        { title: "orders.total_sale", field: "total_sale", show: true, filter: true, class: 'text-right' },
        { title: "orders.total_payment", field: "total_payment", show: true, filter: true,  class: 'text-right' },
        { title: "orders.delivery_status", field: "delivery_status", show: true, filter: true, class: 'text-left' },
        { title: 'orders.maker_date', field: 'maker_date', show: true, filter: true },
        { title: "orders.detail", field: "action", show: true },
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
    public user: any = {}

    public tableService = new TableService()
    private modalRef: BsModalRef;

    constructor(
        public globals: Globals,
        public toastr: ToastrService,
        public modalService: BsModalService,
        private customerService: CustomerService,
    ) {
      this.user = this.globals.CUSTOMERS.get(); 
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'user', sorting: { field: "maker_date", sort: "DESC", type: "" } });
        this.item.get()
    }
  
  public item = {
    data: <any>{},
    get: (): void => {
      let data = this.user.id
        this.customerService.getOrderList({ data: data }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.item.data = resp.data
                
                this.tableService._concat(resp.data, true);
                
            }
        });
    },
  };

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }
}
