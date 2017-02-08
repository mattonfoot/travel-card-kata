const arrayIntersect = (a, b) => {
  var t;
  if (b.length > a.length) {
    t = b;
    b = a;
    a = t;
  }

  return a.filter((e) => b.indexOf(e) !== -1);
};

const fares = [
  {
    label: 'Anywhere in Zone 1',
    pattern: function (a, b) {
      return ~(a || []).indexOf(1) && ~(b || []).indexOf(1);
    },

    fare: 2.50,
  },
  {
    label: 'Any one zone outside zone 1',
    pattern: function (a, b) {
      var c = arrayIntersect((a || []).filter((x) => x !== 1), (b || []).filter((x) => x !== 1));
      return c.length > 0;
    },

    fare: 2.00,
  },
  {
    label: 'Any two zones including zone 1',
    pattern: function (a, b) {
      var c = [].concat(a || [], b || []);
      return ~c.indexOf(1) && ~c.indexOf(2);
    },

    fare: 3.00,
  },
  {
    label: 'Any two zones excluding zone 1',
    pattern: function (a, b) {
      var c = [].concat(a || [], b || []);
      return ~c.indexOf(2) && ~c.indexOf(3);
    },

    fare: 2.25,
  },
  {
    label: 'Any three zones',
    pattern: function (a, b) {
      var c = [].concat(a || [], b || []);
      return ~c.indexOf(1) && ~c.indexOf(3);
    },

    fare: 3.20,
  },
  {
    label: 'Any bus journey',
    pattern: function (a, b) {
      return ~[].concat(a || [], b || []).indexOf('bus');
    },

    fare: 1.80,
  },
];

class FareCalculator {

  maxFare (z) {
    return ~(z || []).indexOf('bus') ? 1.80 : 3.20;
  }

  fare (a, b) {
    var match = fares.filter((x) => x.pattern(a, b))
                .sort((a, b) => a.fare < b.fare)
                .pop();

    return match ? match.fare : this.getMaxFare();
  }
};

module.exports = FareCalculator;
