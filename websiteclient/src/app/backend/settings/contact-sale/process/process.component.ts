import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../globals';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
})
export class ContactSaleProcessComponent implements OnInit {

    public id: number = 0;

    public connect;

    private token: any = {

        process: "settings/contactsale/process",

        getrow: "settings/contactsale/getrow"
    }
    fm: FormGroup;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private routerAct: ActivatedRoute,
        public toastr: ToastrService,
        private globals: Globals,
    ) {


        this.connect = this.globals.result.subscribe((response: any) => {
            switch (response.token) {
                case "processcontactsale":
                    let type = (response.status == 1) ? "success" : (response.status == 0 ? "warning" : "danger");
                    this.toastr[type](response.message, type, { closeButton: true });
                    if (response.status == 1) {
                        setTimeout(() => {

                            this.router.navigate([this.globals.admin + '/settings/contact-sale/get-list']);
                        }, 2000);
                    }
                    break;
                case "getrowcontactsale":
                    this.fmConfigs(response.data);
                    break;
                default:
                    break;
            }
        });


    }

    ngOnInit() {
        this.routerAct.params.subscribe(params => {

            this.id = +params['id'];

            if (this.id && this.id != 0) {

                this.getRow();

            } else {

                this.fmConfigs();
            }
        })
    }
    ngOnDestroy() {

        this.connect.unsubscribe();
    }
    getRow() {
        this.globals.send({ path: this.token.getrow, token: "getrowcontactsale", params: { id: this.id } });

    }
    fmConfigs(item: any = "") {

        item = typeof item === 'object' ? item : { status: 1, parent_id: 0, orders: 0 };

        this.fm = this.fb.group({

            name: [item.name ? item.name : '', [Validators.required]],

            phone: [item.phone ? item.phone : '', [Validators.pattern("^[0-9]*$")]],

            email: [item.email ? item.email : '', [Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],

            link_fb: [item.link_fb ? item.link_fb : '',],

            link_zalo: [item.link_zalo ? item.link_zalo : '',],

            orders: +item.orders ? +item.orders : 0,

            note: item.note ? item.note : '',

            status: (item.status && +item.status == 1) ? true : false,

        })
    }
    onSubmit() {

        const obj = this.fm.value;

        obj.status === true ? obj.status = 1 : obj.status = 0;

        this.globals.send({ path: this.token.process, token: 'processcontactsale', data: obj, params: { id: this.id | 0 } });
    }


}
