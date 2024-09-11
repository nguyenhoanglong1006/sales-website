import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './modal-singin-singup.component.html',
})
export class ModalSinginSingupComponent implements OnInit {
  public onClose: Subject<boolean>;
  public type: number = 1;
  constructor(
    public modalRef: BsModalRef,
    public translate: TranslateService,
    public modalService: BsModalService,
    @Inject(ModalOptions) public data: any
  ) {
    this.type = +this.data.initialState.data;
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  eventOutput = (e) => {
    if (e == true) {
      this.onClose.next(true);
      this.modalRef.hide();
    }
  };
}
