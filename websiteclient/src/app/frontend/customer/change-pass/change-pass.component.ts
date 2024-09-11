import { CustomerService } from './../../../services/customer/customer.service';
import { Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoginService } from '../../../services/auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { FrontendService } from '~/services/frontend/frontend.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css'],
})
export class ChangePassComponent implements OnInit {

  public fm: FormGroup;

  public flag: boolean = true;

  public type = "password";

  public type1 = "password";

  public user: any = {}

  constructor(
    public fb: FormBuilder,

    public toastr: ToastrService,

    private customerService: CustomerService,

    private globals: Globals,
    
    public router: Router,
    ) { }

  ngOnInit() {this.fmConfigs()
    this.user = this.globals.CUSTOMERS.get();
  }
  fmConfigs(data: any = "") {
    data = typeof data === 'object' ? data : { status: 1, sex: 1, birth_date: new Date() };
    this.fm = this.fb.group({
        old_pass: [data.old_pass ? data.old_pass : '', [Validators.required, Validators.minLength(8)]],
        pass: [data.pass ? data.pass : '', [Validators.required, Validators.minLength(8), Validators.pattern(/[$&+,:;=?@#|'<>.^*()%!-]/)]],
    })
}

onSubmit() {
  if (this.flag) {
      this.flag = false;
      let data = this.fm.value;
      data['id'] = this.user.id
      
      this.customerService.changePass(data).subscribe((resp: any) => {
        this.flag = true;
        let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
        this.toastr[type](resp.message, type, { closeButton: true });
        if (resp.status == 1) {
            if (window['openModal']) {
                window['openModal']('submitSuccessModal')
            }
            this.fmConfigs()
        }
    });
  }
}
}
