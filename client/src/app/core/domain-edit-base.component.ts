import { BaseEntity } from '../model/entities/base-entity';
import { DomainBaseComponent } from './domain-base.component';
import { DomainService } from './domain.service';
import { UnitOfWork } from './unit-of-work';
import { UtilFns } from './util-fns';
import * as _ from 'lodash';

export abstract class DomainEditBaseComponent extends DomainBaseComponent {
  uow: UnitOfWork;
  protected _isDeactivating: boolean;
  protected _wasSavedOrCancelled: boolean;

  constructor(protected _domainService: DomainService) {
    super(_domainService);
  }

  deleteEntity(e: BaseEntity) {
    if (e.entityAspect && e.entityAspect.entityState.isAdded()) {
      e.entityAspect.setDetached();
    } else {
      e['status'] = 3;
    }
  }

  // call saveChanges with shouldExit false if you don't want to leave page after saveChanges
  saveChanges(message: string = 'Saved', shouldExit: boolean = true) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.saveChangesCore(message, shouldExit));
      }, 100);
    });
  }

  saveChangesCore(message: string, shouldExit: boolean) {
    return this.beforeSaveChanges(message).then((x) => {
      if (x == null || x === false) {
        return Promise.resolve(false);
      }
      if (!this.uow.hasChanges()) {
        return Promise.resolve(this.goBackOrReturnTrue(shouldExit));
      }
      return this.uow.commit().then((r) => {
        if (!this.uow.hasChanges()) {
          this._dialogService.toast({ message: message, type: 'success' });
          this._wasSavedOrCancelled = shouldExit && true;
          return this.goBackOrReturnTrue(shouldExit);
        } else {
          // logged by uow.commitCore
        }
      });
    }).catch(reason => {
       this._dialogService.toast({ message: reason, type: 'error' });
    });
  }

  // override to disable save button
  canSave() {
    return true;
  }

  cancelChanges() {
    UtilFns.forceLoseFocus();
    if (!this.hasChanges()) {
      return Promise.resolve(this.goBackOrReturnTrue());
    }
    return this._dialogService.promptToSave().then(r => {
      if (r.index === 2) {
        return false;
      } else if (r.index === 0 && !this.canSave()) {
        this._dialogService.toast({ message: 'Unable to save', type: 'error' });
        return false;
      }
      this._wasSavedOrCancelled = true;
      if (r.index === 0) {
        return this.saveChanges().then(() => true);
      } else if (r.index === 1) {
        this.uow.rollback();
        this._dialogService.toast('Changes discarded');
        return this.goBackOrReturnTrue();
      }
    });
  }

  canDeactivate() {
    if (this._wasSavedOrCancelled) { return true; }
    this._isDeactivating = true;
    return this.cancelChanges().then(r => {
      this._isDeactivating = false;
      return r;
    });
  }

  // should be overridden as needed to update any uow changes that
  // might not have already been completed.
  beforeSaveChanges(message: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  // should be overridden if there is a beforeSaveChanges that can cause
  // changes not already in the the uow.
  hasChanges() {
    return this.uow.hasChanges();
  }

  // can't use _.isEqual because DevX reorders items
  protected areEqual(a1: any[], a2: any[]) {
    if (a1.length !== a2.length) { return false; }
    const dif = _.difference(a1, a2);
    return dif.length === 0;
  }

  goBackOrReturnTrue(shouldExit: boolean = true) {
    if (shouldExit && !this._isDeactivating) {
      this.goBack();
    }
    return true;
  }

  abstract goBack();

}

