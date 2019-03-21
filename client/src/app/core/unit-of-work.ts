import { DialogService } from './dialog.service';
import {
  Entity,
  EntityChangedEventArgs,
  EntityManager,
  EntityQuery,
  EntityState,
  EntityStateSymbol,
  EntityType,
  SaveOptions,
  ValidationError,
} from 'breeze-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { ErrorLogger } from './error-logger';

import * as _ from 'lodash';

export class SavedOrRejectedArgs {
  entities: Entity[];
  rejected: boolean;
}

// Wraps a breeze EntityManager - hooks up observables for most breeze events and provides
// helper methods.

export class UnitOfWork {

  private static shelveSets = {};

  initializedPromise: Promise<any> = Promise.resolve(null);


  private _pendingSavePromise: Promise<any>;

  private entityChangedSubject: Subject<EntityChangedEventArgs>;
  private savedOrRejectedSubject: Subject<SavedOrRejectedArgs>;
  private validationErrorsSubject: BehaviorSubject<ValidationError[]>;
  private hasChangesSubject: BehaviorSubject<boolean>;


  static deleteShelveSet(key: string): void {
    delete UnitOfWork.shelveSets[key];
  }

  constructor(public manager: EntityManager, private queryParams: Object, public errorLogger: ErrorLogger,
    private _dialogService: DialogService) {
    this.entityChangedSubject = new Subject<EntityChangedEventArgs>();
    this.savedOrRejectedSubject = new Subject<SavedOrRejectedArgs>();
    this.validationErrorsSubject = new BehaviorSubject<ValidationError[]>([]);
    this.hasChangesSubject = new BehaviorSubject(false);
    this.initializeSubs();
  }

  initialize(fn: () => Promise<any>) {
    this.initializedPromise = fn();
  }

  private initializeSubs() {

    // No need to unsubscribe because service has same lifetime as the app.

    // The scope of the unit of work and EntityManager are the same, no need to unsubscribe from events
    this.manager.validationErrorsChanged.subscribe(data => {
      this.tryOrError(() => {
        const validationErrors: ValidationError[] = [];
        this.getChanges().forEach(entity => {
          const errors = entity.entityAspect.getValidationErrors();
          Array.prototype.push.apply(validationErrors, errors);  // add errors to the collection
        });
        this.validationErrorsSubject.next(validationErrors);
      });
    });

    this.manager.hasChangesChanged.subscribe(data => {
      this.tryOrError(() => {
        if (!data.hasChanges) { this.validationErrorsSubject.next([]); }  // clear validation errors
        this.hasChangesSubject.next(data.hasChanges);
      });
    });

    this.manager.entityChanged.subscribe(args => {
      this.tryOrError(() => this.entityChangedSubject.next(args));
    });


  }

  validateAllChanged() {
    const invalidEntities = [];
    const changedEntities = this.manager.getEntities(null, [EntityState.Modified, EntityState.Added]);
    changedEntities.forEach(s => {
      const ok = s.entityAspect.validateEntity();
      if (!ok) {
        invalidEntities.push(s);
      }
    });

    return invalidEntities;
  }

  // All validation errors in this uow
  get validationErrorsObservable() {
    return this.validationErrorsSubject.asObservable();
  }

  get entityChangedObservable() {
    return this.entityChangedSubject.asObservable();
  }

  get savedOrRejectedObservable() {
    return this.savedOrRejectedSubject.asObservable();
  }

  exportEntities(entities?: Entity[], asString: boolean = false) {
    return this.manager.exportEntities(entities, { asString: asString, includeMetadata: false });
  }

  attachEntity(entity: any, entityState?: EntityStateSymbol) {
    this.manager.attachEntity(entity, entityState);
  }

  get hasChangesObservable() {
    return this.hasChangesSubject.asObservable();
  }

  hasChanges() {
    return this.manager.hasChanges();
  }

  getChanges(): Entity[] {
    return this.manager.getChanges();
  }

  getEntities<T extends Entity>(type: { new (): T; }): T[] {
    if (type && !type.prototype.entityType) {
      throw new Error('EntityType not found: ' + type);
    }
    return <T[]>this.manager.getEntities(type.prototype.entityType);
  }

  clearEntities<T extends Entity>(type: { new (): T; }) {
    if (type && !type.prototype.entityType) {
      throw new Error('EntityType not found: ' + type);
    }
    const entities = <T[]>this.manager.getEntities(type.prototype.entityType);
    entities.forEach(a => a.entityAspect.setDetached());
  }

  getEntitiesByName<T extends Entity>(entityTypeName: string): T[] {
    return <T[]>this.manager.getEntities(entityTypeName);
  }

  commit(entities: any[] = null) {
    return this.commitCore().then(r => {
      const entityErrors = (r as any).entityErrors;
      if ( entityErrors != null) {
        this._dialogService.showValidationErrors(entityErrors);
      } else {
        return r;
      }
    });
  }

  private commitCore(entities: any[] = null): Promise<any> {
    if (this._pendingSavePromise) { return this._pendingSavePromise; }
    const saveOptions = new SaveOptions({ resourceName: 'savechanges', tag: this.queryParams });
    this._pendingSavePromise = <any>this.manager.saveChanges(entities, saveOptions)
      .then((saveResult) => {
        this._pendingSavePromise = null;
        if (saveResult.entities.length > 0) {
          this.savedOrRejectedSubject.next({
            entities: saveResult.entities,
            rejected: false
          });
        }
        return saveResult.entities;
      }).catch((e) => {
        this._pendingSavePromise = null;
        // Neither saved nor rejected so no savedOrRejected
        this.errorLogger.log(e);
        return e;
      });
    return this._pendingSavePromise;
  }

  rollback(): void {
    const pendingChanges = this.manager.getChanges();
    this.manager.rejectChanges();
    this.savedOrRejectedSubject.next({
      entities: pendingChanges,
      rejected: true
    });
  }

  clear(): void {
    // this._emProvider.reset(this.manager);
    this.manager.clear();
  }

  shelve(key: string, clear: boolean = false): void {
    const data = this.manager.exportEntities(null, { asString: false, includeMetadata: false });
    UnitOfWork.shelveSets[key] = data;
    if (clear) {
      this.clear();
      // this._emProvider.reset(this.manager);
    }
  }

  unshelve(key: string, clear: boolean = true): boolean {
    const data = UnitOfWork.shelveSets[key];
    if (!data) {
      return false;
    }

    if (clear) {
      // Clear the entity manager and don't bother importing lookup data from masterManager.
      this.manager.clear();
    }
    this.manager.importEntities(data);

    // Delete the shelveSet
    delete UnitOfWork.shelveSets[key];
    return true;
  }

  getAllOrQuery<T extends Entity>(type: { new (): T; }, resourceName: string = null) {
    const r = this.getEntities(type);
    if (r.length > 0) {
      return Promise.resolve(r);
    } else {
      return this.createQuery(type, resourceName).execute();
    }
  }

  queryAll<T extends Entity>(type: { new (): T; }, resourceName: string = null) {
    return this.createQuery(type, resourceName).execute();
  }

  createQuery<T extends Entity>(type: { new (): T; }, resourceName: string = null) {
    return new TypedQuery(type, resourceName, this).withParameters(this.queryParams);
  }

  createEntity<T extends Entity>(type: { new (): T; }, config?: any, entityState?: EntityStateSymbol): T {
    const inst = <T>this.manager.createEntity(type.prototype.entityType, config, entityState);
    return inst;
  }

  private tryOrError(fn: () => any) {
    try {
      fn();
    } catch (err) {
      this.errorLogger.log(err);
    }
  }
}

export class TypedQuery<T extends Entity> {
  private _query: EntityQuery;
  private _manager: EntityManager;
  constructor(
    protected _type: { new (): T; } = null,
    protected _resourceName: string = null,
    protected _uow: UnitOfWork = null
  ) {
    // for clone
    if (_type == null && _resourceName == null) { return; }
    this._manager = _uow.manager;
    if (_type != null) {
      // const entityTypeName = _type.name;
      // const entityType = <EntityType>this._manager.metadataStore.getEntityType(entityTypeName);
      const entityType = _type.prototype.entityType;
      if (!entityType) {
        throw new Error(_type.name + ' does not exist! Query must be created for an existing entity type!');
      }
      if (!this._resourceName) {
        this._resourceName = entityType.defaultResourceName;
      }
    }
    this._query = EntityQuery.from(this._resourceName);
  }

  where(predicate: any): TypedQuery<T> {
    const q = this.clone();
    q._query = q._query.where(predicate);
    return q;
  }

  withParameters(params: any): TypedQuery<T> {
    const q = this.clone();
    params = _.extend(q._query.parameters, params)
    q._query = q._query.withParameters(params);
    return q;
  }

  expand(propertyPaths: any) {
    const q = this.clone();
    q._query = q._query.expand(propertyPaths);
    return q;
  }

  using(x: any) {
    const q = this.clone();
    q._query = q._query.using(x);
    return q;
  }

  execute(): Promise<T[]> {
    const p = <Promise<any>><any>this._manager.executeQuery(this._query);
    return p.then(data => {
      return data.results;
    }).catch(e => {
      this._uow.errorLogger.log(e);
      throw e;
    });
  }

  /** execute query to return only the count of entities */
  executeCount(): Promise<number> {
    const cq = this._query.take(0).inlineCount(true);
    const p = <Promise<any>><any>this._manager.executeQuery(cq);
    return p.then(data => {
      return data.inlineCount;
    }).catch(e => {
      this._uow.errorLogger.log(e);
      throw e;
    });
  }

  skip(count: number) {
    const q = this.clone();
    q._query = q._query.skip(count);
    return q;
  }

  take(count: number) {
    const q = this.clone();
    q._query = q._query.take(count);
    return q;
  }

  orderBy(prop: string, isDescending = false) {
    const q = this.clone();
    q._query = q._query.orderBy(prop, isDescending);
    return q;
  }

  orderByDesc(prop: string) {
    return this.orderBy(prop, true);
  }

  noTracking() {
    const q = this.clone();
    q._query = q._query.noTracking()
    return q;
  }

  private clone() {
    const q = new TypedQuery<T>();
    q._query = this._query;
    q._manager = this._manager;
    q._type = this._type;
    q._resourceName = this._resourceName;
    q._uow = this._uow;
    return q;
  }
}
