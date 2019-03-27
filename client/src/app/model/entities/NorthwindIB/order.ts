// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Customer } from './customer';
import { Employee } from './employee';
import { InternationalOrder } from './international-order';
import { OrderDetail } from './order-detail';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Order extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  orderID: number;
  customerID: string;
  employeeID: number;
  freight: number;
  orderDate: Date;
  requiredDate: Date;
  rowVersion: number;
  shipAddress: string;
  shipCity: string;
  shipCountry: string;
  shipName: string;
  shipPostalCode: string;
  shipRegion: string;
  shippedDate: Date;
  customer: Customer;
  employee: Employee;
  internationalOrder: InternationalOrder;
  orderDetails: OrderDetail[];
}

