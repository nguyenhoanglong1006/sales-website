import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { Globals } from '~/globals';
import { FooterService } from '~/services/modules/footer.service';
import { MenuService } from '~/services/modules/menu.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    public about: any = { data: [] };
    public service: any = { data: [] };
    public content: any = { data: [] };
    public investment: any = { data: [] };

    public width: number;

    constructor(
        public globals: Globals,
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        public footerService: FooterService,
        public menuService: MenuService,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.width = window.innerWidth;
        }

        this.getAddress();
        this.getMenuFooterAbout();
        this.getMenuFooterService();
        this.getMenuFooterContent();
        this.getMenuFooterInvestment();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (window['showCollapse'] && this.width <= 576) {
                window['showCollapse']('address' + this.address.show);
            }
        }, 300);
    }

    getAddress(): void {
        this.footerService.getAddress().subscribe((resp: any) => this.address._ini(resp.data));
    }

    getMenuFooterAbout(): void {
        this.menuService.getMenu({ position: 'about' }).subscribe((resp: any) => this.about.data = resp.data);
    }

    getMenuFooterService(): void {
        this.menuService.getMenu({ position: 'service' }).subscribe((resp: any) => this.service.data = resp.data);
    }

    getMenuFooterContent(): void {
        this.menuService.getMenu({ position: 'content' }).subscribe((resp: any) => this.content.data = resp.data);
    }

    getMenuFooterInvestment(): void {
        this.menuService.getMenu({ position: 'investment' }).subscribe((resp: any) => this.investment.data = resp.data);
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    public address = {
        show: -1,
        data: [],
        _ini: (data) => {
            if (data && data.length > 0) {
                this.address.data = data;
                this.address.show = data[0].id;
            }
        },
        _onShow: (id) => {
            this.address.show = this.address.show != id ? id : -1;
        }
    }

}