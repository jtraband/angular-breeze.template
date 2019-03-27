// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Order } from './order';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class InternationalOrder extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  orderID: number;
  customsDescription: string;
  exciseTax: number;
  rowVersion: number;
  order: Order;
}

