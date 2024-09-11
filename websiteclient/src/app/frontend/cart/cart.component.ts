import { CustomerService } from './../../services/customer/customer.service';
import { FooterService } from '~/services/modules/footer.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '~/globals';
import { CartService } from '~/services/apicart/cart.service';
import { ModalSinginSingupComponent } from './modal-singin-singup/modal-singin-singup.component';
import { ToslugService } from '~/services/integrated/toslug.service';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss'],
	providers: [CartService, ToslugService],
})
export class CartComponent implements OnInit, OnDestroy {
	@Output('event') eventOutput = new EventEmitter();

	private connect;

	public token: any = {
		addcart: 'api/customer/addorder',
		mailsale: 'settings/contactsale/mailsale',
		getListProvince: 'api/getListProvince',
		getListDistrict: 'api/getListDistrict',
		getListWard: 'api/getListWard',
	};

	fm: FormGroup;
	public modalRef: BsModalRef;

	public flags = true;
	public step: number = 1;
	public datacart = [];
	public cartComplete: any = { skip: false, code: '' };

	public user;

	public alert = { skip: false, message: '' };

	public width: number = window.innerWidth;

	constructor(
		public cart: CartService,
		public fb: FormBuilder,
		public router: Router,
		public routerAct: ActivatedRoute,
		public globals: Globals,
		private toastr: ToastrService,
		public modalService: BsModalService,
		public customerService: CustomerService
	) {
		this.connect = this.globals.result.subscribe((res: any) => {
			switch (res['token']) {
				case 'addcart':
					let type = res['status'] == 1 ? 'success' : res['status'] == 0 ? 'warning' : 'danger';
					this.toastr[type](res.message, type, { timeOut: 1500 });

					this.order.loading = false;

					if (res.status == 1) {
						this.cart.clear();

						this.eventOutput.emit(true);

						// Object.keys(res.data.customer).length > 0 ? this.globals.CUSTOMERS.set(res.data.customer) : '';
						
						this.cartComplete.code = res.data;
						this.cartComplete.skip = true;
					}
					break;

				case 'paymentCart':
					this.payment.data = res.data;
					break;

				default:
					break;
			}
		});
	}

	ngOnInit() {

		this.order.getlist();

		this.user = this.globals.CUSTOMERS.get();
		
		this.customer.get();

		this.globals.send({ path: this.token.paymentCart, token: 'paymentCart' });


	}

	fmConfigs(item: any = '') {

		item = typeof item === 'object' ? item : {};

		this.fm = this.fb.group({
			id: [item.id],
			name: [item.name, [ Validators.required]],
			email: [item.email ? item.email : '',],
			password: [item.password],
			phone: [
				item.phone ? item.phone : '',
				[
					Validators.required,
					Validators.pattern(/^\+?[0-9]{1,3}-?[0-9]{1,50}$/),
				],
			],
			address: [item.address ? item.address.replace(', , ,', '') : '', [ Validators.required]],
			note: '',
		});
	}

	ngOnDestroy() {
		this.connect.unsubscribe();
	}

	public order = {
		data: [],
		total_buy: <number>0,
		loading: false,
		getlist: () => {
			this.order.data = this.cart.get();
			for (let i = 0; i < this.order.data.length; i++) {
				let item = this.order.data[i]
				this.order.total_buy += (item.price * item.amount)
			}

		},
		changeAmount: (amount, index) => {
			if (amount <= 0 || !Number.isInteger(amount)) {
				this.order.data[index].amount = 1;
			}
		},
		removeItem: id => {
			this.cart.remove(id);
			this.order.getlist();
		},
		addCart: (amount, id) => {
			let data = this.cart.reduce();
			if (data[id]) {
				data[id].amount = +amount;
			}
			this.cart.edit(data[id], id);
		},
		submit: () => {
			let data = {
				cart: this.order.getDataCart(),
				cartDetail: this.order.getItemDetail(),
				customer: this.fm.value,
			};

			if (this.flags) {
				this.flags = !this.flags;

				this.order.loading = true;

				data.cart['customer_id'] = this.globals.CUSTOMERS.get().id;

				this.globals.send({
					path: this.token.addcart,
					token: 'addcart',
					data: data,
				});

				this.globals.send({
					path: this.token.mailsale,
					token: 'mailsale',
					data: data,
				});
			}
		},

		getDataCart: () => {
			let cart = {
				customer_id: this.user.id,
				total_price: this.order.total_buy,
				total_sale: this.order.total_buy - this.cart.total(),
				total_payment: this.cart.total(),
				code: Math.floor(Math.random() * (2000000 - 1 + 1)) + 1,
				note: this.datacart['note'],
				status: 1,
			};
			return cart;
		},

		getItemDetail: () => {
			return Object.values(
				this.cart.get().reduce((n, o, i) => {
					n[i] = {
						product_id: +o.id,
						amount: o.amount,
						price: +o.price_sale,
						attribute: o.attribute ? o.attribute : 0,
						total: (isNaN(+o.amount) ? 0 : +o.amount) * (isNaN(+o.price_sale) ? 0 : +o.price_sale),
						status: 1,
						note: o.note ? o.note : '',
					};

					return n;
				}, {}),
			);
		},
		dataCart: () => {
			this.datacart = this.fm.value;

			if (!this.fm.valid) {
				this.alert.skip = true;
				this.alert.message = 'Bạn chưa nhập đầy đủ thông tin giao hàng.Vui lòng kiểm tra lại.';

				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

				return false;
			} else {
				this.alert.skip = false;
				this.alert.message = '';

				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

				return true;
			}
		},
	};


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

	login = (type: number) => {
		this.modalRef = this.modalService.show(ModalSinginSingupComponent, {
			class: 'gray modal-md',
			initialState: { data: type },
		});

		this.modalRef.content.onClose.subscribe(result => {
			if (result == true) {
				setTimeout(() => {
					this.fmConfigs(this.globals.CUSTOMERS.get());

					let status = this.order.dataCart();
					this.step = status == false ? 2 : 3;

					this.payment.skip = true;
				}, 200);
			}
		});
	};

	public payment = {
		data: [],
		skip: false,
		check: skip => {
			if (skip) {
				if (this.user.id) {
					
					this.step = 2;

					this.payment.skip = true;
				} else {
					this.login(1);
				}
			} else {
				this.router.navigate(['/gio-hang']);
			}
		},
		onStep: step => {
			if (step === 3) {
				window.scrollTo(0, 0);

				let customer = this.globals.CUSTOMERS.get();
				// customer.province_id = this.fm.value.province_id;
				// customer.district_id = this.fm.value.district_id;
				// customer.ward_id = this.fm.value.ward_id;
				customer.phone = this.fm.value.phone;

				this.globals.CUSTOMERS.set(customer);

			}

			this.datacart = this.fm.value;

			this.payment.skip = true;


			this.step = step;
		},
	};

}
