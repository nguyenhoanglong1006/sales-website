import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'button-back',
    templateUrl: './button-back.component.html',
    styleUrls: ['./button-back.component.css'],
})
export class ButtonBackComponent implements OnInit {
    @Input() link?: string = '';

    constructor(private router: Router) {}

    ngOnInit() {}

    onBackClick = () =>
        this.link.length ? this.router.navigate([this.link]) : window.history.back();
}
