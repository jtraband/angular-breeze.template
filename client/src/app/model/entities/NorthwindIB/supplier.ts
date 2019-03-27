// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Product } from './product';
import { Location } from './location';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Supplier extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  supplierID: number;
  companyName: string;
  contactName: string;
  contactTitle: string;
  fax: string;
  homePage: string;
  phone: string;
  rowVersion: number;
  location: Location;
  products: Product[];
}

