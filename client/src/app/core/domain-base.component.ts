import { Router } from '@angular/router';

import { AuthUser } from './../core/auth.service';
import { DbContext, DbContextService } from './../core/db-context.service';
import { DialogService } from './../core/dialog.service';
import { DomainService } from './../core/domain.service';
import { DxFns } from './../core/dx-fns';
import { UtilFns } from './../core/util-fns';
import { OnDestroy, OnInit } from '@angular/core';

export abstract class DomainBaseComponent implements OnInit, OnDestroy {
  authUser: AuthUser;
  dbContext: DbContext;
  dbContextService: DbContextService; // duplicated so as not to break existing components
  self: DomainBaseComponent;
  DxFns = DxFns;
  UtilFns = UtilFns;
  private _isPageReady: boolean;
  protected _dialogService: DialogService;
  protected _dbContextService: DbContextService;
  protected _router: Router;

  constructor(protected _domainService: DomainService) {
    this.authUser = _domainService.authService.getUser();
    this.dbContext = _domainService.dbContextService.currentDbContext;
    this._dialogService = _domainService.dialogService;
    this._dbContextService = _domainService.dbContextService;
    this.dbContextService = _domainService.dbContextService;
    this._router = _domainService.router;
    this.self = this;
    this.isPageReady = false;
  }

  ngOnInit(): void {
    this.isPageReady = true;
  }
  ngOnDestroy(): void {
    this._domainService.busyService.setBusy(false);
  }

  get isPageReady() {
    return this._isPageReady;
  }
  set isPageReady(val: boolean) {
    this._isPageReady = val;
    this._domainService.busyService.setBusy(!val);
  }

  hasUserFeature(featureId: number) {
    return (this.authUser.isAdmin || this.authUser.featureIds.indexOf(featureId) >= 0);
  }

  /** get named param from the end of the current route */
  getRouteParam(name: string) {
    let rt = this._router.routerState.snapshot.root;
    while (rt.firstChild) { rt = rt.firstChild; }
    return rt.params[name];
  }

  /** get named param from the first occurance in the current route */
  getFirstParam(name: string) {
    let rt = this._router.routerState.snapshot.root;
    while (!rt.params[name] && rt.firstChild) { rt = rt.firstChild; }
    return rt.params[name];
  }
}

