import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../../globals';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-attribute',
    templateUrl: './attribute.component.html',
})
export class AttributeComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public fm: FormGroup;

    public listtype = [

        { title: "product.general", check: true, value: 0 },
        { title: "product.featured", check: true, value: 1 },
        { title: "product.hot", check: true, value: 2 },

    ];

    private connect;

    private conf = {
        getRow: {
            path: "products/index/getrow",
            token: 'getRowProduct'
        },
        process: {
            path: "products/index/process",
            token: 'process'
        }
    }

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private toastr: ToastrService,
        public globals: Globals,
        private routerAct: ActivatedRoute,
        public translate: TranslateService,
    ) {


        this.routerAct.params.subscribe(params => {
            this.id = +params.id
        })
        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getRow.token:
                    let data = resp.data;
                    this.fmConfigs(data);
                     if (resp.data.id && +resp.data.id == this.id) {

                                this.listtype = this.listtype.filter(item => {

                                    item.check = (resp.data.type.find((row)=>row==item.value) == undefined) ? false : true;
    
                                    return true;
                                })

                        }
                    break;
                case "process":
                    let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";
                    this.toastr[type](resp["message"], type);
                    break;
                default:
                    break;
            }
        });
    }
    
    ngOnInit() {
        this.routerAct.params.subscribe(params => {
            this.id = +params['id'];

            if (this.id && +this.id > 0) {

                this.getRow();

            } else {

                this.fmConfigs();
            }

        })
    }

    getRow() {
        this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } });
    }

    ngOnDestroy() {
        this.connect.unsubscribe()
    }

    fmConfigs(item: any = "") {
        item = typeof item === 'object' ? item : { status: 1, type: 1 };
        this.fm = this.fb.group({
            id: item.id ? item.id : '',
            name: [item.name ? item.name : '', [Validators.required]],
            note: item.note ? item.note : '',
            status: (item.status && item.status == 1) ? true : false,
        });
    }

    onSubmit() {
        if (this.fm.valid) {

            let data: any = this.fm.value;
            data.type = JSON.stringify(Object.keys(this.listtype.reduce((n, o, i) => {

                if (o.check == true) {
    
                    n[o.value] = o.value;
    
                }
    
                return n;
            }, {})));
            
            data.status = data.status == true ? 1 : 0;
            this.globals.send({ path: this.conf.process.path, token: 'process', data: data, params: { id: this.id || 0 } })
        }
    }
}
