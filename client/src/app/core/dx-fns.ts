import { UtilFns } from './util-fns';
import * as moment from 'moment-mini';

export class DxFns {
  static fmtDateCell(cell, zeroDisplay = '') {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtDate(cell.value, zeroDisplay);
  }

  static fmtDateCellNoDash(cell, zeroDisplay = '') {
    if (cell.value == null) { return ''; }
    return UtilFns.fmtDate(cell.value, zeroDisplay);
  }

  static fmtCurrencyCellNoDash(cell) {
    if (cell.value == null) { return ''; }
    return UtilFns.fmtCurrency(cell.value);
  }

  static fmtCurrencyCell(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtCurrency(cell.value);
  }

  static fmtCurrencyACell(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtCurrencyA(cell.value);
  }

  static fmtCurrencyAZCell(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtCurrencyAZ(cell.value);
  }

  static fmtPctCell(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtPct(cell.value);
  }

  static fmtPctCell2(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtPct(cell.value, 2);
  }

  static fmtIntCell(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtInt(cell.value);
  }

  static fmtIntCellNoDash(cell) {
    if (cell.value == null) { return ''; }
    return UtilFns.fmtInt(cell.value);
  }

  static fmtIntZCell(cell) {
    if (cell.value == null) { return '-'; }
    return UtilFns.fmtIntZ(cell.value);
  }

  /** Scroll to selected row in DxGrid.  Call from onSelectionChanged event.
   * Only seems to work if grid has been clicked once already.
   * See https://www.devexpress.com/Support/Center/Question/Details/T187463/dxdatagrid-how-to-scroll-to-the-selected-row
   */
  static scrollToSelectedRow(options) {
      const scrollable = options.component.getView('rowsView')._scrollable;
      const selectedRowElements = options.component.element().find('tr.dx-selection');
      scrollable.scrollToElement(selectedRowElements);
  }

  /** convert dxTextBox input to 2 fixed decimal places.  Use in (onInitialized) and (onValueChanged) */
  static fmtCurrencyTextBox(event) {
    const num = + event.value || event.component.option('value');
    if (!Number.isFinite(num)) { return; }
    const val = num.toFixed(2);
    event.component.option('value', val);
  }

  /** Shift datagrid search box to left side of toolbar.  Usage: (onToolbarPreparing)="DxFns.shiftSearchPanel($event)" */
  static shiftSearchPanel(e) {
    const toolbarItems = e.toolbarOptions.items;
    // const searchPanel: any = $.grep(toolbarItems, item => (<any>item).name === 'searchPanel');
    const searchPanel: any = toolbarItems.filter(item => (<any>item).name === 'searchPanel');
    if (searchPanel.length) {
      searchPanel[0].location = 'before';
    }
  }

  /** return a DX formatter that shifts dates by the offset # of minutes */
  static makeDateOffsetFormat(offset?: number): DxFormat {
    offset = offset === undefined ? 480 : offset;
    return {
      formatter: (date: Date) => {
        date = moment(date).add(offset, 'minutes').toDate();
        const month = date.getMonth() + 1,
          day = date.getDate(),
          year = date.getFullYear();

        const s = day + '/' + month + '/' + year;
        return s;
      },
      parser: (s: string) => {
        const parts = s.split('/'),
          month = Number(parts[1]) - 1,
          day = Number(parts[0]),
          year = Number(parts[2]);

        const date = new Date(year, month, day);
        const date2 = moment(date).subtract(offset, 'minutes').toDate();
        return date2;
      }
    };
  }
}

export class DxFormat {
  formatter: (value: any) => string;
  parser: (str: string) => any;
}
