import { Component, OnInit, SimpleChanges } from "@angular/core";
import { Globals } from "../../../globals";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TableService } from "../../../services/integrated/table.service";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToslugService } from '../../../services/integrated/toslug.service';
import { LabelType, ChangeContext, Options } from 'ng5-slider';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: "app-product",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    providers: [ToslugService]
})

export class ListProductComponent implements OnInit {

    public connect;
    public cwstable = new TableService();
    public searchValue = "";
    public show: number = -1;
    public price: any = { min: 0, max: 0 };

    public page: any = {};
    public data: any = [];
    public categories: any = [];
    public cateListId = [];

    public token = {
        getProduct: "api/product/getproduct",
        getLink: "api/product/getlink",
        productCategory: "api/home/getcategories",
    };

    public width = document.body.getBoundingClientRect().width;

    public collapsedMenu = []
    openMobileFilter = false;
    public count: number = 0
    private cols = [
        { title: 'FEProduct.sortName', field: 'name', filter: true, active: true },
        { title: 'FEProduct.sortPrice', field: 'price', filter: true, type: 'number' },
    ];

    minValue: number = 0;
    maxValue: number = 100;

    options: Options = {
        floor: 0,
        ceil: 100,
        translate: (value: number, label: LabelType): string => {
            switch (label) {
                case LabelType.Low:
                    return '<b style="font-size:12px">Min: ' + this.setnumber(value) + ' đ </b>';
                case LabelType.High:
                    return '<b style="font-size:12px">Max: ' + this.setnumber(value) + ' đ </b>'
                default:
                    return this.setnumber(value);
            }
        }
    };

    constructor(
        public globals: Globals,
        public route: ActivatedRoute,
        public router: Router,
        public toSlug: ToslugService,
        public translate: TranslateService,
    ) {
        this.connect = this.globals.result.subscribe((res: any) => {
            switch (res.token) {
                case "getProduct":
                    this.data = []; this.count = -1
                    console.log("🚀 ~ file: list.component.ts:74 ~ ListProductComponent ~ this.connect=this.globals.result.subscribe ~ this.count:", this.count)
                    if (res.data.length > 0) {
                        this.data = res.data.filter((o) => o.price_actual = +o.price_sale && +o.price_sale > 0 ? +o.price_sale : +o.price);
                    }
                    this.show = this.data && this.data.length > 0 ? 1 : 0;
                    this.count = this.data && this.data.length > 0 ? this.data.length : 0;
                    console.log("🚀 ~ file: list.component.ts:79 ~ ListProductComponent ~ this.connect=this.globals.result.subscribe ~ this.count:", this.count)
                    this.cwstable._concat(this.data, true);
                    this.extract();
                    setTimeout(() => {
                        this.catFilter(this.data.id);
                    }, 50);
                    break;
                case "getLink":
                    this.page = {};
                    this.page = res.data;
                    break;
                case "productCategory":
                    this.categories = this.compaid(res.data);
                    this.cateListId = res.data.reduce((n, o) => {
                        n[o.id] = o;
                        return n;
                    }, [])
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.globals.send({ path: this.token.productCategory, token: "productCategory", });
        this.cwstable._ini({
            data: [], cols: this.cols, keyword: "getProduct", count: this.Pagination.itemsPerPage, sorting: { field: "name", sort: "", type: "number" },
        });
        this.route.params.subscribe((params) => {
            this.data = []; this.count = -1
            this.globals.send({ path: this.token.getLink, token: 'getLink', params: { link: params.links && params.links.length > 0 ? params.links : (params.link || 'san-pham') } });
            if ((params.link && params.link.length > 0) || (params.links && params.links.length > 0)) {
                this.globals.send({ path: this.token.getProduct, token: 'getProduct', params: { link: params.links && params.links.length > 0 ? params.links : params.link } });
            } else {
                this.globals.send({ path: this.token.getProduct, token: 'getProduct' });
            }
        });
    }

    ngOnChanges(e: SimpleChanges) { }

    public Pagination = {
        maxSize: 5,
        itemsPerPage: 16,
        change: (event: PageChangedEvent) => {
            const startItem = (event.page - 1) * event.itemsPerPage;
            const endItem = event.page * event.itemsPerPage;
            this.cwstable.data = this.cwstable.cached.slice(startItem, endItem);
            var el = document.getElementById('ListData');
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    extract = () => {
        let brand = {};
        let group = {};
        let price = { min: 0, max: 0 };
        if (this.cwstable.cachedList.length > 0) {
            price.min = (+this.cwstable.cachedList[0].price_sale > 0) ? +this.cwstable.cachedList[0].price_sale : +this.cwstable.cachedList[0].price;

            this.cwstable.cachedList.reduce((n, o, i) => {
                if (o.brand_id && +o.brand_id > 0) {
                    if (!brand[o.brand_id]) {
                        brand[o.brand_id] = { id: o.brand_id, name: o.brand_name, count: 0 };
                    }
                    if (brand[o.brand_id]) {
                        brand[o.brand_id].count = +brand[o.brand_id].count + 1;
                    }
                }

                if (o.page_id && +o.page_id > 0) {
                    if (!group[o.page_id]) {
                        group[o.page_id] = { id: o.page_id, name: o.parent_name, count: 0 };
                    }
                    if (group[o.page_id]) {
                        group[o.page_id].count = +group[o.page_id].count + 1;
                    }
                }
                let p = (+o.price_sale > 0) ? +o.price_sale : +o.price;
                price.min = p < price.min ? p : price.min;
                price.max = p > price.max ? p : price.max;

                this.changeOptions({
                    floor: 0,
                    ceil: price.max
                })

                return n;
            }, {});

            this.price = price;
        }
    }

    public catFilter(id) {
        if (this.cateListId[+id] && this.cateListId[+id].length > 0) {
            this.cateListId[+id].filter((res) => {
                this.groupCategory.filter(res.id, 1);
            })
        } else if (+id < 3 || +id > 4) {
            this.groupCategory.filter(id, 1);
        }
    }

    groupCategory = {
        data: [],
        value: [],

        filter: (id, skip = 0) => {
            let token = "page_id"
            let filter = this.cwstable._getFilter(token);
            let data = !filter.value ? {} : filter.value.reduce((n, o) => {
                n[o] = o;
                return n;
            }, {});

            if (data[id]) {
                this.groupCategory.value = filter.value.filter(item => {
                    if (skip == 1) {
                        return true;
                    } else {
                        return +item == id ? false : true;
                    }
                });
            } else {
                this.groupCategory.value.push(id);
            }

            if (this.groupCategory.value.length == 0) {
                this.cwstable._delFilter(token);
            } else {
                this.cwstable._setFilter(token, this.groupCategory.value, 'in');
            }
        },
    }

    changeOptions(option) {
        const newOptions: Options = Object.assign({}, this.options);
        newOptions.ceil = option.ceil;
        newOptions.floor = option.floor;
        this.options = newOptions;
        this.minValue = option.floor;
        this.maxValue = option.ceil;
    }

    onUserChangeEnd(changeContext: ChangeContext): void {
        this.cwstable._setFilter('price_actual', [changeContext.value, changeContext.highValue], 'between');
    }

    setnumber(Val) {
        let a = new Number(Val);
        return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    public collapseMenu(id) {
        if (this.collapsedMenu.includes(id) === true) {
            var index = this.collapsedMenu.indexOf(id);
            this.collapsedMenu.splice(index, 1);
        } else {
            this.collapsedMenu.push(id)
        }
    }

    setMenuMobile(open) {
        let list = document.getElementsByTagName('body')[0]
        this.openMobileFilter = open
        list.style.position = open ? 'fixed' : 'inherit'
    }

    compaid(data) {
        let list: any = [];
        for (let i = 0; i < data.length; i++) {
            data = data.filter((item: any) => {
                let v = (+item.page_id == +data[i]['id']) ? +item.page_id : 0;
                v == 0 ? '' : list.push(item);
                return v == 0 ? true : false;
            })
        };

        let compaidmenu = (data, skip, level = 0) => {

            level = level + 1;

            if (skip == true) {

                return data;

            } else {

                for (let i = 0; i < data.length; i++) {
                    let obj: any = [];
                    list = list.filter((item: any) => {
                        let skip = (+item.page_id == +data[i]['id']) ? false : true;
                        if (data[i].page_id > 0 && +item.page_id == +data[i]['id']) {
                            data[i].static = true;
                        }
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
}
