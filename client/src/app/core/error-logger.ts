import { UtilFns } from './util-fns';
import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

export type ErrorLevel = 'info'|'warning'|'error'|'success';

export class ErrorEntry {
  constructor(public error: any, public errorLevel: ErrorLevel) {

  }

  formatError() {
    return UtilFns.getErrorMessage(this.error);
  }
}

@Injectable()
export class ErrorLogger {
  _errors: ErrorEntry[] = [];
  constructor() {
  }

  log(e: string | any, errorLevel?: ErrorLevel) {
    console.log(e);
    errorLevel = errorLevel || 'error';
    const ee = new ErrorEntry(e, errorLevel);
    this._errors.push(ee);
    notify(ee.formatError(), errorLevel, errorLevel === 'error' ? 5000 : 2000);
  }

  getErrors() {
    return this._errors;
  }
}
