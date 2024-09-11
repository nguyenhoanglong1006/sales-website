import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { Globals } from '../../../globals';
@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {

    public list = [
        { title: 'products.information', link: '', show: true, },
        { title: 'products.price', link: 'price', show: true },
        { title: 'products.images', link: 'picture', show: true },
        // { title: 'products.attribute', link: 'attribute', show: true },
        { title: 'products.seo', link: 'description', show: true },
    ];

    public id: number = 0;

    public connect;

    item: any = {};

    code: string = ''

    constructor(
        public routerAct: ActivatedRoute,
        public router: Router,
        public globals: Globals,
    ) {
        let slipt = window.location.href.split("/").reverse();
        
        this.id = isNaN(+slipt[0]) ? 0 : +slipt[0];

        this.list[0].link = +this.id > 0 ? 'update' : 'insert'               
    }
    ngOnInit() {

    }
}
