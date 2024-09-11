import { CustomerService } from './../../../services/customer/customer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '~/globals';
import { uploadFileService } from '~/services/integrated/upload.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {
    private connect;

    public fm: FormGroup;
    public id: number = 0;
    public type = "password";
    public avatar = new uploadFileService();
    public flags: boolean = true;
    public user: any = {}

    constructor(
        public globals: Globals,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private routerAct: ActivatedRoute,
        private customerService: CustomerService,
    ) {}

    ngOnInit() {
      this.user = this.globals.CUSTOMERS.get();
      this.fmConfigs()
      this.customer.get()
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    public customer = {
      data: <any>{},
      get: (): void => {
        let email = this.user.email
          this.customerService.getInfo({ data: email }).subscribe((resp: any) => {
              if (resp.status == 1) {
                  this.customer.data = resp.data
                  this.fmConfigs(resp.data)
              }
          });
      },
    };

    fmConfigs(data: any = "") {
        data = typeof data === 'object' ? data : { sex: 1};
        const imagesConfig = { path: this.globals.BASE_API_URL + ((data.images && !data.images.includes('uploads/avatar/')) ? 'uploads/avatar/' : ''), data: data.avatar ? data.avatar : '' };
        this.avatar._ini(imagesConfig);
        this.fm = this.fb.group({
            id: [data.id ? data.id: '', [Validators.required]],
            name: [data.name ? data.name : '', [Validators.required, Validators.minLength(5)]],
            sex: data.sex ? +data.sex : 1,
            phone: [data.phone ? data.phone : '', [Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/)]],
            email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
            address: data.address ? data.address : '',
            note: data.note ? data.note : '',
        })
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false;
            let data = this.fm.value;
            data.avatar = this.avatar._get(true);
            data.avatar.path = 'uploads/avatar/';
            data.status = data.status == true ? 1 : 0;
            this.customerService.processInfo(data).subscribe((resp: any) => {
                this.flags = true;
                let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                this.toastr[type](resp.message, type, { closeButton: true });
                if (resp.status == 1) {
                    if (window['openModal']) {
                        window['openModal']('submitSuccessModal')
                    }
                }
            });
        }
    }
}
