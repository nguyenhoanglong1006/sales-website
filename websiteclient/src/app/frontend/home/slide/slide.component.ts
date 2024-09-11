import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { Globals } from '~/globals';
import { SlideService } from '~/services/home/slide.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnInit {

    public slider = [];

    public width: number;

    public isBrowser: boolean;

    constructor(
        public slideService: SlideService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public globals: Globals
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
        this.getSlide();
    }

    getSlide(): void {
        this.slideService.getSlide({ type: 1 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.slider = resp.data;
            }
        });
    }

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        dots: true,
        autoplay: true,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplaySpeed: 800,
        autoplayTimeout: 5000,
        navSpeed: 700,
        items: 1,
        nav: true,
        navText: [
            `<img
                width="20"
                height="20"
                src="/assets/icons/icon-slide-left.png"
                alt="Arrow left"
                class="img-fluid lazyload"
                loading="lazy" />`,
            `<img
                width="20"
                height="20"
                src="/assets/icons/icon-slide-right.png"
                alt="Arrow right"
                class="img-fluid lazyload"
                loading="lazy" />`,
        ],
    }
}
