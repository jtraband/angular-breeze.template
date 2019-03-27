// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { TimeLimit } from './time-limit';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class TimeGroup extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  id: number;
  comment: string;
  timeLimits: TimeLimit[];
}

