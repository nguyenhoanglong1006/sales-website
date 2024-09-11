import { Component, OnInit, Input } from '@angular/core';

import { Globals } from '~/globals';

@Component({
    selector: 'box-sidebar-news',
    templateUrl: './sidebar-news.component.html',
    styleUrls: ['./sidebar-news.component.scss'],
})
export class SidebarNewsComponent implements OnInit {
    @Input() heading: string;
    @Input() dataList: any[];

    constructor(
        public globals: Globals
    ) {}

    ngOnInit() {}
}
