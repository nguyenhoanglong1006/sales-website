import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service';

interface BannerResponse {
    link: string;
    name: string;
    title: string;
    images: string;
}

@Component({
    selector: 'app-box-asidebar-left',
    templateUrl: './box-asidebar-left.component.html',
    styleUrls: ['./box-asidebar-left.component.css']
})
export class BoxAsidebarLeftComponent implements OnInit {

    @Input('data') data: any = [];

    @Input('linkPage') linkPage: string;

    public menu = [];

    public menu1: string = '';

    public menu2: string = '';

    public menu3: string = '';

    public listChange = [];

    public itemSelected: string = '';

    public flagOpenMenu: boolean = false;

    public showIcon = true;

    public width: number;

    public isBrowser: boolean;

    public changeActive = 0;

    constructor(
        public route: ActivatedRoute,
        public globals: Globals,
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        private pageService: PageService,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url != '') {
                    this.configMenu._activeMenu(this.router.url);
                }
            }
        });
    }

    ngOnInit() {
        // this.banner.get(this.linkPage);

        switch (this.linkPage) {
            // case 'ho-tro/huong-dan':
            // case 'support/guide':
            //     this.changeActive = 1;
            //     break;
            // case 'ho-tro/vci-edu':
            // case 'support/vci-edu':
            //     this.changeActive = 1;
            //     this.showIcon = false;
            //     break;
            case 've-chung-toi':
            case 'about-us':
                this.changeActive = 2;
                break;
            default:
                break;

        }
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
        this.menu = this.data;
        if (this.router.url != '') {
            this.configMenu._activeMenu(this.router.url);
            this.configMenu._expandedMenu();
        }
    }

    changeIcon(item) {
        if (document.getElementById('s' + item.link + '-' + item.level)) {
            item.expanded = (document.getElementById('s' + item.link + '-' + item.level).classList.value == 'collapse') ? true : (document.getElementById('s' + item.link + '-' + item.level).classList.value == 'collapsing') ? item.expanded : false;
        }
    }

    public configMenu = {
        _expandedMenu: () => {
            let extraMenu = (data) => {
                for (let i = 0; i < data.length; i++) {
                    data[i].expanded = (this.menu1 == data[i].link || this.menu2 == data[i].link || this.menu3 == data[i].link) ? true : (!data[i].expanded ? false : true);
                    if (data[i].expanded) {
                        this.itemSelected = data[i].name;
                    }
                    extraMenu(data[i].data || []);
                }
            }

            for (let i = 0; i < this.menu.length; i++) {
                this.menu[i].expanded = (this.menu1 == this.menu[i].link || this.menu2 == this.menu[i].link || this.menu3 == this.menu[i].link) ? true : (!this.menu[i].expanded ? false : true);
                if (this.menu[i].expanded && this.menu1 == this.menu[i].link) {
                    this.itemSelected = this.menu[i].name;
                    extraMenu(this.menu[i].data || []);
                }

            }
        },
        _activeMenu: (href) => {
            this.listChange = [];
            let link = (href.substr(((this.globals.language._language == 'vn' ? '' : ('/' + this.globals.language._language)) + '/' + this.linkPage + '/').length, href.length)).split('/');

            this.menu1 = link[0] || '';
            this.menu2 = link[1] || '';
            this.menu3 = link[2] || '';
            this.listChange = ['s' + this.menu1 + '-' + 1, 's' + this.menu2 + '-' + 2, 's' + this.menu3 + '-' + 3];
            this.showCollapse();
        },
        routerLink: (item) => {
            this.configMenu._activeMenu(item.href);
            if (!item.data || item.data.length == 0) {
                this.router.navigate([this.globals.language._language == 'vn' ? item.href : ('/' + this.globals.language._language + item.href)]);
                this.itemSelected = item.name;
                this.flagOpenMenu = false;
            }
        }
    }

    showCollapse() {
        for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].data.length > 0 && this.menu[i].static) {
                this.listChange.push('s' + this.menu[i].link + '-1');
                this.menu[i].expanded = true
            }
        }
        setTimeout(() => {
            if (window['showCollapse']) {
                for (let i = 0; i < this.listChange.length; i++) {
                    window['showCollapse'](this.listChange[i]);
                }
            }
        }, 300);
    }

    // banner = {
    //     data: <BannerResponse>{},
    //     get: (link) => {
    //         if (!link) return;

    //         this.pageService.getBannerLink({ link }).subscribe((resp: any) => {
    //             if (resp.status == 1) {
    //                 this.banner.data = resp.data;
    //             }
    //         });
    //     },
    // };
}

