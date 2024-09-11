import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr'

import { TableService } from '../../../services/integrated/table.service';
import { Globals } from '../../../globals';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-product',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;

    private id = 0; //

    private conf = {
        getList: {
            path: "products/index/getlist",
            token: 'getListProducts'
        },
        changeStatus: {
            path: "products/index/changestatus",
            token: 'changeStatusProducts'
        },
        remove: {
            path: "products/index/remove",
            token: 'removeProducts'
        }
    }


    @Input("filter") filter: any;

    @Input("change") change: any;

    modalRef: BsModalRef;

    private cols = [
        { title: 'lblStt', field: 'index', show: false },
        { title: 'lblImages', field: 'images', show: true },
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblGroup', field: 'product_name_group', show: true },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '', field: 'status', show: true }

    ];

    public tableService = new TableService();
    constructor(
        private modalService: BsModalService,
        private toastr: ToastrService,
        public router: Router,
        public globals: Globals
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
            switch (resp.token) {
                case this.conf.getList.token:
                    this.tableService._concat(resp.data, true);
                    break;
                case this.conf.remove.token:
                    if (resp.status == 1) {
                        this.toastr[type](resp.message, type);
                        this.tableService._delRowData(this.id)
                        setTimeout(() => {
                            this.getList()
                        }, 100);
                    }
                    break;

                case this.conf.changeStatus.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.getList()
                    }
                    break;
                default:
                    break;
            }
        });

    }

    ngOnInit() {
        this.getList();
    }
    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }
    getList = () => {
        this.globals.send({ path: this.conf.getList.path, token: this.conf.getList.token });
        this.tableService._ini({ cols: this.cols, data: [], count: 50 });
    }
    ngOnChanges(e: SimpleChanges) {
        if (typeof this.filter === 'object') {
            let value = Object.keys(this.filter);
            if (value.length == 0) {
                this.tableService._delFilter('page_id');
            } else {
                this.tableService._setFilter('page_id', value, 'in', 'number');
            }
        }
    }
    changeStatus(id) {
        this.globals.send({ path: this.conf.changeStatus.path, token: this.conf.changeStatus.token, params: { id: id } });
    }

    onRemove(id: number, name: any) {
        const config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true
        };
        this.id = id
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'products.remove', name: name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: id } });
            }
        });
    }
}
