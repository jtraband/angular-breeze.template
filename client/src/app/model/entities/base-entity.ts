import { EntityPropertyAnnotation, EntityTypeAnnotation } from '../entity-type-annotation';
import { Entity, EntityAspect, EntityType, core, Validator } from 'breeze-client';

export class BaseEntity implements Entity {
    entityAspect: EntityAspect;
    entityType: EntityType;

    /** return an annotation containing 'required' propertyAnnotations for the given property names */
    static getRequiredTypeAnnotation(propNames: string[]): EntityTypeAnnotation {
      return new EntityTypeAnnotation({
        validators: [],
        propertyAnnotations: BaseEntity.getRequiredPropertyAnnotations(propNames)
      });
    }

    /** return annotations containing a 'required' validator for each of the given property names */
    static getRequiredPropertyAnnotations(propNames: string[]): EntityPropertyAnnotation[] {
      const required = Validator.required();
      const anno = propNames.map(name => {
        return new EntityPropertyAnnotation(name, { displayName: name, validators: [required]});
      });
      return anno;
    }

    // tslint:disable-next-line:member-ordering
    static greaterThanZeroValidator = new Validator('greaterThanZero',
      (value: any, context) => {
        if (!Number.isFinite(value) || value <= 0) {
          return false;
        }
        return true;
      }, { messageTemplate: '%displayName% must be greater than zero' }
    );

    getErrorFor(prop: string): string {
        if (prop && prop.length) {
            return this.entityAspect.getValidationErrors(prop).map(ve => ve.errorMessage).join('. ');
        } else {
            return this.entityAspect.getValidationErrors().filter(ve => ve.property == null)
                .map(ve => ve.errorMessage).join('. ');
        }
    }

    getEntityDisplayName() {
        return this.entityType.shortName +
          ' (' + this[this.entityType.keyProperties[0].name] + ')';
        // return this.entityType.shortName + ' - '
        // + this.entityType.keyProperties[0].name + ': '
        // + this[this.entityType.keyProperties[0].name];
    }

    /** return an object containing the data properties of the entity, for making a clone. */
    getConfig() {
      const keyname = this.entityType.keyProperties[0].name;
      const jobj = core.toJSONSafe(this, function (prop, val) {
        if (prop === keyname || !val || !!val.entityAspect || Array.isArray(val)) { return };
        if (prop === 'updateDate' || prop === 'updatingUserName') { return; }
        return core.toJSONSafeReplacer(prop, val);
      });
      return jobj;
    }

}
