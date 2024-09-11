import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Globals } from '../../../globals';
import { ToslugService } from '../../../services/integrated/toslug.service';

@Component({
    selector: 'app-module-pagebuilder',
    templateUrl: './pagebuilder.component.html',
    styleUrls: ['./pagebuilder.component.css'],
    providers: [ToslugService]
})
export class PagebuilderComponent implements OnInit, OnDestroy {



    public onClose: Subject<any>;
    public _FroalaPages;
    constructor(
        private globals: Globals,
        public _modalRef: BsModalRef,
        @Inject(ModalOptions) public data: any,
    ) {

    }

    ngOnInit(): void {
        this.onClose = new Subject();
        setTimeout(() => {
            if (window['FroalaPages']) {
                // Init pages.
                this._FroalaPages = new window['FroalaPages']('selector-id', {
                    pageRightButtons: [
                        [],
                    ],
                    designsThumbsDir: this.globals.BASE_API_URL + 'public/froalapage/screenshots/',
                    designsImagesDir: this.globals.BASE_API_URL + 'public/froalapage/imgs',
                })

                if (this.data && this.data.length > 0) {
                    this.editModal()
                }
            }
        }, 200);

    }

    ngOnDestroy() {

    }
    closeModal() {

        this.onClose.next(true);
        this._modalRef.hide();
    }

    async editModal() {
        await this._FroalaPages.setHTML(this.data);
    }

    async saveModal() {
        this.onClose.next(await this._FroalaPages.getHTML());
        this._modalRef.hide();
    }


}
