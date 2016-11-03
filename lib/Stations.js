function Station(id, zones, triplog) {
  this.id = id;
  this.zones = zones;
  this.triplog = triplog;
}

Station.prototype.getZones = function () {
  return this.zones;
};

Station.prototype.requestEntryWithCard = function (x) {
  return this.triplog.beginTravel(x, this);
};

Station.prototype.requestExitWithCard = function (x) {
  return this.triplog.endTravel(x, this);
};

module.exports = (triplog) =>
  [
    ['Holborn',       [1]],
    ['Earl’s Court',  [1, 2]],
    ['Wimbledon',     [3]],
    ['Hammersmith',   [2]],
  ].reduce((x, s) => {
    x[s[0]] = new Station(s[0], s[1], triplog);
    return x;
  }, {});
