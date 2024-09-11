import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import {
//   AuthService,
//   FacebookLoginProvider,
//   GoogleLoginProvider,
// } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Globals } from '../../../globals';

@Component({
    selector: 'app-fm',
    templateUrl: './fm.component.html',
    styleUrls: ['./fm.component.scss'],
    // providers: [AuthService],
})
export class FormMDComponent implements OnInit, OnDestroy {
    @Input('type') typeInput: number = 0;
    @Input('component') component: string = '';
    @Output('event') eventOutput = new EventEmitter();
    private connect: Subscription;
    public fm: FormGroup;
    public fmresetPassword: FormGroup;
    public fmRegistration: FormGroup;
    public type: number = 1; // type == 1 login; 2 reset_password; 3: singin
    public flag: boolean = true;
    public checkcart: boolean = false;

    constructor(
        public fb: FormBuilder,
        private toastr: ToastrService,
        public router: Router,
        public routerAct: ActivatedRoute,
        public globals: Globals,
        public translate: TranslateService,
        // public authService: AuthService
    ) {
        this.routerAct.queryParams.subscribe(
            (params) => (this.checkcart = Boolean(params.checkcart))
        );

        this.connect = this.globals.result.subscribe((response: any) => {
            switch (response.token) {
                // case 'resetpassword':
                //     this.resetpassword.loading = false;
                case 'registrationCustommer':
                case 'loginCustommer':
                case 'loginfacegoogle':
                    this.flag = true;
                    let type =
                        response.status == 1
                            ? 'success'
                            : response.status == 0
                                ? 'warning'
                                : 'danger';
                    this.toastr[type](response.message, type, { timeOut: 1000 });
                    if (response.status == 1) {
                        this.globals.CUSTOMERS.set(response.data);

                        if (this.component == 'modal') {
                            this.eventOutput.emit(true);
                        } else {
                            this.checkcart == true
                                ? this.router.navigate(['/gio-hang'])
                                : this.globals.back();
                        }
                    }
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        if (this.globals.CUSTOMERS.check()) {
            this.globals.CUSTOMERS.remove(true);
            this.router.navigate(['/']);
        }
        this.login.fmConfigs();
        this.resetpassword.fmConfigs();
        this.registration.fmConfigs();
        this.type = +this.typeInput > 0 ? +this.typeInput : this.type;
    }
    ngOnDestroy() {
        if (this.connect) {
            this.connect.unsubscribe();
        }
    }

    onChange = (type) => (this.type = +type);

    public login = {
        token: 'api/customer/login',
        type: 'password',
        fmConfigs: (item: any = '') => {
            item = typeof item === 'object' ? item : {};
            this.fm = this.fb.group({
                email: [
                    item.email ? item.email : '',
                    [
                        Validators.required,
                        Validators.pattern(
                            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                        ),
                    ],
                ],
                password: [item.password ? item.password : '', [Validators.required]],
            });
        },
        onSubmit: () => {
            let data: any = this.fm.value;
            if (this.flag == true && this.fm.valid) {
                this.flag = false;
                this.globals.send({
                    path: this.login.token,
                    token: 'loginCustommer',
                    data: data,
                });
            }
        },
    };

    public resetpassword = {
        loading: false,
        token: 'api/customer/changepass',
        fmConfigs: (item: any = '') => {
            item = typeof item === 'object' ? item : {};
            this.fmresetPassword = this.fb.group({
                email: ['', [
                    Validators.required,
                    Validators.pattern(
                        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                    )],
                ],
            });
        },
        onSubmit: () => {
            let data = this.fmresetPassword.value;
            if (this.flag == true && this.fmresetPassword.valid) {
                this.flag = false;
                this.resetpassword.loading = true;
                this.globals.send({
                    path: this.resetpassword.token,
                    token: 'resetpassword',
                    data: data,
                });
            }
        },
    };

    public registration = {
        token: 'api/customer/addcustomer',
        type: {
            password: false,
            passwordConfirm: false,
        },
        fmConfigs: (item: any = '') => {
            item = typeof item === 'object' ? item : {};
            this.fmRegistration = this.fb.group({
                name: ['', [Validators.required]],
                code: [item.code ? item.code : ''],
                address: ['', [Validators.required]],
                email: [
                    item.email ? item.email : '',
                    [
                        Validators.required,
                        Validators.pattern(
                            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                        ),
                    ],
                ],

                password: [
                    item.password ? item.password : '12345678',
                    [Validators.required, Validators.minLength(8)],
                ],

            });
        },
        onSubmit: () => {
            let data: any = this.fmRegistration.value;
            if (this.flag == true && this.fmRegistration.valid) {
                this.flag = false;
                this.globals.send({
                    path: this.registration.token,
                    token: 'registrationCustommer',
                    data: data,
                });
            }
        },
    };

    // loginFB = {
    //   data: <any>{},
    //   token: 'api/customer/loginfacegoogle',
    //   _socialSignIn: (socialPlatform: string) => {
    //     let socialPlatformProvider;

    //     if (socialPlatform == 'facebook') {
    //       socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    //     } else if (socialPlatform == 'google') {
    //       socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    //     }

    //     this.authService.signIn(socialPlatformProvider).then((response: any) => {
    //       if (response != null) {
    //         this.loginFB.data.name = response.name;
    //         this.loginFB.data.password = response.id;
    //         this.loginFB.data.email = response.email || '';
    //         this.loginFB.data.type_user = socialPlatform;
    //         this.loginFB.data.id_type_social = response.id;
    //         this.loginFB.data.status = 1;
    //       }
    //       this.globals.send({
    //         path: this.loginFB.token,
    //         token: 'loginfacegoogle',
    //         data: this.loginFB.data,
    //       });
    //     });
    //   },
    // };
}
