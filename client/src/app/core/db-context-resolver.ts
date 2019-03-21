import { DbContext, DbContextService } from './db-context.service';
import { Injectable } from '@angular/core'
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class DbCompanyResolver implements Resolve<DbContext> {
  private _url: string;
  constructor(private _dbcService: DbContextService, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this._url = this._router.url;

    const p1 = this._dbcService.setCompany(route.params['company']);
    return p1;
  }
}
