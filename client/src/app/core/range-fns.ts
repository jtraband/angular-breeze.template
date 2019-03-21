export class RangeFns {

  /** Break string into groups of chars: letters, numbers, other.
   * E.g. 'aa100-b4' => ['aa', '100', '-', 'b', '4']
   */
  static splitGroups(input: string): string[] {
    // break string into groups of letters, numbers, other
    const regex = /([a-zA-Z]*)([0-9]*)([^a-zA-Z0-9]*)/g;
    const ar = [];
    let matches;
    while ((matches = regex.exec(input)) && matches.length && matches[0].length) {
      for (let i = 1; i < matches.length; i++) {
        if (matches[i].length) {
          ar.push(matches[i]);
        }
      }
    }
    return ar;
  }

  /** Find the difference between two strings and return an object representing that range */
  static parseRange(r1: string, r2: string) {
    const a1 = RangeFns.splitGroups(r1);
    const a2 = RangeFns.splitGroups(r2);

    if (!a1.length || a1.length !== a2.length) {
      return null; // not a range spec we can handle
    }

    let prefix = '', suffix = '';
    let start = '', end = '';
    let foundDiff = false;

    for (let i = 0; i < a1.length; i++) {
      if (a1[i] === a2[i] || foundDiff) {
        if (foundDiff) {
          suffix += a1[i];
        } else {
          prefix += a1[i];
        }
      } else {
        start = a1[i];
        end = a2[i];
        foundDiff = true;
      }
    }

    return {
      prefix: prefix,
      suffix: suffix,
      start: start,
      end: end
    }
  }

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /** Get the next string in the sequence a, b, ...z, aa, ab, ... */
  private static nextChar(c): string {
    const u = c.toUpperCase();
    const isLower = (u !== c);
    let ret: string;
    if (this.same(u, 'Z')) {
      let txt = '';
      let i = u.length;
      while (i--) {
        txt += 'A';
      }
      ret = (txt + 'A');
    } else {
      let p = '';
      let q = '';
      if (u.length > 1) {
        p = u.substring(0, u.length - 1);
        q = String.fromCharCode(p.slice(-1).charCodeAt(0));
      }
      const l = u.slice(-1).charCodeAt(0);
      const z = this.nextLetter(l);
      if (z === 'A') {
        ret = p.slice(0, -1) + this.nextLetter(q.slice(-1).charCodeAt(0)) + z;
      } else {
        ret = p + z;
      }
    }
    if (isLower) { ret = ret.toLowerCase(); }
    return ret;
  }

  private static nextLetter(l): string {
    if (l < 90) {
      return String.fromCharCode(l + 1);
    } else {
      return 'A';
    }
  }

  private static same(str, char): boolean {
    let i = str.length;
    while (i--) {
      if (str[i] !== char) {
        return false;
      }
    }
    return true;
  }

  /** generate an array of strings incrementing from start to end.
   * if start is numeric, then generates a numeric sequence
   * if start is alpha, then generates a an alphabetical sequence
   */
  static getSequence(start: string, end: string): string[] {
    const a = [];
    let i = 0;
    if (this.isNumeric(start)) {
      let n = +start;
      const e = +end;
      while (n <= e && i < 1000) {
        i++;
        a.push('' + n++);
      }
    } else {
      let s = start;
      while (s <= end && i < 576) {
        i++;
        a.push(s);
        s = this.nextChar(s);
      }
    }
    return a;
  }

}
