import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class LeadershipTeamService {

    constructor(
        private http: HttpClient,
        public globals: Globals
    ) { }

    getListGroup(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/leadershipteam/getlistgroup' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getListLeadershipTeam(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/leadershipteam/getlist' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }


}
