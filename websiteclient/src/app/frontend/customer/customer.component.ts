import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Globals } from '~/globals';
import { ToastrService } from 'ngx-toastr';
import { FrontendService } from '~/services/frontend/frontend.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {

  public fm: FormGroup;

  public flag: boolean = true;

  public type = "password";

  public user: any = {}
  
  constructor(
    public fb: FormBuilder,

    public toastr: ToastrService,

    public globals: Globals,
    
    public translate: TranslateService,
    
    public router: Router,
    ) { }

  ngOnInit() {this.fmConfigs()
    this.user = this.globals.CUSTOMERS.get();
  }
  fmConfigs(data: any = "") {
    data = typeof data === 'object' ? data : { status: 1, sex: 1, birth_date: new Date() };
    this.fm = this.fb.group({
        email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
        password: [data.password ? data.password : '', [Validators.required, Validators.minLength(8)]],
    })
}

}
