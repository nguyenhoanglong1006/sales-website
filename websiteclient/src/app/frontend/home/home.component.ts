import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Globals } from '~/globals';
import { VIEWPORT } from '~/frontend/typings';
import { HomeService } from '~/services/home/home.service';
import { AppService } from '~/services/app.service';
import { MenuService } from '~/services/modules/menu.service';
import { SlideService } from '~/services/home/slide.service';
import { ToslugService } from '~/services/integrated/toslug.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [ToslugService]
})
export class HomeComponent implements OnInit, OnDestroy {
    public width: number;
    VIEWPORT_MOBILE = VIEWPORT.MOBILE;
    VIEWPORT_DESKTOP = VIEWPORT.DESKTOP;
    @Inject(DOCUMENT) private document: Document;
    public slider = [];
    public isBrowser: boolean;
    public fm: FormGroup;
    public type: {};
    constructor(
        public formBuilder: FormBuilder,
        public homeService: HomeService,
        public menuService: MenuService,
        public slideService: SlideService,
        public toSlug: ToslugService,
        public globals: Globals,
        public route: ActivatedRoute,
        public router: Router,
        private appService: AppService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        if (this.router.url != '') {
            this.appService.updateTags(this.router.url);
        }
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.getSlide()
            this.product.get();
            this.category.get();
            this.news.get();
            this.banner.get();
            this.banner.get();
            this.aboutUs.get()
        }
    }

    ngOnDestroy() {
    }

    public category = {
        data: <any>[],
        get: (): void => {
            this.homeService.getCategories().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.category.data = this.compaid(resp.data);
                }
            });
        },
    };

    public banner = {
        data: <any>[],
        get: (): void => {
            this.homeService.getBanner().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.banner.data = resp.data;
                }
            });
        },
    };

    public product = {
        featured: <any>[],
        hot: <any>[],
        get: (): void => {
            this.homeService.getProduct().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.product.featured = resp.data.featured;
                    this.product.hot = resp.data.hot;
                }
            });
        },
    };

    public news = {
        data: <any>[],
        get: (): void => {
            this.homeService.getNews().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.news.data = resp.data;
                }
            });
        },
    };

    public aboutUs = {
        data: <any>[],
        get: (): void => {
            this.homeService.getAboutus().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.aboutUs.data = resp.data;
                }
            });
        },
    };

    getSlide(): void {
        this.slideService.getSlide({ type: 1 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.slider = resp.data;
            }
        });
    }

    compaid(data) {

        let list = [];

        for (let i = 0; i < data.length; i++) {

            data = data.filter(function (item) {
                let v = (+item.page_id == +data[i]['id']) ? +item.page_id : 0;

                v == 0 ? '' : list.push(item);

                return v == 0 ? true : false;
            })
        };

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


    public search = {
        token: '',

        value: '',

        onSearch: () => {

            this.search.value = this.toSlug._ini(this.search.value.replace(/\s+/g, ' ').trim());

            if (this.search.check_search(this.search.value)) {
                this.router.navigate([
                    '/' +
                    (this.globals.language._language == 'vn' ? '/tim-kiem/' : 'en/search/') +
                    this.search.value,
                ]);
            }

            this.search.value = '';
        },

        check_search: (value) => {
            let skip = true;
            skip =
                value.toString().length > 0 &&
                    value != '' &&
                    value != '-' &&
                    value != '[' &&
                    value != ']' &&
                    value != '\\' &&
                    value != '{' &&
                    value != '}'
                    ? true
                    : false;
            return skip;
        },
    };
}
