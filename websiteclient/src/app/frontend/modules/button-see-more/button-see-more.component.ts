import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'box-button-see-more',
    templateUrl: './button-see-more.component.html',
    styleUrls: ['./button-see-more.component.scss'],
})
export class ButtonSeeMoreComponent implements OnInit {
    @Input() link: string = '';
    @Input() color: string = '';
    @Input() fontSize: string | number = '';

    constructor() {}

    ngOnInit() {}
}
