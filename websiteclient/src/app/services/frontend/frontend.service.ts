import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class FrontendService {

    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }

    getLanguageSetting(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/language/getlanguagesetting' + this.globals._params.process(params)).pipe();
    }

    getLanguage(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/language/getlist' + this.globals._params.process(params)).pipe();
    }

}
