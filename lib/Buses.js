class Bus {
  constructor (id, triplog) {
    this.id = id;
    this.zones = ['bus'];
    this.triplog = triplog;
  }

  requestEntryWithCard (x) {
    var canTravel = this.triplog.beginTravel(x, this);

    if (canTravel) {
      this.triplog.endTravel(x, this);
    }

    return canTravel;
  }
};

const buses = (triplog) =>
  [ '328' ].reduce((x, b) => (x[b] = new Bus(b, triplog)) && x, {});

module.exports = buses;
