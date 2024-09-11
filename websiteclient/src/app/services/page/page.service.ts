import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class PageService {

    constructor(
        private http: HttpClient,
        public globals: Globals
    ) { }

    getPagesLink(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getpage' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getListPageByLink(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getlistpage' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getDetailPageByLink(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getdetailpage' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getIndustry(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getindustry' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getCompany(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getcompany' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    search(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getvaluefilter' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getPageTags(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getpagetags' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getPostViewMore(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getpostviewmore' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    checkPageLink(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/checkpagelink' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getBannerLink(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/page/getbannerbylink' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }
}
