class Station {
  constructor (id, zones, triplog) {
    this.id = id;
    this.zones = zones;
    this.triplog = triplog;
  }

  requestEntryWithCard (x) {
    return this.triplog.beginTravel(x, this);
  }

  requestExitWithCard (x) {
    return this.triplog.endTravel(x, this);
  }
};

const stations = (triplog) =>
  [
    ['Holborn',       [1]],
    ['Earl’s Court',  [1, 2]],
    ['Wimbledon',     [3]],
    ['Hammersmith',   [2]],
  ].reduce((x, s) => {
    x[s[0]] = new Station(s[0], s[1], triplog);
    return x;
  }, {});

module.exports = stations;
