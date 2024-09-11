import { CustomerService } from '../../services/customer/customer.service';
import { LoginService } from '../../services/auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {

  public fm: FormGroup;

  public flag: boolean = true;

  public type = "password";

  constructor(
    public fb: FormBuilder,

    private customerService: CustomerService,

    public toastr: ToastrService,
    ) { }

  ngOnInit() {this.fmConfigs()
  }
  fmConfigs(data: any = "") {
    data = typeof data === 'object' ? data : { status: 1, sex: 1, birth_date: new Date() };
    this.fm = this.fb.group({
        name: [data.name ? data.name : '', [Validators.required, Validators.minLength(5)]],
        code: [data.code ? data.code : ''],
        phone: [data.phone ? data.phone : '', [Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/)]],
        email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
        address: data.address ? data.address : '',
        password: [data.password ? data.password : '', [Validators.required, Validators.minLength(8)]],
        sex: data.sex ? +data.sex : '',
        note: data.note ? data.note : '',
    })
    if (data.code) {
        this.fm.controls['code'].disable();
    }
}

onSubmit() {
  if (this.flag) {
      this.flag = false;
      let data = this.fm.value;
      this.customerService.addCustomer(data).subscribe((resp: any) => {
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
