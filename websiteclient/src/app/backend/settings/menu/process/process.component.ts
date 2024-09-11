import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToslugService } from '../../../../services/integrated/toslug.service';
import { Globals } from '../../../../globals';

@Component({
    selector: 'app-menu-process',
    templateUrl: './process.component.html',
    providers: [ToslugService]
})
export class MenuProcessComponent implements OnInit, OnDestroy {

    private connect;

    private conf = {
        getListPage: {
            path: "pages/index/getlist",
            token: 'getListPage'
        },
        getrow: {
            path: "settings/menu/getrow",
            token: 'getRowMenu'
        },
        onChangeOrders: {
            path: "settings/menu/changeorders",
            token: 'onChangeOrders'
        },
        process: {
            path: "settings/menu/process",
            token: 'processMenu'
        }
    }

    public id: number;
    public fm: FormGroup;
    public dataPage: any = [];
    public listPage: any = [];
    public flags: boolean = true;
    public select = {
        data: [],
        list: [],
        compaid: () => {
            if (this.dataPage.length > 0) {
                let data = this.dataPage.filter(res => this.select.list[res.id]);
                this.select.data = data.sort((a, b) => a.orders - b.orders)
            }
        },

        onCheck: (e) => {
            if (e.target.checked === true) {
                this.select.list[e.target.value] = +e.target.value;
            } else {
                delete this.select.list[e.target.value];
            }
            this.select.compaid();
        }
    }
    public search = {
        value: '',
        data: [],
        fields: ['name'],
        _search: (e) => {
            this.search.value = e.target.value
        }
    }

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
    ) {


        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
            switch (resp.token) {
                case this.conf.getListPage.token:
                    if (resp.status == 1) {
                        this.search.data = resp.data;
                        this.dataPage = resp.data
                        this.template.onchange(1, resp.data)
                        this.select.compaid();
                    }
                    break;

                case this.conf.getrow.token:
                    if (resp.status == 1) {
                        let data = resp.data;
                        let container = data.container != null && +data.container.length > 0 ? data.container : [];
                        container = container.reduce((n, o, i) => { n[o] = o; return n }, []);
                        this.select.list = container;
                        this.fmConfigs(data);
                        this.getListPage();
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true;
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        setTimeout(() => {
                            this.router.navigate([this.globals.admin + '/settings/menu/get-list']);
                        }, 100);
                    }
                    break;
                case this.conf.onChangeOrders.token:
                    this.sort.id = 0;
                    this.getListPage();
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {

        this.routerAct.params.subscribe(params => {
            this.id = +params['id'] || 0;
            if (this.id > 0) {
                setTimeout(() => {
                    this.getRow(this.id);
                }, 100);
            }
        })
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    getRow(id) {
        this.globals.send({ path: this.conf.getrow.path, token: this.conf.getrow.token, params: { id: id } });
    }

    compaid(data) {
        let list = data.reduce((n, o, i) => {
            if (!n[o.type]) {
                n[o.type] = { data: [], type: '' }
            }
            return n
        }, []);
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            list[element.type].data.push(element);
            list[element.type].type = element.type
        }
        return Object.values(list);
    }
    _compaid = (data) => {
        let list = [];
        data = data.filter(function (item) {
            delete item.data;
            let v = (isNaN(+item.parent_id) && item.parent_id) ? 0 : +item.parent_id;
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
                        let skip = (+item.parent_id == +data[i]['id']) ? false : true;
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
    getListPage() {
        this.globals.send({ path: this.conf.getListPage.path, token: this.conf.getListPage.token, });
    }

    fmConfigs(item: any = "") {
        item = typeof item === 'object' ? item : { status: 1, orders: 0 };
        this.fm = this.fb.group({
            name: [item.name ? item.name : '', [Validators.required]],
            note: item.note ? item.note : '',
            status: (item.status && item.status == 1) ? true : false,
        })
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false;
            var data: any = this.fm.value;
            data.container = JSON.stringify(Object.values(this.select.list));
            data.status = data.status == true ? 1 : 0;
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id || 0 } });
        }
    }

    public sort = {
        id: 0,
        onChange: (e, id) => {
            this.sort.id = id
        },
        onSubmit: (id, orders) => {
            this.globals.send({ path: this.conf.onChangeOrders.path, token: this.conf.onChangeOrders.token, params: { id: id }, data: { orders: orders } });
        }
    }

    public template = {
        active: 0,
        onchange: (active, data = []) => {
            if (this.template.active != active) {
                this.template.active = active
                this.listPage = [];
                let list = [];
                if (data && data.length > 0) {
                    list = data.sort((a, b) => a.type - b.type);
                    if (+this.template.active == 2) {
                        this.listPage = this._compaid(list);
                    } else if (+this.template.active == 1) {
                        this.listPage = this.compaid(list);
                    }
                }
            }
        }
    }
}

