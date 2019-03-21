export class PrintFns {

  private static printFn: () => void;
  private static subscribed: boolean;

  /** Provide function to call before print */
  static setPrintFn(callback: () => void) {
    PrintFns.printFn = callback;
    PrintFns.preparePrinting();
  }

  /** Function called before printing */
  private static beforePrint() {
    if (PrintFns.printFn) {
      PrintFns.printFn();
    }
  }

  /** Set up listeners to handle print event (ctrl-P printing) */
  private static preparePrinting() {
    if (PrintFns.subscribed) {
      return;
    }

    if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                PrintFns.beforePrint();
            }
        });
    }

    window.onbeforeprint = PrintFns.beforePrint;
    PrintFns.subscribed = true;
  }

  static print() {
    try {
      window.print()
    } finally {
      const printEle = document.getElementById('printSection');
      if (printEle) {
        printEle.parentElement.removeChild(printEle);
      }
    }
  }

  static printElement(ele: HTMLElement) {

    const printSelectEle = this.getPrintSection();
    const eleClone = ele.cloneNode(true);
    printSelectEle.appendChild(eleClone);
  }

  /** Print a DxDataGrid across multiple pages by reorganizing its elements.
   * The header, rows, and footer of a DxDataGrid are each in separate tables.
   * This function puts them all in one table for printing, because then the browser
   * prints <thead> elements on every page automatically.
   * @param ele: the parent element of the grid element (from ElementRef of component) */
  static printDxGrid(el: HTMLElement, headingSelector = 'app-report-header') {
    const titles = $(el).find(headingSelector).find('.card-title, .card-subtitle').not('.no-print');
    const summary = $(el).find('.card-deck').clone();

    const grid = $(el).find('dx-data-grid');
    if (!grid.length) { return; }

    // get rows from the grid sections
    const headrows = grid.find('div.dx-datagrid-headers tbody tr').clone();
    headrows.children('td').replaceWith(function() {
      // replace the header td with th, else browser won't print on every page
      // preserve colspan and rowspan
      const td = $(this);
      const colspan = td.attr('colspan');
      const rowspan = td.attr('rowspan');
      const tdstyle = td.attr('style');
      const th = '<th' +
        (colspan ? ' colspan="' + colspan + '"' : '') +
        (rowspan ? ' rowspan="' + rowspan + '"' : '') +
        (tdstyle ? ' style="' + tdstyle + '"' : '') +
        '>';
      return th + $(this).text() + '</th>';
    });
    const bodyrows = grid.find('div.dx-datagrid-rowsview tbody tr').clone();
    const footrows = grid.find('div.dx-datagrid-total-footer tbody tr').clone();

    // clear the print section
    const printEle = this.getPrintSection();
    printEle.innerHTML = '';

    // create table and add rows
    const titleHtml = titles.map(function() { return this.outerHTML }).get().join('');
    const table = $(printEle).append('<table class="grid-print"><thead><tr>' +
    '<th colspan="100" style="text-align: center">' + titleHtml +
    '</th></thead><tbody/><tfoot style="display:table-row-group;" /></table>').children('table');

    table.children('thead').append(headrows);
    table.children('tbody').append(bodyrows);
    table.children('tfoot').append(footrows);

    if (summary.length) {
      $(printEle).append(summary);
    }

  }

  /** Find or create or find an element with an id of 'printSection'
   * printSection is styled in the css to print properly.
   */
  private static getPrintSection() {
    let printSelectEle = document.getElementById('printSection');
    if (printSelectEle) {
      printSelectEle.innerHTML = '';
    } else {
      printSelectEle = document.createElement('div');
      printSelectEle.id = 'printSection';
      document.body.appendChild(printSelectEle);
    }
    return printSelectEle;
  }

}
