import { Location } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { environment } from '../../environments/environment';
import { mapObject } from './map-object';
import { MessageBus } from './message-bus';

export class AuthUser {
  userTypeId: number;
  userLoginControlId: number;
  loginName: string;
  userDisplayName: string;
  /** true if admin or support */
  isAdmin: boolean;
  sessionMinutes: number;
  companyCode: string;
  companyName: string;
  companies: AuthCompany[];
  sites: AuthSite[];
  featureIds: number[];
}

export class AuthCompany {
  companyCode: string;
  companyName: string;
}

export class AuthSite {
  siteId: number;
  siteCode: string;
  siteName: string;
}

/**
 * Authenticate user and get user profile data from server.
 * Note that cookies must be supported - @see ./auth-request-options.ts
 */
@Injectable()
export class AuthService {
  private _user: AuthUser;
  redirectUrl: string;

  constructor(private _http: HttpClient, private _router: Router, private _location: Location,
    private _idle: Idle, private _keepalive: Keepalive) {
  }

  getUser(): AuthUser {
    return this._user;
  }

  /** Login and populate _user by building AuthUser from server data */
  login(userName: string, password: string, companyCode: string): Promise<boolean> {
    const url = environment.apiRoot + 'api/Login/login';
    const creds = { userName: userName, password: password };
    if (companyCode) { creds['companyCode'] = companyCode; }
    return this._http.post(url, creds)
        .toPromise()
        .then((res: any) => {
            this._user = mapObject<AuthUser>(res);
            MessageBus.notify({ message: 'login' });
            if (this._user.companyCode) {
              this.setKeepAlive();
              this.navigate();
            }
            return true;
        });

  }

  private navigate() {
    const dest = this.redirectUrl || '/home';
    if (this._user) {
      this._router.navigateByUrl(dest);
    } else {
      this.redirectUrl = this.redirectUrl || this._router.url;
      if (this.redirectUrl === '/login') { this.redirectUrl = '/home'; }
      this._router.navigateByUrl('/login');
    }
  }

  logout() {
    this._router.navigateByUrl('/login');
    this._user = null;
    this._idle.stop();
    MessageBus.notify({ message: 'logout' });
    const url = environment.apiRoot + 'api/Login/Logout';
    return this._http.get(url).toPromise().then(res => {
      this.navigate();
    }).catch(e => {
      console.log('Unable to logout.');
      this.navigate();
    });
  }

  isLoggedIn(): Promise<boolean> {

    if (this._user) {
      return Promise.resolve(true);
    } else {
      // first see if the user is still logged in on the server.
      return this.getUserFromBackend().then(res => true).catch(e => {
        // log error if not a 401 (Unauthorized) or 405 (Method not allowed) error.
        if (e.status !== 401 && e.status !== 405) {
            console.log('login check received unknown error: ' + e.status);
        }
        return false;
      });
    }
  }

  /** Populate _user by building AuthUser from server data */
  private getUserFromBackend(): Promise<AuthUser> {
    const url = environment.apiRoot + 'api/Login/GetLoggedInUser';
    return this._http.get(url)
        .toPromise()
        .then((res: any) => {
            this._user = mapObject<AuthUser>(res);
            this.setKeepAlive();
            return this._user;
        });
  }

  setKeepAlive() {
    // Monitor the app for user activity and send session keepalive requests to the server
    // See https://github.com/HackedByChinese/ng2-idle-example

    const idle = this._idle;
    const keepalive = this._keepalive;

    if (idle.isRunning() || !this._user) { return; }

    if (idle.getInterrupts() && idle.getInterrupts().length) {
      // already configured, just start
      idle.watch();
      return;
    }

    // sets an idle timeout equal to the server session timeout.
    idle.setIdle(this._user.sessionMinutes * 60);
    // sets a timeout grace period.  After idle + timeout, the user will be considered timed out.
    idle.setTimeout(60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      this.logout();
    });
    idle.onTimeoutWarning.subscribe((countdown) => { 
      if (countdown % 10 === 0) {
        MessageBus.notify({
          message: 'You will be logged out in ' + countdown + ' seconds.  Click to keep your session alive.',
          type: 'warning'
        });
      }
    });

    // sets the ping interval - how often to ping the server to keep the server session alive
    keepalive.interval(60);

    // set the ping request
    const url = environment.apiRoot + 'api/Login/KeepAlive';
    const req = new HttpRequest('GET', url, { withCredentials: true });
    keepalive.request(req);

    // start idle watching
    idle.watch();
  }

}
