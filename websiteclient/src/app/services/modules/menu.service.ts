import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(private http: HttpClient, private globals: Globals) { }

    getMenu(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/menu/get' + this.globals._params.process(params)).pipe();
    }

}
