function Bus(id, triplog) {
  this.id = id;
  this.zones = ['bus'];
  this.triplog = triplog;
}

Bus.prototype.getZones = function () {
  return this.zones;
};

Bus.prototype.requestEntryWithCard = function (x) {
  var canTravel = this.triplog.beginTravel(x, this);

  if (canTravel) {
    this.triplog.endTravel(x, this);
  }

  return canTravel;
};

module.exports = Bus;
