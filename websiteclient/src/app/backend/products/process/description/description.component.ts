import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { TagsService } from '../../../../services/integrated/tags.service';
import { Globals } from '../../../../globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-description',
    templateUrl: './description.component.html',
    providers: [TagsService]
})
export class DescriptionComponent implements OnInit {

    private id: number;

    public connect;

    private conf = {
        getListGroup: {
            path: "pages/index/getlistgroup",
            token: 'getListGroup'
        },
        getRow: {
            path: "products/index/getrow",
            token: 'getRowProduct'
        },
        process: {
            path: "products/index/process",
            token: 'processProduct'
        }
    }

    fm: FormGroup;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public tags: TagsService,
        private toastr: ToastrService,
        private globals: Globals,
        private routerAct: ActivatedRoute,
    ) {

        this.routerAct.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id && this.id > 0) {
                this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id } });
            } else {

            }
        })
        this.connect = this.globals.result.subscribe((res: any) => {
            switch (res.token) {
                case this.conf.getRow.token:
                    if (+res.status == 1 && Object.keys(res.data).length > 0) {
                        this.fmConfigs(res.data);
                    } else {
                        this.router.navigate(['/admin/products/get-list'])
                    }
                    break;
                case this.conf.process.token:
                    let type = (res.status == 1) ? "success" : (res.status == 0 ? "warning" : "danger");
                    this.toastr[type](res.message, type);
                    break;
                default:
                    break;
            }
        });

    }

    ngOnInit() {
    }
    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    fmConfigs(item: any = '') {

        item = typeof item === 'object' ? item : {}

        this.fm = this.fb.group({
            name: [item.name ? item.name : ''],
            title: [item.title ? item.title : '', [Validators.maxLength(75)]],
            description: [item.description ? item.description : '', [Validators.maxLength(325)]],
        })
    }

    onSubmit() {
        const obj = this.fm.value;
        this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: obj, params: { id: this.id } });
    }
}
