import { MetadataStore } from 'breeze-client';

import { Category } from './category';
import { Comment } from './comment';
import { Customer } from './customer';
import { Employee } from './employee';
import { EmployeeTerritory } from './employee-territory';
import { InternationalOrder } from './international-order';
import { Order } from './order';
import { OrderDetail } from './order-detail';
import { PreviousEmployee } from './previous-employee';
import { Product } from './product';
import { Region } from './region';
import { Role } from './role';
import { Supplier } from './supplier';
import { Territory } from './territory';
import { TimeGroup } from './time-group';
import { TimeLimit } from './time-limit';
import { UnusualDate } from './unusual-date';
import { User } from './user';
import { UserRole } from './user-role';
import { Location } from './location';

export class NorthwindIBRegistrationHelper {

    static register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('Category', Category);
        metadataStore.registerEntityTypeCtor('Comment', Comment);
        metadataStore.registerEntityTypeCtor('Customer', Customer);
        metadataStore.registerEntityTypeCtor('Employee', Employee);
        metadataStore.registerEntityTypeCtor('EmployeeTerritory', EmployeeTerritory);
        metadataStore.registerEntityTypeCtor('InternationalOrder', InternationalOrder);
        metadataStore.registerEntityTypeCtor('Order', Order);
        metadataStore.registerEntityTypeCtor('OrderDetail', OrderDetail);
        metadataStore.registerEntityTypeCtor('PreviousEmployee', PreviousEmployee);
        metadataStore.registerEntityTypeCtor('Product', Product);
        metadataStore.registerEntityTypeCtor('Region', Region);
        metadataStore.registerEntityTypeCtor('Role', Role);
        metadataStore.registerEntityTypeCtor('Supplier', Supplier);
        metadataStore.registerEntityTypeCtor('Territory', Territory);
        metadataStore.registerEntityTypeCtor('TimeGroup', TimeGroup);
        metadataStore.registerEntityTypeCtor('TimeLimit', TimeLimit);
        metadataStore.registerEntityTypeCtor('UnusualDate', UnusualDate);
        metadataStore.registerEntityTypeCtor('User', User);
        metadataStore.registerEntityTypeCtor('UserRole', UserRole);
        metadataStore.registerEntityTypeCtor('Location', Location);
    }
}
