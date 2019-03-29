import { MessageBus } from './message-bus';
import { DialogService } from './dialog.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { NorthwindIBManagerProvider } from './entity-manager-provider';
import { ErrorLogger } from './error-logger';
import { UnitOfWork } from './unit-of-work';

export class DbContext {
  companyCode?: string;

}

@Injectable()
export class DbContextService {
  currentDbContext: DbContext = {};
  currentUow: UnitOfWork;

  constructor(private _emProvider: NorthwindIBManagerProvider,
        private _dialogService: DialogService, private _errorLogger: ErrorLogger) {

      MessageBus.messages.subscribe(msg => {
        if (msg && msg.message === 'logout') {
          this.currentDbContext = {};
          // tslint:disable-next-line:no-unused-expression
          this.currentUow && this.currentUow.clear();
        }
      });
  }

  initializeUow() {
    if (this.currentUow != null) { return Promise.resolve(this.currentUow); }
    const em = this._emProvider.newManager();
    const queryParams = {

      // companyCode: this.currentDbContext.companyCode,
    };
    this.currentUow = new UnitOfWork(em, queryParams, this._errorLogger, this._dialogService);
    return Promise.resolve(this.currentUow);

  }

}
