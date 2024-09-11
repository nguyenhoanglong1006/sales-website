import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sharefb',
  templateUrl: './sharefb.component.html',
})
export class SharefbComponent implements OnInit, OnChanges {

  public link = "";
  public href = window.location.href
  constructor(public router: Router) {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        this.link = `https://www.facebook.com/plugins/like.php?href=` + window.location.href + `&width=450&layout=button&action=like&size=small&share=true&height=35&appId=1272725842877554`
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        this.link = `https://www.facebook.com/plugins/like.php?href=` + window.location.href + `&width=450&layout=button&action=like&size=small&share=true&height=35&appId=1272725842877554`

      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        this.link = `https://www.facebook.com/plugins/like.php?href=` + window.location.href + `&width=450&layout=button&action=like&size=small&share=true&height=35&appId=1272725842877554`
      }
    });
  }

}
