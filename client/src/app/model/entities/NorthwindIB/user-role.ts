// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Role } from './role';
import { User } from './user';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class UserRole extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  iD: number;
  roleId: number;
  userId: number;
  role: Role;
  user: User;
}

