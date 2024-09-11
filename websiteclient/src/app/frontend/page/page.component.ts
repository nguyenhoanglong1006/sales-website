import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { Globals } from '~/globals';
import { PageService } from '~/services/page/page.service'
import { AppService } from '~/services/app.service';
import { SlideService } from '~/services/home/slide.service';
@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit, OnDestroy {

    navigationSubs;

    public parentLink: string = '';

    public link: string = '';

    public linkMain: string = '';

    public dataTags: any = {};

    public changeCol: boolean = false;

    public width: number;

    public isBrowser: boolean;

    public flags: boolean = true;

    constructor(
        public globals: Globals,
        public router: Router,
        public pageService: PageService,
        private appService: AppService,
        public slideService: SlideService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        // this.navigationSubs = this.router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {

        //         let link = window.location.pathname.split('/');
        //         //         // check case: if link is detail and click menu back main link
        //         if (link.length == this.globals.language.lengthLink && this.linkMain == link[this.globals.language.numberLink] && this.page.data && this.page.data) {
        //             if (this.router.url != '') {
        //                 let link = this.router.url.split('/');
        //                 if (link.length == this.globals.language.lengthLink) {
        //                     let data = this.page.data[0];
        //                     if (data.length == 0) {
        //                         this.router.navigate([this.globals.language._language == 'vn' ? data.href : ('en/' + data.href)]);
        //                     } else {
        //                         this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
        //                     }
        //                 }
        //             }
        //         }
        //         if (this.router.url != '' && (this.globals.language._language == 'vn' && this.router.url.split('/').length != 2) || (this.globals.language._language == 'en' && this.router.url.split('/').length != 3)) {
        //             this.appService.updateTags(this.router.url);
        //         }
        //     }
        // })
    }

    ngOnInit() {
        let link = this.router.url.split('/');
        this.getData()
        this.navigationSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.getData()
            }
        })
    }
    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    getData() {
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
        if (this.router.url != '') {
            this.appService.updateTags(this.router.url);
            let link = this.router.url.split('/');

            this.linkMain = link[this.globals.language.numberLink];
            // if (link[this.globals.language.numberLink] == 've-chung-toi' || link[this.globals.language.numberLink] == 'about-us') {
            //     if ((this.globals.language._language == 'vn' && this.router.url.split('/').length != 2) || (this.globals.language._language == 'en' && this.router.url.split('/').length != 3)) {
            //         this.page.get(link[this.globals.language.numberLink]);
            //     }
            // } else {
            this.page.get(link[link.length - 1]);
            // this.flags = !this.flags;
            this.flags = false
            // }
        }
    }

    public page = {
        nameGroup: '',
        data: <any>{},
        get: (link) => {

            if (link != '' && link != '/en') {
                this.pageService.getPageTags({ link: link }).subscribe((resp: any) => {
                    if (resp.status == 1) {
                        this.tags.data = resp.data;
                        this.tags.list = resp.data.list;
                        this.tags.lengthList = resp.data.count.count_list;
                        this.tags._getBanner();
                        this.tags._getPostViewMore(this.tags.data.id);

                    } else {

                        this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                            if (resp.status == 1) {
                                this.page.data = resp.data;

                                this.page.data.detail = this.globals._html._detail(this.page.data.detail);
                                this.page.data.builder = this.globals._html._builder(this.page.data.builder);
                                setTimeout(() => {
                                    this.globals._html.renderHtml();
                                }, 200);
                                if (this.router.url != '') {

                                    let link = this.router.url.split('/');
                                    if (link.length == this.globals.language.lengthLink && resp.data.data && resp.data.data.length > 0) {
                                        let data = resp.data.data[0];
                                        if (data.length == 0) {
                                            this.router.navigate([this.globals.language._language == 'vn' ? data.href : ('en/' + data.href)]);
                                        } else {
                                            this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
                                        }
                                    }
                                }
                            } else {
                                this.router.navigate(['/' + (this.globals.language._language == 'vn' ? '' : this.globals.language._language) + '/404']);
                            }
                        });
                    }
                })
            }
        },
    }

    public tags = {
        show: -1,
        lengthList: 0,
        finish: false,
        data: <any>{},
        list: [],
        banner: <any>{},
        postViewMore: [],

        _viewMore: (length) => {
            this.pageService.getPageTags({ link: this.router.url.split('/')[this.globals.language.numberLink], start: length }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.tags.list = this.tags.list.concat(resp.data.list);
                    this.tags.finish = this.tags.lengthList != this.tags.list.length ? false : true;
                }
            })
        },

        _getBanner: () => {
            this.slideService.getSlide({ type: 2 }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.tags.banner = resp.data[0];
                }
            })
        },

        _getPostViewMore: (tags_id) => {
            this.pageService.getPostViewMore({ tags_id: tags_id }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.tags.postViewMore = resp.data;
                }
            })
        }
    }
}

