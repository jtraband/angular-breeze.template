// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { UserRole } from './user-role';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class User extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  id: number;
  createdBy: string;
  createdByUserId: number;
  createdDate: Date;
  email: string;
  firstName: string;
  lastName: string;
  modifiedBy: string;
  modifiedByUserId: number;
  modifiedDate: Date;
  rowVersion: number;
  userName: string;
  userPassword: string;
  userRoles: UserRole[];
}

