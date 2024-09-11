import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'box-breadcrumb',
    templateUrl: './box-header-page.component.html',
    styleUrls: ['./box-header-page.component.scss'],
})
export class BoxHeaderPageComponent implements OnInit {
    @Input('data') data: any;

    constructor(private router: Router) { }

    ngOnInit() {

    }
}
