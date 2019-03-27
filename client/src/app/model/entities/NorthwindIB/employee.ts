// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from '../base-entity';
import { EmployeeTerritory } from './employee-territory';
import { Order } from './order';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Employee extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  employeeID: number;
  address: string;
  birthDate: Date;
  city: string;
  country: string;
  extension: string;
  firstName: string;
  fullName: string;
  hireDate: Date;
  homePhone: string;
  lastName: string;
  notes: string;
  photo: any;
  photoPath: string;
  postalCode: string;
  region: string;
  reportsToEmployeeID: number;
  rowVersion: number;
  title: string;
  titleOfCourtesy: string;
  directReports: Employee[];
  employeeTerritories: EmployeeTerritory[];
  manager: Employee;
  orders: Order[];
}

