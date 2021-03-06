import { AfterViewInit, Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {  AuthService } from '../core/auth.service';
import { ErrorLogger } from '../core/error-logger';
import { UtilFns } from 'app/core/util-fns';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  error = '';
  success = '';
  working = false;


  constructor(private _authService: AuthService,
              private _renderer: Renderer2,
              private _route: ActivatedRoute, private _logger: ErrorLogger) {
  }

  ngAfterViewInit() {
    // put cursor in email element
    const emailInput = this._renderer.selectRootElement('#email');
    emailInput.focus();
  }

  onSubmit() {
    this.error = '';
    if (!this.working) {
      this.working = true;
      this._authService.login(this.email, this.password).then(_ => {
        this.error = null;
        const user = this._authService.getUser();
        this.success = 'Logged in';
      }, error => {
        if (error.status === 0) {
          this.error = 'Unable to contact server';
        } else if (error.status === 401) {
          this.error = 'Invalid login name or password';
        } else {
          this._logger.log(error, 'error');
          this.error = UtilFns.getErrorMessage(error);
        }

        this.working = false;

      });
    }
  }

}
