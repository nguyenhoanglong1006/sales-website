import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { Subject, throwError } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export class configOptions {
    path: string;
    data?: Object;
    params?: Object;
    token: string;
    auth?: Object;
}
@Injectable()


export class Globals {

    public BASE_API_URL = this._document.querySelector("meta[data-url-path]").getAttribute('data-url-path');

    public admin: string = 'admin';

    public company: any = {};

    private response = new Subject<string>();

    public result = this.response.asObservable();

    public headersReject = {};

    public configFroala = {

        fileUploadURL: this.BASE_API_URL + 'file_upload',
        imageUploadURL: this.BASE_API_URL + 'image_upload',
        videoUploadURL: this.BASE_API_URL + 'video_upload',
        // Set the image upload, delete URL.
        imageManagerLoadURL: this.BASE_API_URL + 'load_images',
        imageManagerDeleteURL: this.BASE_API_URL + 'delete_image',
        filesManagerUploadURL: this.BASE_API_URL + 'file_upload',

        iframe: true,
        fileMaxSize: 1024 * 1024 * 150,
        filesManagerMaxSize: 1024 * 1024 * 150,

        fontSize: ['8', '10', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '30', '34', '60', '96'],
        pasteAllowedStyleProps: ['font-family', 'font-size', 'text-align', 'vertical-align', 'text-decoration', 'font-weight'],
        wordAllowedStyleProps: ['font-family', 'font-size', 'text-align', 'vertical-align', 'text-decoration', 'background', 'color', 'font-weight'],

        events: {
            'file.error': function (error, response) {
                if (error.code == 3) {
                    alert(response);
                }
            },
            'filesManager.error': function (error, response) {
                if (error.code == 3) {
                    alert(response);
                }
            }
        }

    }

    constructor(
        private http: HttpClient,
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private _document: Document,
        public location: Location
    ) {
    }

    send = (option: configOptions) => {
        if (option.path && option.token && isPlatformBrowser(this.platformId)) {// kiểm tra token
            option.auth = this.USERS.get();
            let params = () => {
                let param = "?mask=" + option.token;
                let link = window.location.pathname.split('/')[1] || '';
                let language = link === this.admin ? +this.language.get(true) : +this.language.get(false);
                param += "&language_id=" + language
                if (option.params) {
                    let keys = Object.keys(option.params);
                    for (let i = 0; i < keys.length; i++) {
                        if (i == 0) { param += "&"; }
                        param += keys[i] + "=" + option.params[keys[i]];
                        param += (i + 1 == keys.length) ? "" : "&";
                    }
                }

                return param;
            }
            this.http.post<any>(this.BASE_API_URL + option.path + params(), { data: option.data, auth: option.auth })
                .subscribe((result: any) => {
                    this.response.next(result);
                }, (error) => {
                    throwError(error.message || error);
                });
        }
    }

    public time = {
        format: (e) => {
            e = typeof e === 'object' ? e : new Date();
            return e.getFullYear() + '-' + (e.getMonth() + 1).toString() + '-' + e.getDate();
        },
        date: (e) => {
            e = typeof e === 'object' ? e : new Date();
            return e.getFullYear() + '-' + (e.getMonth() + 1).toString() + '-' + e.getDate();
        }
    }


    public _params = {
        process: (params = {}) => {
            let _params = "";
            _params += "?language_id=" + this.language._language_id;
            if (params) {
                let keys = Object.keys(params);
                for (let i = 0; i < keys.length; i++) {
                    if (i == 0) { _params += "&"; }
                    _params += keys[i] + "=" + params[keys[i]];
                    _params += (i + 1 == keys.length) ? "" : "&";
                }
            }
            return _params;
        }
    }


    public USERS = {
        store: 'localStorage',
        get: () => {
            return (window.localStorage && window.localStorage.getItem(this.USERS.store)) ? JSON.parse(window.localStorage.getItem(this.USERS.store)) : {};
        },
        check: () => {
            if (isPlatformBrowser(this.platformId)) {
                let resp = window.localStorage.getItem(this.USERS.store) ? JSON.parse(window.localStorage.getItem(this.USERS.store)) : {};
                return (resp && Object.values(resp).length > 0) ? true : false;
            }
            return true;
        },
        set: (data) => {
            data = typeof data === 'object' ? JSON.stringify(data) : data;
            if (isPlatformBrowser(this.platformId)) {
                window.localStorage.setItem(this.USERS.store, data);
            }
        },
        remove: (skip: any = "") => {
            if (!skip) {
                window.localStorage.clear();
            } else {
                window.localStorage.removeItem(this.USERS.store);
            }
            this.router.navigate(['/login/']);
        }
    }
    public CUSTOMERS = {
        store: 'customerStorage',
        get: () => {
            return (window.localStorage.getItem(this.CUSTOMERS.store)) ? JSON.parse(window.localStorage.getItem(this.CUSTOMERS.store)) : {};
        },
        check: () => {
            return window.localStorage.getItem(this.CUSTOMERS.store) ? true : false;
        },
        set: (data) => {
            data = typeof data === 'object' ? JSON.stringify(data) : data;
            window.localStorage.setItem(this.CUSTOMERS.store, data);
        },
        remove: (skip: any = true) => {
            window.localStorage.removeItem(this.CUSTOMERS.store);
        },
    }

    public back = () => this.location.back();

    public language = {
        skip: true,
        token: 'language', // number
        tokenCode: 'languageCode', // string
        tokenAdmin: 'languageAdmin', // number
        store: 'localStoragelanguage', // object
        _language: '',
        numberLink: 0,
        lengthLink: 0,
        _language_id: 0,
        get: (skip) => {
            if (skip == true) {
                return (window.localStorage.getItem(this.language.tokenAdmin)) ?
                    window.localStorage.getItem(this.language.tokenAdmin) : 1;
            } else {
                return (window.localStorage.getItem(this.language.token)) ?
                    window.localStorage.getItem(this.language.token) : 1;
            }
        },
        getCode: () => {
            return (window.localStorage.getItem(this.language.tokenCode)) ?
                window.localStorage.getItem(this.language.tokenCode) : 'vn';
        },
        setCode: (item) => {
            item = typeof item === 'object' ? JSON.stringify(item) : item;
            window.localStorage.setItem(this.language.tokenCode, item);
            this.language._language = item;
            this.language.numberLink = (this.language._language == 'vn') ? 1 : 2;
            this.language.lengthLink = (this.language._language == 'vn') ? 2 : 3;
        },
        set: (item, skip) => {
            item = typeof item === 'object' ? JSON.stringify(item) : item;
            if (skip == true) {
                window.localStorage.setItem(this.language.tokenAdmin, item);
            } else {
                window.localStorage.setItem(this.language.token, item);
            }
        },
        setlanguageByLink: () => {
        },
        check: (skip) => {
            if (skip == true) {
                return (window.localStorage.getItem(this.language.tokenAdmin) ? true : false);
            } else {
                return (window.localStorage.getItem(this.language.token) ? true : false)
            }
        },
        getData: () => {
            return (window.localStorage.getItem(this.language.store)) ?
                JSON.parse(window.localStorage.getItem(this.language.store)) : [];
        },
        setData: (data) => {
            data = typeof data === 'object' ? JSON.stringify(data) : data;
            window.localStorage.setItem(this.language.store, data)
        },

        process: () => {
            let data = JSON.parse(window.localStorage.getItem(this.language.store));
            let link = window.location.pathname.split('/')[1] || '';
            let active: any = {};
            if (Object.keys(active).length == 0) {
                data.filter(item => { +item.defaults == 0 ? active = item : {}; return item });
            }
            data.filter(item => {
                if (item.status > 0) {
                    (link == 'en' ? (item.code == link) : ((+item.defaults == 0)) ? (active = item) : {});
                } else if (link == item.code && item.status == 0) {
                    this.router.navigate(['/'])
                }
                return item
            });

            this.language.set(active.id, false);
            this.language._language_id = active.id;
            this.language.setCode(active.code);
        }
    }

    public price = {
        format: (price) => {
            return typeof price == 'number' ? +price : +(price.toString().replace(/\./g, ''));
        },
        change: (price) => {
            let value = price.toString().replace(/\./g, '');
            let val = isNaN(value) ? 0 : +value;
            let res = isNaN(value) ? 0 : ((val < 0) ? 0 : value);
            return price = Number(res).toLocaleString('vi');
        }
    }

    public _file = {
        download: async (url = '') => {
            try {
                const res = await this.http.get(url, { responseType: 'blob' }).toPromise();
                this._file.process(res, url);
            } catch (e) {
                console.log(e);
            }
        },
        process: (data, _url) => {
            const url = data.type == 'application/octet-stream' ? _url : window.URL.createObjectURL(data);
            const e = document.createElement('a');
            url.url = decodeURIComponent(url.url);
            e.href = url;
            e.download = _url.split('/')[_url.split('/').length - 1];
            document.body.appendChild(e);
            e.click();
            document.body.removeChild(e);
        }
    }

    public _browser = {
        isPageBuilder: false
    }


    _html = {
        renderHtml: () => {
            let main = document.getElementById("page-detail");
            let mainBuilder = document.getElementById("contentBuider");
            main ? this._html.render(main) : '';
            mainBuilder ? this._html.render(mainBuilder) : '';
            var draggable_elements = document.querySelectorAll("[draggable=true]");
            for (var i = 0; i < draggable_elements.length; i++)
                draggable_elements[i].setAttribute("draggable", 'false');
            var editable_elements = document.querySelectorAll("[contenteditable=true]");
            for (var i = 0; i < editable_elements.length; i++)
                editable_elements[i].setAttribute("contenteditable", 'false');
        },

        render: (main) => {
            let el = main.querySelectorAll("table");
            if (el) {
                for (let i = 0; i < el.length; i++) {
                    let div = document.createElement("div");
                    div.className = "table-responsive table-bordered m-0 border-0";
                    el[i].parentNode.insertBefore(div, el[i]);
                    el[i].className = 'table';
                    el[i].setAttribute('class', 'table');
                    let newhtml = "<table class='table'>" + el[i].innerHTML + "</table>";
                    el[i].remove();
                    div.innerHTML = newhtml;
                }
            }
        },
        _detail: (data) => {
            return (data && data.length > 0) ? data.replace(/<link\b[^>]*>/i, "").replace(/<\/link>/i, "") : '';
        },
        _builder: (data) => {
            return (data && data.indexOf('<section') > -1) ? (data.substring(data.indexOf('<section'), data.lastIndexOf('</section>')) + '</section>') : data;
        }

    }
    utilities = {
        isFixedBody: (state: boolean) =>
            state ? (document.body.style.overflowY = 'hidden') : (document.body.style.overflowY = 'scroll'),
    };
}