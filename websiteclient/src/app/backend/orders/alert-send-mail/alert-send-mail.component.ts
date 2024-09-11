import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Globals } from '~/globals';

@Component({
    selector: 'app-alert-send-mail',
    templateUrl: './alert-send-mail.component.html',
})
export class AlertSendMailComponent implements OnInit {

    public items: any = {};

    public onClose: Subject<any>;

    public token: any = {
        getlist: "settings/contactsale/getlist",
    }

    public connect;

    public list = [];

    constructor(
        public globals: Globals,
        public modalRef: BsModalRef,
        public translate: TranslateService,
        public modalService: BsModalService,
        @Inject(ModalOptions) public data: any,) {

        this.connect = this.globals.result.subscribe((response: any) => {

            switch (response.token) {

                case "getlistcontactsale":
                    this.list = response.data
                    break;

                default:
                    break;
            }
        })
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.globals.send({ path: this.token.getlist, token: 'getlistcontactsale' });
    }

    public onConfirm(): void {
        let item = { skip: true, sale: this.items }
        this.onClose.next({ skip: true, sale: this.items })
        this.modalRef.hide();
    }
}
