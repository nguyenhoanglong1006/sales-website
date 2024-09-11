import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[symbolNumber]'
})
export class NumberDirective {
    public element: ElementRef;
    constructor(public el: ElementRef) {
        setTimeout(() => {
            this.changes();
        }, 1);
    }
    @HostListener("change") changesValue() {
        setTimeout(() => {            
            this.changes();
        }, 10);
    }
    @HostListener("keyup") keupValue() {
        this.changes();
    }
    changes = () => {
        let value = this.el.nativeElement.value.toString().replace(/\./g, '');
        let val = isNaN(value) ? 0 : +value;
        let res = isNaN(value) ? 0 : ((val < 0) ? 0 : value);
        this.el.nativeElement.value = Number(res).toLocaleString('vi');
    }
}
