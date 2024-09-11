import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { Globals } from '~/globals';

@Component({
    selector: 'app-box-category',
    templateUrl: './box-category.component.html',
    styleUrls: ['./box-category.component.scss'],
})

export class BoxCategoryComponent {

    @Input('item') item: any;

    public width: number;

    constructor(
        public globals: Globals,
        private _sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {

    }

    transform(v: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(v);
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.width = window.innerWidth;
        }
    }
}

