import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Globals } from '../../../globals';

@Component({
    selector: 'app-box-content',
    templateUrl: './box-content.component.html',
    styleUrls: ['./box-content.component.scss'],
})
export class BoxContentComponent {

    @Input('item') item: any;
    @Input('type') type: any;
    public width: number;

    constructor(
        public globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {

    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.width = window.innerWidth;
        }
    }
}