import { FooterService } from '~/services/modules/footer.service';
import { HomeService } from './../../../services/home/home.service';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "~/services/product/product.service";
import { Globals } from "../../../globals";
import { OwlOptions, SlidesOutputData } from "ngx-owl-carousel-o";
import { CartService } from '~/services/apicart/cart.service';

@Component({
    selector: "app-detail-product",
    templateUrl: "./detail.component.html",
    styleUrls: ["./detail.component.css"],
})
export class DetailProductComponent implements OnInit {

    @Input("data") data: any;

    @ViewChild("owlLibrary", { static: false }) owlLibrary: any;

    public connect;

    public item: any = {};

    public listImages = { data: [], cached: [], active: 0 };

    public activeSlides: SlidesOutputData;

    public showOwl: boolean = false;

    public widthOwl: number;

    public selected: any;

    public count: number = 1;

    public width: number = 0;

    public link: string = "";

    public parent_link: any;

    public parent_links: any;

    public contact: any;

    constructor(
        public route: ActivatedRoute,

        public router: Router,

        public productService: ProductService,

        public apiCart: CartService,

        public homeService: HomeService,

        public globals: Globals,

        public footerService: FooterService
    ) {
        this.width = document.body.getBoundingClientRect().width;

        this.route.params.subscribe(params => {

            this.link = params.link;

            this.parent_link = params.parent_link;

            this.parent_links = params.parent_links;
        });
    }

    ngOnInit() {
        this.getAddress()

        this.route.params.subscribe(params => {
            this.link = params.link;
            this.detail.get();
            this.product.get()
        });
        
    }

    getAddress(): void {
        this.footerService.getAddress().subscribe((resp: any) => this.address._ini(resp.data));
    }

    public detail = {
        amount: 1,
        images: '',
        data: <any>[],
        get: (): void => {
            this.productService.getDetail({ link: this.link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.detail.data = resp.data;
                    this.detail.images = resp.data.images
                    let listimages = (resp.data.listimages && resp.data.listimages.length > 5) ? JSON.parse(resp.data.listimages) : [];
                    this.listImages.cached = listimages;
                    if (this.detail.data.images && this.detail.data.images.length > 4) {
                        this.listImages.cached = [this.detail.data.images].concat(listimages);
                    } else {
                        this.detail.data.images = (listimages.length > 0) ? listimages[0] : '';
                    }
                    this.listImages.data = Object.values(this.listImages.cached);

                }
            });
        },
        changeAmount: () => {
            if (this.detail.amount <= 0 || !Number.isInteger(this.detail.amount)) {
                this.detail.amount = 1;
            }
        },
        addCart: () => {
            this.detail.data.images = this.globals.BASE_API_URL + 'public/products/' + this.detail.images;
            let data = this.apiCart.reduce();

            if (data[this.detail.data.id]) {

                let a = isNaN(+data[this.detail.data.id].amount) ? 1 : +data[this.detail.data.id].amount;

                this.detail.data.amount = +a + this.detail.amount;
            } else {
                this.detail.data.amount = this.detail.amount;
            }

            this.apiCart.edit(this.detail.data, this.detail.data.id)

            var element = document.getElementById('cart');

            window.scroll({ top: element.offsetTop, behavior: 'smooth', });

            document.getElementById('notification').classList.add("d-block");
        },

        getPassedData: (data: SlidesOutputData) => {
            this.activeSlides = data;
            this.selected = data.slides[0] ? data.slides[0].id : "";
            this.detail.data.images = this.selected;
            setTimeout(() => {
                this.detail.onClickImageChild(this.selected + '-child');
            }, 200);
        },

        onClickImageChild: (id) => {
            let items: any = document.querySelectorAll('.img-child');
            for (let i = 0; i < items.length; i++) {
                items[i].style.opacity = 0.5;
                items[i].classList.remove("border");
                items[i].classList.remove("border-danger");
            }
            document.getElementById(id).style.opacity = '1';
            document.getElementById(id).classList.add("border");
            document.getElementById(id).classList.add("border-danger");
        }

    };

    public address = {
        show: -1,
        data: [],
        _ini: (data) => {
            if (data && data.length > 0) {
                this.address.data = data;
                this.address.show = data[0].id;
            }
        },
        _onShow: (id) => {
            this.address.show = this.address.show != id ? id : -1;
        }
    }

    renderHtml = () => {
        let main = document.getElementById("contentDetail");

        if (main) {
            let el = main.querySelectorAll("table");

            if (el) {
                for (let i = 0; i < el.length; i++) {
                    let div = document.createElement("div");
                    div.className = "table-responsive table-bordered m-0 border-0";
                    el[i].parentNode.insertBefore(div, el[i]);
                    el[i].className = "table";
                    el[i].setAttribute("class", "table");
                    let cls = el[i].getAttribute("class");
                    el[i];
                    let newhtml = "<table class='table'>" + el[i].innerHTML + "</table>";
                    el[i].remove();
                    div.innerHTML = newhtml;
                }
            }

            let image = main.querySelectorAll("img");

            if (image) {
                for (let i = 0; i < image.length; i++) {
                    let a = document.createElement("div");

                    a.className = "images-deatil d-inline";

                    image[i].parentNode.insertBefore(a, image[i]);

                    let style = image[i].style.cssText;

                    let width = image[i].width || 0;

                    let heigth = image[i].width || 0;

                    let src = image[i].currentSrc;

                    let html =
                        `<a  class="fancybox" data-fancybox="images-preview" data-thumbs="{&quot;autoStart&quot;:true}" href="` +
                        src + `">  <img class="mb-2" width="` + width + `px" heigth="` + heigth + `px" src="` + src +
                        `" style="` + style + `" alt="` + this.data.name + `" />   </a>`; image[i].remove();
                    a.innerHTML = html;
                }
            }
        }
    };

    customOptions: OwlOptions = {
        autoplayTimeout: 8000,
        autoplaySpeed: 1500,
        autoWidth: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        mergeFit: false,
        navSpeed: 500,
        items: 5,
        responsive: {
            300: {
                items: 1,
                nav: false,
                loop: true,
                center: false,
                margin: 280,
                mergeFit: true,
            },
            600: {
                items: 1,
                nav: false,
                loop: true,
                center: false,
                margin: 200,
                mergeFit: true,
            },
            1000: {
                items: 1,
                center: false,
            }
        }
    }

    images = [
        "../assets/img/bg/shape-1.png",
        "../assets/img/login.jpg"
    ];

    public product = {
        data: <any>[],
        get: (): void => {
            this.homeService.getProduct().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.product.data = resp.data.featured;
                }
            });
        },
    };


    setCount(i) {
        if (i == 1) {
            this.count = Math.max(this.count -= 1, 1)
        }
        else {
            this.count += 1
        }
    }
}
