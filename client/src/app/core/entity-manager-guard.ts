import { NorthwindIBManagerProvider  } from './entity-manager-provider';

import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Resolve } from '@angular/router';

@Injectable()
export class EntityManagerProviderGuard implements CanActivate {
    constructor(private emProvider: NorthwindIBManagerProvider) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const p1 = this.emProvider.prepare();
        return p1.then(() => true);
    }
}
