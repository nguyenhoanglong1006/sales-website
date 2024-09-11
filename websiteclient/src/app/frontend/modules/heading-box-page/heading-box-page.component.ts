import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'heading-box-page',
    templateUrl: './heading-box-page.component.html',
    styleUrls: ['./heading-box-page.component.css'],
})
export class HeadingBoxPageComponent implements OnInit {
    @Input() heading: string = '';

    constructor() {}

    ngOnInit() {}
}
