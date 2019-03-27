// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { TimeGroup } from './time-group';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class TimeLimit extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  id: number;
  maxTime: string;
  minTime: string;
  timeGroupId: number;
  timeGroup: TimeGroup;
}

