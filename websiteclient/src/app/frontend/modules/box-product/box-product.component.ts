import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Globals } from '../../../globals';

@Component({
    selector: 'app-box-product',
    templateUrl: './box-product.component.html',
    styleUrls: ['./box-product.component.scss']
})
export class BoxProductComponent implements OnInit {

    @Input('item') item: any;

    @Input('type') type: number;

    @Input('skip') skip: any;

    constructor(
        public globals: Globals,

    ) {   

    }

    ngOnInit() {
        
    }
}
