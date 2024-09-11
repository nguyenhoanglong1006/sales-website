import { Directive, ElementRef, OnChanges, SimpleChanges, Input } from '@angular/core';

@Directive({
    selector: '[bindSrc]'
})
export class BindSrcDirective implements OnChanges {
    @Input("bindSrc") src: any;
    constructor(
        public el: ElementRef
    ) {

    }
    ngOnChanges(e: SimpleChanges) {
        if (this.src) {
            this.el.nativeElement.src = this.src;
        }
    }
}