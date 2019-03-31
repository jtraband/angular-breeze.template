import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../core/auth.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  version = '1.0.0';
  time = new Date().getTime();

  constructor(private _router: Router, private _authService: AuthService) {
  }

  ngOnInit() { }

  get user() {
    return this._authService.getUser();
  }

  logout() {
    this._authService.redirectUrl = null;
    this._authService.logout();
  }

  helpClick() {
    this.time = new Date().getTime();
  }

  get helpLink() {
    const rt = this._router.routerState.snapshot.root;

    let ch = rt.firstChild;
    while (ch && ch.firstChild && !ch.component) {
      ch = ch.firstChild;
    }
    const path = ch && ch.url.length && ch.url[0].path;

    const root = environment.helpRoot;
    return root + 'insightload.htm#' + path;
  }

}

