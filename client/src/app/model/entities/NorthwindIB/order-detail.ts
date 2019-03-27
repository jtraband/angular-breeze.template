// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Order } from './order';
import { Product } from './product';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class OrderDetail extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  orderID: number;
  productID: number;
  discount: number;
  quantity: number;
  rowVersion: number;
  unitPrice: number;
  order: Order;
  product: Product;
}

