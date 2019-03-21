import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class BusyIndicator {
  private busyCounter = 0;
  private busySubject = new BehaviorSubject<boolean>(false);
  private _isBusy = this.busySubject.asObservable().distinctUntilChanged().debounceTime(300);

  get isBusy() {
    return this._isBusy;
  }
  async busy<T>(op: Promise<T> | (() => Promise<T>)): Promise<T> {
    this.increment();
    try {
      if (typeof op === 'function') {
        return await op();
      }
      return await op;
    } finally {
      this.decrement();
    }
  }
  enterBusy() {
    this.increment();
  }
  exitBusy() {
    this.decrement();
  }
  private increment() {
    this.busyCounter++;
    this.busySubject.next(this.isBusyCore);
  }
  private decrement() {
    if (this.busyCounter > 0) {
      this.busyCounter--;
    }
    this.busySubject.next(this.isBusyCore);
  }
  private get isBusyCore(): boolean {
    return this.busyCounter > 0;
  }
}

@Injectable()
export class BusyService {
  private busyIndicator = new BusyIndicator();
  get isBusy() {
    return this.busyIndicator.isBusy;
  }

  busy<T>(op: Promise<T> | (() => Promise<T>)): Promise<T> {
    return this.busyIndicator.busy(op);
  }
  enterBusy() {
    this.busyIndicator.enterBusy();
  }
  exitBusy() {
    this.busyIndicator.exitBusy();
  }
  newBusyIndicator(): BusyIndicator {
    return new BusyIndicator();
  }

  setBusy(val: boolean) {
    if (val) {
      this.enterBusy();
    } else {
      this.exitBusy();
    }
  }
}
