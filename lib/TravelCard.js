function TravelCard(id) {
  this.id = id;
}

TravelCard.prototype.getId = function () {
  return this.id;
};

module.exports = TravelCard;
