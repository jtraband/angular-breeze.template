// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Order } from './order';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Customer extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  customerID: string;
  address: string;
  city: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  country: string;
  customerID_OLD: string;
  fax: string;
  phone: string;
  postalCode: string;
  region: string;
  rowVersion: number;
  orders: Order[];
}

