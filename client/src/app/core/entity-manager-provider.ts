import { NorthwindIBMetadata } from './../model/entities/NorthwindIB/metadata';

import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import {
  EntityManager, EntityQuery, NamingConvention, DataService,
  DataType, MetadataStore, EntityType, NavigationProperty,
  DataProperty, ValidationOptions, config, AutoGeneratedKeyType
} from 'breeze-client';

// Import breeze adapters
import 'breeze-client/breeze.dataService.webApi';
import 'breeze-client/breeze.modelLibrary.backingStore';
import 'breeze-client/breeze.uriBuilder.odata';
// for breeze 2.0
// import 'breeze-client/adapter-data-service-webapi';
// import 'breeze-client/adapter-model-library-backing-store';
// import 'breeze-client/adapter-uri-builder-odata';

import { EntityTypeAnnotation } from '../model/entity-type-annotation';
import { ErrorLogger } from './error-logger';
import * as moment from 'moment-mini';
import { NorthwindIBRegistrationHelper } from '../model/entities/NorthwindIB/registration-helper';

abstract class EntityManagerProvider {

  protected _preparePromise: Promise<any>;
  protected _masterManager: EntityManager;
  protected registrationHelper: any;
  protected metadata: any;

  constructor(public errorLogger: ErrorLogger, protected authService: AuthService) { }

  abstract getDataService(): DataService;

  prepare(): Promise<void> {
    if (!this._preparePromise) {
      NamingConvention.camelCase.setAsDefault();

      // See this link: https://stackoverflow.com/questions/17657459/breezejs-date-is-not-set-to-the-right-time
      DataType.parseDateFromServer = function (source) {
        // code below is for when dates are DateTimeOffsets, but should not be converted to the browser timezone
        const s = (source && source.length > 23) ? source.substring(0, 23) : source;
        const mo = moment(s);
        const date = mo.toDate();
        date['_fromServer'] = source;
        return date;
      };

      const dataService = this.getDataService();

      const master = new EntityManager({
        dataService: dataService
      });
      this._masterManager = master;
      const metadataStore = master.metadataStore;
      metadataStore.importMetadata(<any>this.metadata.value);
      metadataStore.setProperties({
        serializerFn: function (dataProperty, value) {
          value = dataProperty.isUnmapped ? undefined : value;
          if (value instanceof Date) {
            const date = value as Date;
            // make ISO string for current time zone (not UTC)
            value = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
            // for use if dates are DateTimeOffsets, but should not be given the browser timezone nor UTC
            value = value.substring(0, 23); // chop off the timezone
          }
          return value;
        }
      });
      this.registrationHelper.register(metadataStore);
      this.patchMetadata(metadataStore);
      this.registerAnnotations(metadataStore);

      this._preparePromise = Promise.resolve(true);

      // Not needed at this level yet.
      // this._preparePromise = master.executeQuery(EntityQuery.from('lookups'))
      //   .catch(e => {
      //     this.errorLogger.log(e);
      //     throw e;
      //   });
    }

    return this._preparePromise;
  }

  get masterManager(): EntityManager {
    return this._masterManager;
  }

  newManager(): EntityManager {
    const manager = this._masterManager.createEmptyCopy();
    return manager;
  }

  // Add validators based on annotations
  private registerAnnotations(metadataStore: MetadataStore) {
    metadataStore.getEntityTypes().forEach((t: EntityType) => {
      const et = <EntityType>t;
      const ctor = <any>et.getCtor();
      if (ctor && ctor.getEntityTypeAnnotation) {
        const etAnnotation = <EntityTypeAnnotation>ctor.getEntityTypeAnnotation();
        et.validators.push(...etAnnotation.validators);
        etAnnotation.propertyAnnotations.forEach((pa) => {
          const prop = et.getProperty(pa.propertyName);
          prop.validators.push(...pa.validators);
          prop.displayName = pa.displayName;
        });
      }
    });
  }

  protected patchMetadata(metadataStore: MetadataStore) {
    // make modifications to metadata
  }

}

@Injectable()
export class NorthwindIBManagerProvider extends EntityManagerProvider {

  constructor(public errorLogger: ErrorLogger, protected authService: AuthService) {
    super(errorLogger, authService);
    this.metadata = NorthwindIBMetadata;
    this.registrationHelper = NorthwindIBRegistrationHelper;
  }

  getDataService() {
    return new DataService({
      serviceName: environment.entitiesApiRoot,
      hasServerMetadata: false
    });
  }

  protected patchMetadata(metadataStore: MetadataStore) {
    // add password to User; matches [NotMapped] property on server
    // const userType = <EntityType>metadataStore.getEntityType(User);
    // const userType = User.prototype.entityType;
    // userType.addProperty(new DataProperty({
    //     name: 'password',
    //     dataType: DataType.String
    // }));

  }
}



