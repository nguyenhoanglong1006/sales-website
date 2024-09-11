import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, public globals: Globals) { }

  getDetail(params = {}): Observable<{}> {
      return this.http.get<{}>(this.globals.BASE_API_URL + 'api/product/getdetail' + this.globals._params.process(params), this.globals.headersReject).pipe();
  }
}
