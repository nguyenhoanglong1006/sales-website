import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { Globals } from '~/globals';
import { TableService } from '~/services/integrated/table.service';
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
        { title: 'lblParentName', field: 'parent_name', show: true, filter: true },
        { title: 'lblType', field: 'type', show: true, filter: true },
        { title: 'lblOrders', field: 'orders', show: true, filter: true, type: 'number' },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: '#', field: 'action', show: true }
    ];

    public modalRef: BsModalRef;

    public id: number = 0;

    public tableService = new TableService();

    public flags: boolean = true;
    public data: any = [];

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
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                        this.tableService._concat(resp['data'], true);
                        let list = [];
                        this.data = []
                        list = resp['data'].sort((a, b) => a.type - b.type);
                       this.data = this._compaid(list)
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.tableService._delRowData(this.id)
                        setTimeout(() => {
                            this.getList()
                        }, 100);
                    }
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
        this.globals.send({ path: this.conf.getListPage.path, token: this.conf.getListPage.token, params: { type: 2 } });
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
            this.globals.send({ path: this.conf.changestatus.path, token: this.conf.changestatus.token, data: { status: status == 1 ? 0 : 1 }, params: { id: id, } });
        }
    }

    _compaid = (data) => {
        let list = [];
        data = data.filter(function (item) {
            delete item.data;
            let v = (isNaN(+item.page_id) && item.page_id) ? 0 : +item.page_id;
            v == 0 ? '' : list.push(item);
            return v == 0 ? true : false;
        })
        let compaidmenu = (data, skip, level = 0) => {
            level = level + 1;
            if (skip == true) {
                return data;
            } else {
                for (let i = 0; i < data.length; i++) {
                    let obj = data[i]['data'] && data[i]['data'].length > 0 ? data[i]['data'] : []
                    list = list.filter(item => {
                        let skip = (+item.page_id == +data[i]['id']) ? false : true;
                        if (skip == false) { obj.push(item); }
                        return skip;
                    })
                    let skip = (obj.length == 0) ? true : false;

                    data[i]['level'] = level;
                    data[i]['data'] = compaidmenu(obj, skip, level);
                }
                return data;
            }
        };

        return compaidmenu(data, false);
    }

    onRemove(item: any): void {
        this.id = item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'pages.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                let data = item.images ? {
                    del: [item.images],
                    path: 'uploads/pages/',
                    multiple: false
                } : {}
                this.globals.send({
                    path: this.conf.remove.path, token: this.conf.remove.token, data: data, params: { id: item.id, type: item.type }
                });

            }
        });
    }

    filter = {
        id: 0,
        onfilter: (id) => {
            this.filter.id = this.filter.id !== id ? id : 0;
            
            this.tableService.data = this.filter.id != 0 ? this.tableService.dataList.filter(res => res.id == id || res.page_id == id) : this.tableService.dataList;
        }
    }
}

