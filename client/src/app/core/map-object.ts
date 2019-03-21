import { NamingConvention } from 'breeze-client';
import * as _ from 'lodash';

/**
* Maps the keys and values of a JSON object. Keys will be converted to camelCase and values will be parsed

* @param obj
*/
export function mapObject<T extends {}>(obj: T, customizer?: (key: string, value: any) => any): T {
    obj = <T>_.mapKeys(obj, (value, key, obj2) => NamingConvention.camelCase.serverPropertyNameToClient(key));
    obj = <T>_.mapValues(obj, (value, key, obj2) => {
        return customizer ? customizer(key, value) || mapValue(value) : mapValue(value);
    });
    return obj;
}

function mapValue(value: any): any {
    if (value === null || value === undefined) { return value };

    if (typeof value === 'string') {
        return tryParseBool(value) || tryParseNumber(value) || tryParseDate(value) || value;
    }

    if (Array.isArray(value)) {
        return value.map(item => mapValue(item));
    }

    if (typeof value === 'object') {
        return mapObject(value);
    }

    return value;
}

function tryParseDate(value: string): Date {
    const date = new Date(value);
    return isFinite(date.getTime()) ? date : null;
}

function tryParseBool(value: string): boolean {
    if (value.toLowerCase() === 'true') { return true };
    if (value.toLowerCase() === 'false') { return false };
    return null;
}

function tryParseNumber(value: string): number {
    const num = +value;
    return isFinite(num) ? num : null;
}

