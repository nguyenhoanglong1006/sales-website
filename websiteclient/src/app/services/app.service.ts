import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

import { Globals } from '../globals';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(
        private http: HttpClient,
        private title: Title,
        private meta: Meta,
        public globals: Globals,
        public translate: TranslateService,
        @Inject(DOCUMENT) private _document: Document
    ) { }

    getMenu(): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getcompany', this.globals.headersReject).pipe();
    }

    getSeoByLink(link = ''): Observable<any> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/seo/get' + this.globals._params.process({ link: link }), this.globals.headersReject).pipe();
    }

    updateTags(link = '') {
        this.getSeoByLink(link).subscribe((resp: any) => {
            let data = resp.data;
            this._document.documentElement.lang = data.language;
            this.title.setTitle(data.title);
            this.meta.addTag({ itemprop: 'name', content: data.name });
            this.meta.addTag({ itemprop: 'description', content: data.description });
            this.meta.addTag({ itemprop: 'image', content: (data.og_image && data.og_image != '') ? data.og_image : data.logo });
            this.meta.addTag({ 'http-Equiv': 'content-language', 'content': data.language })
            this.meta.updateTag({ name: 'description', content: data.description });
            this.meta.updateTag({ property: 'og:url', content: data.og_url });
            this.meta.updateTag({ property: 'og:title', content: data.title });
            this.meta.updateTag({ property: 'og:description', content: data.description });
            this.meta.updateTag({ property: 'og:image', content: (data.og_image && data.og_image != '') ? data.og_image : data.logo });
            this.meta.updateTag({ property: 'og:image:alt', content: data.name });
            this.meta.updateTag({ property: 'og:full_image', content: (data.full_image && data.full_image != '') ? data.full_image : data.logo });
            this.meta.updateTag({ property: 'og:locale', content: data.locale });
            this.meta.updateTag({ property: 'og:type', content: (link == '/' || link == '/en') ? 'website' : 'article' });
            this.meta.updateTag({ name: 'twitter:title', content: data.title });
            this.meta.updateTag({ name: 'twitter:site', content: data.og_url });
            this.meta.updateTag({ name: 'twitter:description', content: data.description });
            this.meta.updateTag({ name: 'twitter:image', content: (data.og_image && data.og_image != '') ? data.og_image : data.logo });
            this.meta.updateTag({ name: 'twitter:image:src', content: (data.og_image && data.og_image != '') ? data.og_image : data.logo });
            this.meta.removeTag("property='article:tag'");
            this.meta.removeTag("http-equiv='content-language'");
            if (data.tags && data.tags.length > 0) {
                for (let i = 0; i < data.tags.length; i++) {
                    this.meta.addTag({ property: 'article:tag', content: data.tags[i].name });
                }
            }

            let image_src = this._document.querySelector("link[rel=image_src]");
            let apple_touch_icon = this._document.querySelector("link[rel=apple-touch-icon]");
            let hreflang = this._document.querySelector("link[rel=alternate]");
            let canonical = this._document.querySelector("link[rel=canonical]");
            if (image_src) {
                image_src.setAttribute('href', (data.og_image && data.og_image != '') ? data.og_image : data.logo);
            }
            if (apple_touch_icon) {
                apple_touch_icon.setAttribute('href', (data.shortcut && data.shortcut != '') ? data.shortcut : data.logo);
            }
            if (canonical) {
                canonical.setAttribute('href', (data.og_url && data.og_url != '') ? data.og_url : '');
            }
            if (data.hreflang && data.hreflang.length > 0) {
                hreflang.setAttribute('href', data.hreflang);
                hreflang.setAttribute('hreflang', this.globals.language._language_id == 1 ? "en-us" : "vi-vn");
            }

            let amp_2nmart = this._document.head.querySelector('.amp-2nmart')

            let websiteSchema = [
                {
                    "@context": "http://schema.org",
                    "@type": "LocalBusiness",
                    "name": this.translate.instant('FECompanyName'),
                    "telephone": this.translate.instant('FEPhone'),
                    "url": window.location.origin,
                    "email": this.translate.instant('FEMail'),
                    "priceRange": "0",
                    "address": this.translate.instant('FEAddress'),
                    "image": [
                        data.logo,
                    ],

                },
                {
                    "@context": "http://schema.org",
                    "@type": "NewsArticle",
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": data.og_url || this._document.querySelector("meta[data-url-path]").getAttribute('data-url-path'),
                    },
                    "headline": data.name || 'Công Ty Cổ Phần Chứng Khoán Quốc Gia - NSI',

                    "image": {
                        "@type": "ImageObject",
                        "url": data.og_image || data.logo,
                        "width": 255,
                        "height": 166
                    },

                    "description": data.description,
                    datePublished: data.datePublished || new Date(),
                    dateModified: data.dateModified || new Date()
                }]

            amp_2nmart.firstChild.nodeValue = JSON.stringify(websiteSchema);
        })

    }

    getListLang(): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/language/getlist', this.globals.headersReject).pipe();
    }


    setScript() {
        let url = window.location.pathname;
        let scriptExit = this._document.body.querySelector('.script')
        if (url.split('/')[1] != 'admin' && url != '/' && url != '/en' && !scriptExit) {
            let script = document.createElement('script');
            script.src = "./assets/fancybox/jquery.fancybox.min.js";
            script.type = "text/javascript";
            script.className = "script";
            document.body.appendChild(script);

            let link = document.createElement('link');
            link.href = "./assets/fancybox/jquery.fancybox.min.css";
            link.rel = "stylesheet";
            link.type = "text/css";
            document.head.appendChild(link);
        }

    }
}



