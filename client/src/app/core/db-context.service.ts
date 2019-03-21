import { MessageBus } from './message-bus';
import { DialogService } from './dialog.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { CompanyManagerProvider } from './entity-manager-provider';
import { ErrorLogger } from './error-logger';
import { UnitOfWork } from './unit-of-work';

export class DbContext {
  companyCode?: string;

}

@Injectable()
export class DbContextService {
  currentDbContext: DbContext = {};
  currentCompanyUow: UnitOfWork;


  companyCode: string;

  constructor(private _companyProvider: CompanyManagerProvider,
        private _dialogService: DialogService, private _errorLogger: ErrorLogger) {

      MessageBus.messages.subscribe(msg => {
        if (msg && msg.message === 'logout') {
          this.currentDbContext = {};
          this.currentCompanyUow && this.currentCompanyUow.clear();
          this.companyCode = null;
        }
      });
  }

  setCompany(companyCode: string) {
    if (!companyCode) { throw new Error('Company code not provided'); }
    this.companyCode = companyCode;
    if (companyCode === this.currentDbContext.companyCode) {
      return Promise.resolve(this.currentCompanyUow);
    }
    this.currentDbContext.companyCode = companyCode;
    const em = this._companyProvider.newManager();
    const queryParams = {
      companyCode: this.currentDbContext.companyCode,
    };
    this.currentCompanyUow = new UnitOfWork(em, queryParams, this._errorLogger, this._dialogService);


  }

}
