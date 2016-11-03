function Trip(zones, fare, current) {
  this.zones = zones;
  this.fare = fare;
  this.current = current || true;
}

Trip.prototype.getZones = function () {
  return this.zones;
};

Trip.prototype.getAmount = function () {
  return -1 * this.fare;
};

Trip.prototype.isCurrent = function () {
  return this.current;
};

Trip.prototype.complete = function (fare) {
  if (!this.current) {
    return;
  }

  this.fare = fare;
  this.current = false;
};

function Credit(n) {
  this.credit = n;
}

Credit.prototype.getAmount = function () {
  return this.credit;
};

function TripLog(fareCalculator) {
  this.log = {};
  this.fares = fareCalculator;
}

TripLog.prototype.getBalance = function (x) {
  return (this.log[x.getId()] || []).reduce((a, b) => a + b.getAmount(), 0);
};

TripLog.prototype.getCurrentTrip = function (x) {
  return (this.log[x.getId()] || []).filter((y) => y.isCurrent && y.isCurrent()).pop();
};

TripLog.prototype.addCredit = function (x, n) {
  var id = x.getId();

  (this.log[id] = this.log[id] || []).push(new Credit(n));

  return n;
};

TripLog.prototype.beginTravel = function (x, s) {
  var id = x.getId();

  var b = this.getBalance(x);
  if (b < this.fares.getMaxFare(s.getZones())) {
    return false;
  }

  var trip = new Trip(s.getZones(), this.fares.getMaxFare(s.getZones()));
  (this.log[id] = this.log[id] || []).push(trip);

  return true;
};

TripLog.prototype.endTravel = function (x, s) {
  var id = x.getId();
  var last = this.getCurrentTrip(x);

  if (last) {
    last.complete(this.fares.getFare(last.getZones(), s.getZones()));
  } else {
    return this.beginTravel(x, s);
  }

  return true;
};

module.exports = TripLog;
