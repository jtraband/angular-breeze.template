// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { UserRole } from './user-role';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Role extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  id: number;
  description: string;
  name: string;
  roleType: string;
  ts: any;
  userRoles: UserRole[];
}

