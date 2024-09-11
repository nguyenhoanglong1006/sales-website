import { CustomerService } from '../../services/customer/customer.service';
import { Router } from '@angular/router';
import { Globals } from '../../globals';
import { LoginService } from '../../services/auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { FrontendService } from '~/services/frontend/frontend.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ForgetCustomerComponent } from '../forget/forget.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {

  public fm: FormGroup;

  public flag: boolean = true;

  public type = "password";

	public modalRef: BsModalRef;

  constructor(
    public fb: FormBuilder,

    private customerService: CustomerService,

    public toastr: ToastrService,

    private globals: Globals,
    
    public router: Router,

		public modalService: BsModalService,
    ) { }

  ngOnInit() {this.fmConfigs()
  }
  fmConfigs(data: any = "") {
    data = typeof data === 'object' ? data : { status: 1, sex: 1, birth_date: new Date() };
    this.fm = this.fb.group({
        email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
        password: [data.password ? data.password : '', [Validators.required, Validators.minLength(8)]],
    })
}

onSubmit() {
  if (this.flag) {
      this.flag = false;
      let data = this.fm.value;
      this.customerService.checkLoginCustomer(data).subscribe((resp: any) => {
        this.flag = !this.flag;
        let type = (+resp.status == 1) ? "success" : (+resp.status == 0 ? "warning" : "danger");
        this.toastr[type](resp.message, type);
        if (+resp.status === 1) {
            setTimeout(() => {
                this.globals.CUSTOMERS.set(resp.data);
                location.href = ""
            }, 500);
        }
      }
      );
  }
}
forget = () => {
  this.modalRef = this.modalService.show(ForgetCustomerComponent, {
    class: 'gray modal-md',
  });

  // this.modalRef.content.onClose.subscribe(result => {
  //   if (result == true) {
  //     setTimeout(() => {
  //       this.fmConfigs(this.globals.CUSTOMERS.get());

  //       let status = this.order.dataCart();
  //       this.step = status == false ? 2 : 3;

  //       this.payment.skip = true;
  //     }, 200);
  //   }
  // });
};
}
