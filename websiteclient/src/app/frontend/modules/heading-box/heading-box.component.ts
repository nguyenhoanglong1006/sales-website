import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'heading-box',
    templateUrl: './heading-box.component.html',
    styleUrls: ['./heading-box.component.scss'],
})
export class HeadingBoxComponent implements OnInit {
    @Input() heading: string = '';
    @Input() margin: boolean = true;
    @Input() isPaddingLeft: boolean = true;

    constructor() { }

    ngOnInit() { }
}
