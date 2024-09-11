import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Globals } from '~/globals';
import { MenuService } from '~/services/modules/menu.service';

@Component({
    selector: 'app-menu-mobile',
    templateUrl: './menu-mobile.component.html',
    styleUrls: ['./menu-mobile.component.css']
})
export class MenuMobileComponent implements OnInit {

    @Output('menumobile') menumobile = new EventEmitter<number>()

    public connect: Subscription

    public show: number
    public url: string = ''
    public data: any
    public menu: any

    public token: any = {
        menu: 'api/getmenu'
    }

    constructor(
        public globals: Globals, 
        public router: Router,
        public menuService: MenuService,) {
        
    }

    ngOnInit() {
        this.getMenu()
    }

    getMenu(): void {
        this.menuService.getMenu({ position: 'menuMain' }).subscribe((resp: any) => {
            let data = this.compaid(resp.data);
            this.menu = data;
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
    showMenuChild(skip: any, item: { data: string | any[]; id: string; level: number; href: string }) {
        if (item.data && item.data.length > 0) {
            let elm = document.getElementById('dropdown-menu-child-' + item.id)

            skip ? elm.classList.add('active-menu-child') : elm.classList.remove('active-menu-child')
        } else {
            let elm2 = document.getElementById('menu-mobi')

            elm2.classList.add('menu-mobi-hidden')

            elm2.classList.remove('menu-mobi-block')

            this.menumobile.emit()

            if (skip) {
                let elm = document.getElementsByClassName('menu-child')
                elm[0].classList.remove('active-menu-child')
            }
            this.router.navigate([item.level == 3 ? item.href : '/' + item.href])
        }
    }

    ngOnDestroy() {
    }
}
