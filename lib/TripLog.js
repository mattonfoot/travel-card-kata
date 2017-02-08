class Trip {
  constructor (zones, fare, current) {
    this.zones = zones;
    this.fare = fare;
    this.current = current || true;
  }

  get amount () {
    return -1 * this.fare;
  }

  get isCurrent () {
    return this.current;
  }

  complete (fare) {
    if (!this.current) {
      return;
    }

    this.fare = fare;
    this.current = false;
  }
};

class Credit {
  constructor (n) {
    this.credit = n;
  }

  get amount () {
    return this.credit;
  }
};

class TripLog {
  constructor (fareCalculator) {
    this.log = {};
    this.fares = fareCalculator;
  }

  getBalance (x) {
    return (this.log[x.id] || []).reduce((a, b) => a + b.amount, 0);
  };

  getCurrentTrip (x) {
    return (this.log[x.id] || []).filter((y) => (y instanceof Trip) && y.isCurrent).pop();
  };

  addCredit (x, n) {
    var id = x.id;

    (this.log[id] = this.log[id] || []).push(new Credit(n));

    return n;
  };

  beginTravel (x, s) {
    var id = x.id;

    var b = this.getBalance(x);
    if (b < this.fares.maxFare(s.zones)) {
      return false;
    }

    var trip = new Trip(s.zones, this.fares.maxFare(s.zones));
    (this.log[id] = this.log[id] || []).push(trip);

    return true;
  }

  endTravel (x, s) {
    var id = x.id;
    var last = this.getCurrentTrip(x);

    if (last) {
      last.complete(this.fares.fare(last.zones, s.zones));
    } else {
      return this.beginTravel(x, s);
    }

    return true;
  }
};

module.exports = TripLog;
