// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { Category } from './category';
import { Supplier } from './supplier';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Product extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  productID: number;
  categoryID: number;
  discontinued: boolean;
  discontinuedDate: Date;
  productName: string;
  quantityPerUnit: string;
  reorderLevel: number;
  rowVersion: number;
  supplierID: number;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
  category: Category;
  supplier: Supplier;
}

