import * as moment from 'moment-mini';
import * as _ from 'lodash';

export class UtilFns {
  static NullDate = new Date(0);

  static forceLoseFocus() {
    const activeElement = document.activeElement;
    if (activeElement) {
      (activeElement as any).blur();
    }
  }

  static addClass(element: HTMLElement | JQuery, className: string) {
    const el = element as any;
    if (el.addClass) {
      el.addClass(className);
    } else if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  static removeClass(element: HTMLElement | JQuery, className: string) {
    const el = element as any;
    if (el.removeClass) {
      el.removeClass(className);
    } else if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  static setHtml(element: HTMLElement | JQuery, html: string) {
    const el = element as any;
    if (el.html) {
      (el as JQuery).html(html);
    } else {
      (el as HTMLElement).innerHTML = html;
    }
  }

  // static toLocalDate(date: Date) {
  // // fix utc date from calendar back to local date
  //   date.setUTCHours(date.getHours());
  //   date.setUTCMinutes(date.getMinutes());
  // }

  // Array of dates between two dates including endpoints.
  static getDatesBetween(startDate, stopDate) {
    const dates = [];
    let beginDate = moment(startDate);
    const endDate =  moment(stopDate);
    while (beginDate <= endDate) {
        dates.push( beginDate.toDate());
        beginDate = beginDate.add(1, 'days');
    }
    return dates;
  }

  static startOfDay(date: Date): Date {
    return moment(date).startOf('day').toDate();
  }

  static endOfDay(date: Date): Date {
    return moment(date).endOf('day').toDate();
  }

  static startOfMonth(date: Date): Date {
    return  moment(date).startOf('month').toDate();
  }

  static endOfMonth(date: Date): Date {
    // return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return  moment(date).endOf('month').toDate();
  }

  // duration is from moment - looks like '5 days' or '1 month'
  static dateAdd(date: Date, num: any, type: string): Date {
    return moment(date).add(num, type).toDate();
  }

  /** format 05/08/17 */
  static fmtDate(date: Date, zeroDisplay = '') {
    if (!moment.isDate(date)) { return ''; };
    if (date.getTime() === 0) { return zeroDisplay; }
    return moment(date).format('MM/DD/YY');
  }

  /** format 5/8/17 */
  static fmtDateShort(date: Date, zeroDisplay = '') {
    if (!moment.isDate(date)) { return ''; };
    if (date.getTime() === 0) { return zeroDisplay; }
    return moment(date).format('M/D/YY');
  }

  /** format 05/08/2017 */
  static fmtDate4(date: Date, zeroDisplay = '') {
    if (!moment.isDate(date)) { return ''; };
    if (date.getTime() === 0) { return zeroDisplay; }
    return moment(date).format('MM/DD/YYYY');
  }

  /** format 5/8/2017 */
  static fmtDate4Short(date: Date, zeroDisplay = '') {
    if (!moment.isDate(date)) { return ''; };
    if (date.getTime() === 0) { return zeroDisplay; }
    return moment(date).format('M/D/YYYY');
  }

  /** format 5/8/2017 9:07:08 PM Pacific Daylight Time */
  static fmtDateTimeTimeZone(date: Date) {
    if (!moment.isDate(date)) { return ''; };
    const options = { timeZoneName: 'long'};
    return date.toLocaleString('en-US', options);
  }

  /** format October 2017 */
  static fmtDateMonthYear(date: Date) {
    if (!moment.isDate(date)) { return ''; };
    return moment(date).format('MMMM YYYY');
  }

  /** format 9:06 PM */
  static fmtTime(date: Date, zeroDisplay = '') {
    if (!moment.isDate(date)) { return ''; };
    if (date.getTime() === 0) { return zeroDisplay; }
    return moment(date).format('h:mm A');
  }

  static fmtInt(amt: number) {
    if (!(typeof amt === 'number')) { return ''; }
    return amt.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }

  static fmtIntZ(amt: number) {
    if (amt == null || amt === 0) { return ''; }
    return this.fmtInt(amt);
  }

  static fmtCurrency(amt: number, decimalDigits = 2) {
    if (!(typeof amt === 'number')) { return ''; }
    return '$' + amt.toFixed(decimalDigits).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }

  // A here stands for 'A'counting format i.e. negatives with ().
  static fmtCurrencyA(amt: number, decimalDigits = 2) {
    const val = amt < 0 ? amt * -1 : amt;
    const tmp = this.fmtCurrency(val, decimalDigits);
    // last char in line below is actually a nbsp char - i.e. Alt + 255 NOT a blank
    // The is needed to allow currency formatting of negative numbers to align with positives.
    // return amt < 0 ? '(' + tmp + ')' : ' ' + tmp + ' ';
    // ABOVE REMOVED in favor of style that reduces padding-right
    return amt < 0 ? '(' + tmp + ')' : ' ' + tmp;
  }

  // M here stands for Minus format i.e. negatives with - before the $.
  static fmtCurrencyM(amt: number, decimalDigits = 2) {
    const val = amt < 0 ? amt * -1 : amt;
    const tmp = this.fmtCurrency(val, decimalDigits);
    // last char in line below is actually a nbsp char - i.e. Alt + 255 NOT a blank
    // The is needed to allow currency formatting of negative numbers to align with positives.
    // return amt < 0 ? '- ' + tmp : ' ' + tmp;
    // ABOVE REMOVED since it seems unnecessary and causes problems with export
    return amt < 0 ? '- ' + tmp : tmp;
  }

  static fmtCurrencyAZ(amt: number, decimalDigits = 2) {
    if (amt == null || amt === 0) { return ''; }
    return this.fmtCurrencyA(amt, decimalDigits);
  }

  static fmtCurrencyK(amt: number, decimalDigits = 0) {
    if (amt > 1E6) {
      return UtilFns.fmtCurrency(amt / 1E6, decimalDigits + 1) + 'M';
    } else {
      return UtilFns.fmtCurrency(amt / 1000, decimalDigits) + 'K';
    }
  }

  static fmtCurrencyShort(amt: number, decimalDigits = 0) {
    if (!(typeof amt === 'number')) { return ''; }
    let amount = amt;
    let suffix = '';
    if (amount > 1000000) {
      amount = amount / 1000000; suffix = 'M';
    } else if (amount > 1000) {
      amount = amount / 1000; suffix = 'K';
    }
    return '$' + amount.toFixed(decimalDigits).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + suffix;
  }

  static fmtPct(amt: number, decimalDigits = 0) {
    if (!(typeof amt === 'number')) { return ''; }
    if (Number.isNaN(amt)) { return ''; }
    return (amt * 100).toFixed(decimalDigits) + '%';
  }

  static fmtPctZ(amt: number, decimalDigits = 0) {
    if (!(typeof amt === 'number')) { return ''; }
    if (Number.isNaN(amt)) { return ''; }
    if (amt === 0) { return ''; };
    return (amt * 100).toFixed(decimalDigits) + '%';
  }

  static dateDiff(d1: Date, d2: Date, difType: moment.unitOfTime.Diff = 'days') {
    if (d1 == null || d2 == null) { return null; }
    return moment(d2).diff(moment(d1), difType);
  }

  static maxDate(d1: Date | null, d2: Date | null) {
    if (d1 == null || d1 === UtilFns.NullDate) { return d2; }
    if (d2 == null || d2 === UtilFns.NullDate) { return d1; }
    return d1 > d2 ? d1 : d2;
  }

  static minDate(d1: Date | null, d2: Date | null) {
    if (d1 == null || d1 === UtilFns.NullDate) { return d2; }
    if (d2 == null || d2 === UtilFns.NullDate) { return d1; }
    return d1 < d2 ? d1 : d2;
  }

  // static toServerDate(date: Date) {
  //   if (!date) { return date; }
  //   // _fromServer is e.g. '2013-06-02T12:00:00.000-07:00'; see entity-manager-provider.ts#46
  //   let s = date['_fromServer'] as string;
  //   if (!s || s.length < 29) { return date; } // no time zone
  //   s = s.substring(0, 23);
  //   const date2 = new Date(s);
  //   return date2;
  // }

  static toZeroDate(date: Date) {
    if (date == null) { return date; }
    const newDate = new Date(date);
    // newDate.setUTCHours(date.getHours());
    newDate.setHours(0,0,0,0);
    return newDate;
  }

  static areEqual(d1: Date, d2: Date) {
    if (!d1 || !d2) { 
      return false;
    }
    return d1.getTime() === d2.getTime();
  }

  static getPropertyDescriptor(obj: Object, propName: string) {
    const descr = Object.getOwnPropertyDescriptor(obj, propName);
    if (descr != null) { return descr; }
    obj = Object.getPrototypeOf(obj);
    if (obj == null) { return null;  }
    return this.getPropertyDescriptor(obj, propName);
  }

  static getSettableKeys(obj: object, endsWith: string[]) {
    const keys = _.keysIn(obj).filter(kn => {
      if (endsWith.some(ew => _.endsWith(kn, ew))) {
        const propDescr = UtilFns.getPropertyDescriptor(obj, kn);
        return propDescr != null && ( propDescr.writable || propDescr.set != null);
      }
    });
    return keys;
  }

  static getErrorMessage(error) {
    if (!error) {
      return 'Unknown error';
    } else if (typeof error === 'string') {
      return error;
    } else if (error.status === 0) {
      return 'Unable to contact server';
    } else {
      let msg = error.exceptionMessage || error.statusText || error.message || error.error_description;
      if (msg) {
        if (msg.indexOf('EntityErrorsException') >= 0) {
          return 'Validation errors received from server';
        }
        return msg;
      } else {
        error = (error.json && error.json()) || error;
        msg = error.exceptionMessage || error.message || error.error_description ||
          (error.toString && error.toString());
        return msg || JSON.stringify(error);
      }
    }
  }

  // static magnitude(val: number) {
  //   const order = Math.floor(Math.log(val) / Math.LN10
  //                      + 0.000000001); // because float math sucks like that
  //   return Math.pow(10, order);
  // }

  // static fmtCurrencyKShort(amt: number) {
  //   if (amt >= 1E9) {
  //     const suffix = 'B';
  //     const formattedAmount = amt / 1E9;
  //     const decimalDigits = this.calcDigits(formattedAmount,suffix);
  //     return UtilFns.fmtCurrency(formattedAmount, decimalDigits) + suffix;
  //   } else if (amt >= 1E6) {
  //     const suffix = 'M';
  //     const formattedAmount = amt / 1E6;
  //     const decimalDigits = this.calcDigits(formattedAmount, suffix);
  //     return UtilFns.fmtCurrency(formattedAmount, decimalDigits) + suffix;
  //   } else {
  //     const suffix = 'K';
  //     const formattedAmount = amt / 1000;
  //     const decimalDigits = this.calcDigits(formattedAmount, suffix);
  //     return UtilFns.fmtCurrency(formattedAmount, decimalDigits) + suffix;
  //   }
  // }

  // private static calcDigits(amount: number, suffix: string): number {
  //   let decimalDigits = suffix === 'K' ? 2 : 1;
  //   if (amount >= 10 || amount <= -10) { decimalDigits = 1; }
  //   if (amount >= 100 || amount <= -100) { decimalDigits = 0; }
  //   if (decimalDigits === 2) {
  //     if ((amount * 100) % 10 === 0) {
  //       decimalDigits = 1;
  //     } else if ((amount * 10) % 10 === 0) {
  //       decimalDigits = 0;
  //     }
  //   }
  //   if (decimalDigits === 1) {
  //     if ((amount * 10) % 10 === 0) {
  //       decimalDigits = 0;
  //     }
  //   }
  //   return decimalDigits;
  // }

}
