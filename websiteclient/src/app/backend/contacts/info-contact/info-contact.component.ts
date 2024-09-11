import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../../../globals';

@Component({
    selector: 'app-info-contact',
    templateUrl: './info-contact.component.html',
    styleUrls: ['./info-contact.component.css']
})
export class InfoContactComponent implements OnInit, OnDestroy {

    public id: number;

    fm: FormGroup;

    private connect;

    public infoContact: any = {};

    public skip: any = false;

    public hidden: any = false;

    public flag: boolean = true;

    private conf = {
        getrow: {
            path: 'contacts/index/getrow',
            token: 'getRowContact'
        },
        process: {
            path: 'contacts/index/process',
            token: 'processContact'
        }
    }

    constructor(
        public fb: FormBuilder,
        public toastr: ToastrService,
        public router: Router,
        public routerAct: ActivatedRoute,
        public globals: Globals,
        private translate: TranslateService,
    ) {
        this.routerAct.params.subscribe(params => {
            this.id = +params['id'];
        })

        this.connect = this.globals.result.subscribe((resp: any) => {

            let type = resp.status == 1 ? "success" : resp.status == 0 ? "warning" : "danger";

            switch (resp.token) {

                case this.conf.getrow.token:
                    
                    this.infoContact = resp['data'];
                    if (this.infoContact.subject_send || this.infoContact.message_send) {
                        this.hidden = true;
                    }
                    this.fmConfigs();
                    this.level._select(this.infoContact.level);
                    break;

                case this.conf.process.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.getRow();
                        this.skip = false;
                    }
                    this.flag = true;
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.getRow()
    }

    getRow() {
        this.globals.send({ path: this.conf.getrow.path, token: this.conf.getrow.token, params: { id: this.id } });
    }

    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    fmConfigs() {
        this.fm = this.fb.group({
            id: [this.id],
            name: [this.infoContact.name, [Validators.required]],
            email: [this.infoContact.email, [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
            phone: [this.infoContact.phone, [Validators.pattern(/[0-9\+\-\ ]/)]],
            subject_send: ['', [Validators.required]],
            message_send: ['', [Validators.required]],
        })
    }

    public level = {
        data: [
            { title: 'FESupport.feedback.emotion1', image: '../../../assets/img/tamp/level1.png', value: 1 },
            { title: 'FESupport.feedback.emotion2', image: '../../../assets/img/tamp/level2.png', value: 2 },
            { title: 'FESupport.feedback.emotion3', image: '../../../assets/img/tamp/level3.png', value: 3 },
            { title: 'FESupport.feedback.emotion4', image: '../../../assets/img/tamp/level4.png', value: 4 },
            { title: 'FESupport.feedback.emotion5', image: '../../../assets/img/tamp/level5.png', value: 5 }
        ],
        item: <any>{},
        _select: (value) => {
            let item = this.level.data.filter((resp: any) => resp.value == value);
            item.length > 0 ? this.level.item = item[0] : {};
        }
    }


    changePageDetail(e) {
        this.fm.controls['message_send'].setValue(e.detail);
        let message = this.translate.instant('settings.pageBuilder.setSuccess', { name: e.name });
        this.toastr['success'](message, 'success');
    }

    onSubmit() {

        if (this.flag) {

            this.flag = false;

            let check = (this.fm.value) ? 1 : 0;

            let data = this.fm.value;

            data.checked = check;

            data.status = (this.fm.value) ? 1 : 0;

            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: data, params: { id: this.id } });
        }
    }


}
