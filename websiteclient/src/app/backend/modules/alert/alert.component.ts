import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
})
export class AlertComponent implements OnInit {

    public messages: any
    public name: any
    public onClose: Subject<boolean>;

    constructor(
        public modalRef: BsModalRef,
        public translate: TranslateService,
        public modalService: BsModalService,
        @Inject(ModalOptions) public data: any, ) {
        this.messages = data.initialState.messages;
        this.name = data.initialState.name;
    }

    ngOnInit() {
        this.onClose = new Subject();
    }
    public onConfirm(): void {
        this.onClose.next(true);
        this.modalRef.hide();
    }
}
