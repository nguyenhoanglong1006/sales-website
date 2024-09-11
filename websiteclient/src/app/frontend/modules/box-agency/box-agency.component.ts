import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { Globals } from '~/globals';

@Component({
    selector: 'app-box-agency',
    templateUrl: './box-agency.component.html',
    styleUrls: ['./box-agency.component.scss'],
})
export class BoxAgencyComponent {

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

