import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class EventCalendarService {

    constructor(private http: HttpClient, private globals: Globals) { }

    getEventType(): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/eventcalendar/geteventtype' + this.globals._params.process(), this.globals.headersReject).pipe();
    }

    getData(params): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/eventcalendar/getdata' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }


}
