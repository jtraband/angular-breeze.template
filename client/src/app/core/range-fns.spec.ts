import { RangeFns } from './range-fns';


describe('RangeFns', () => {

  describe('getSequence', () => {

    it('handles 1..4', () => {
      const a = RangeFns.getSequence('1', '4');
      expect(a).toBeTruthy();
      expect(a.length).toEqual(4);
      expect(a[0]).toEqual('1');
      expect(a[1]).toEqual('2');
      expect(a[2]).toEqual('3');
      expect(a[3]).toEqual('4');
    });

    it('handles 9..12', () => {
      const a = RangeFns.getSequence('9', '12');
      expect(a).toBeTruthy();
      expect(a.length).toEqual(4);
      expect(a[0]).toEqual('9');
      expect(a[1]).toEqual('10');
      expect(a[2]).toEqual('11');
      expect(a[3]).toEqual('12');
    });

    it('handles A..D', () => {
      const a = RangeFns.getSequence('A', 'D');
      expect(a).toBeTruthy();
      expect(a.length).toEqual(4);
      expect(a[0]).toEqual('A');
      expect(a[1]).toEqual('B');
      expect(a[2]).toEqual('C');
      expect(a[3]).toEqual('D');
    });

    it('handles AY..BB', () => {
      const a = RangeFns.getSequence('AY', 'BB');
      expect(a).toBeTruthy();
      expect(a.length).toEqual(4);
      expect(a[0]).toEqual('AY');
      expect(a[1]).toEqual('AZ');
      expect(a[2]).toEqual('BA');
      expect(a[3]).toEqual('BB');
    });

    it('handles a..d', () => {
      const a = RangeFns.getSequence('a', 'd');
      expect(a).toBeTruthy();
      expect(a.length).toEqual(4);
      expect(a[0]).toEqual('a');
      expect(a[1]).toEqual('b');
      expect(a[2]).toEqual('c');
      expect(a[3]).toEqual('d');
    });

    it('handles ay..bb', () => {
      const a = RangeFns.getSequence('ay', 'bb');
      expect(a).toBeTruthy();
      expect(a.length).toEqual(4);
      expect(a[0]).toEqual('ay');
      expect(a[1]).toEqual('az');
      expect(a[2]).toEqual('ba');
      expect(a[3]).toEqual('bb');
    });

  });

  describe('parseRange', () => {

    it('handles 1..10', () => {
      const p = RangeFns.parseRange('1', '10');
      expect(p).toBeTruthy();
      expect(p.prefix).toEqual('');
      expect(p.suffix).toEqual('');
      expect(p.start).toEqual('1');
      expect(p.end).toEqual('10');
    });

    it('handles a1x..a10x', () => {
      const p = RangeFns.parseRange('a1x', 'a10x');
      expect(p).toBeTruthy();
      expect(p.prefix).toEqual('a');
      expect(p.suffix).toEqual('x');
      expect(p.start).toEqual('1');
      expect(p.end).toEqual('10');
    });

    it('handles a-1-x..a-10-x', () => {
      const p = RangeFns.parseRange('a-1-x', 'a-10-x');
      expect(p).toBeTruthy();
      expect(p.prefix).toEqual('a-');
      expect(p.suffix).toEqual('-x');
      expect(p.start).toEqual('1');
      expect(p.end).toEqual('10');
    });

    it('handles a10-a..a10-z', () => {
      const p = RangeFns.parseRange('a10-a', 'a10-z');
      expect(p).toBeTruthy();
      expect(p.prefix).toEqual('a10-');
      expect(p.suffix).toEqual('');
      expect(p.start).toEqual('a');
      expect(p.end).toEqual('z');
    });

  });

});

