import { MessageBus } from './message-bus';
import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BusyService } from './busy.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private _router: Router, private _authService: AuthService, private _busyService: BusyService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this._busyService.setBusy(false);
    return this._authService.isLoggedIn().then(t => {
      this._authService.redirectUrl = state.url;
      if (!t) {
        this._router.navigate(['/login'], {skipLocationChange: true});
        return false;
      }

      // make sure user has permissions desired route
      const user = this._authService.getUser();

      const co = route.params['company'];
      // tslint:disable-next-line:triple-equals
      if (co && co != user.companyCode) {
        console.log('No access to ' + co);
        this._router.navigate(['/home']);
        return false;
      }

      if (user.isAdmin) { return true; }

      // check that user has required feature
      const featureId = route.data.feature;
      if (featureId) {
        const featureIds = this._authService.getUser().featureIds;
        if (featureIds.indexOf(featureId) >= 0) {
          return true;
        } else {
          MessageBus.notify({ message: 'You do not have access to this feature ', type: 'warning'});
          return false;
        }
      }
      return t;
    });
  }
}
