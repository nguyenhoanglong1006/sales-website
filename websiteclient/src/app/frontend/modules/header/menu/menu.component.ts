import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { Globals } from '~/globals';
import { MenuService } from '~/services/modules/menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public link;

    public menu: any = [];

    public width: number;

    public active: string = '';

    constructor(
        public globals: Globals,
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        public menuService: MenuService,
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.active = event.url.split('/')[1];
            }
        })
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.width = window.innerWidth;
        }
        if (this.width > 767) {
            this.getMenu();
        }
    }

    getMenu(): void {
        this.menuService.getMenu({ position: 'menuMain' }).subscribe((resp: any) => {
            if (resp.status == 1) {
                let data = this.compaid(resp.data);
                this.menu = data;
            }
        })
    }

    compaid(data) {

        let list = [];

        data = data.filter(function (item) {


            let v = isNaN(+item.page_id) ? 0 : +item.page_id;

            v == 0 ? '' : list.push(item);

            return v == 0 ? true : false;
        });


        let compaidmenu = (data, skip, level = 0) => {

            level = level + 1;

            if (skip == true) {

                return data;

            } else {

                for (let i = 0; i < data.length; i++) {
                    let obj = [];

                    list = list.filter(item => {

                        let skip = (+item.page_id == +data[i]['id']) ? false : true;
                        if (data[i].page_id > 0 && +item.page_id == +data[i]['id']) {
                            data[i].static = true;
                        }

                        if (skip == false) { obj.push(item); }

                        return skip;

                    })

                    let skip = (obj.length == 0) ? true : false;

                    data[i]['level'] = level;

                    data[i]['data'] = compaidmenu(obj, skip, level);

                }

                return data;
            }

        };

        return compaidmenu(data, false);
    }



}
