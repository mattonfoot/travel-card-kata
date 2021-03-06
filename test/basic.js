const should = require('chai').should();
const TravelCard = require('../lib/TravelCard.js');
const TripLog = require('../lib/TripLog.js');
const buses = require('../lib/Buses.js');
const stations = require('../lib/Stations.js');
const FareCalculator = require('../lib/FareCalculator.js');

describe('A fare calculator', function () {

  it('will charge £2.50 for travel around "Anywhere in Zone 1"', function () {
    var fc = new FareCalculator();

    fc.fare([1], [1]).should.equal(2.50);
    fc.fare([1], [1, 2]).should.equal(2.50);
    fc.fare([1], [2]).should.not.equal(2.50);
    fc.fare([2], [2]).should.not.equal(2.50);
    fc.fare([1], [3]).should.not.equal(2.50);
    fc.fare([2], [3]).should.not.equal(2.50);
  });

  it('will charge £2.00 for travel around "Any one zone outside zone 1"', function () {
    var fc = new FareCalculator();

    fc.fare([1], [1]).should.not.equal(2.00);
    fc.fare([1], [1, 2]).should.not.equal(2.00);
    fc.fare([1], [2]).should.not.equal(2.00);
    fc.fare([2], [2]).should.equal(2.00);
    fc.fare([1], [3]).should.not.equal(2.00);
    fc.fare([2], [3]).should.not.equal(2.00);
  });

  it('will charge £3.00 for travel around "Any two zones including zone 1"', function () {
    var fc = new FareCalculator();

    fc.fare([1], [1]).should.not.equal(3.00);
    fc.fare([1], [1, 2]).should.not.equal(3.00);
    fc.fare([1], [2]).should.equal(3.00);
    fc.fare([2], [2]).should.not.equal(3.00);
    fc.fare([1], [3]).should.not.equal(3.00);
    fc.fare([2], [3]).should.not.equal(2.00);
  });

  it('will charge £2.25 for travel around "Any two zones excluding zone 1"', function () {
    var fc = new FareCalculator();

    fc.fare([1], [1]).should.not.equal(2.25);
    fc.fare([1], [1, 2]).should.not.equal(2.25);
    fc.fare([1], [2]).should.not.equal(2.25);
    fc.fare([2], [2]).should.not.equal(2.25);
    fc.fare([1], [3]).should.not.equal(2.25);
    fc.fare([2], [3]).should.equal(2.25);
  });

  it('will charge £3.20 for travel around "Any three zones"', function () {
    var fc = new FareCalculator();

    fc.fare([1], [1]).should.not.equal(3.20);
    fc.fare([1], [1, 2]).should.not.equal(3.20);
    fc.fare([1], [2]).should.not.equal(3.20);
    fc.fare([2], [2]).should.not.equal(3.20);
    fc.fare([1], [3]).should.equal(3.20);
    fc.fare([2], [3]).should.not.equal(3.20);
  });

});

describe('A travel card', function () {

  it('will start with no credit', function () {
    var card = new TravelCard('no-credit');
    var triplog = new TripLog();

    triplog.getBalance(card).should.equal(0);
  });

  it('can be credited', function () {
    var card = new TravelCard('with-credit');
    var triplog = new TripLog();

    var credit = 10.00;

    triplog.addCredit(card, credit);

    triplog.getBalance(card).should.equal(credit);
  });

  it('can be debited', function () {
    var card = new TravelCard('with-debit');
    var triplog = new TripLog(new FareCalculator());
    var station = stations(triplog).Holborn;

    var credit = 10.00;

    triplog.addCredit(card, credit);
    triplog.beginTravel(card, station);

    triplog.getBalance(card).should.be.lessThan(credit);
  });

  it('cannot be used to find another accounts balance', function () {
    var cardA = new TravelCard('credit-5');
    var cardB = new TravelCard('credit-10');
    var triplog = new TripLog();

    triplog.addCredit(cardA, 5.00);
    triplog.addCredit(cardB, 5.00);
    triplog.addCredit(cardB, 5.00);

    triplog.getBalance(cardA).should.equal(5.00);
    triplog.getBalance(cardB).should.equal(10.00);
  });

});

describe('A travel card with no credit', function () {

  it('will not be allowed entry to a station', function () {
    var card = new TravelCard('no-credit');
    var triplog = new TripLog(new FareCalculator());
    var station = stations(triplog).Holborn;

    station.requestEntryWithCard(card).should.equal(false);
  });

  it('will not be charged', function () {
    var card = new TravelCard('no-credit-2');
    var triplog = new TripLog(new FareCalculator());
    var station = stations(triplog).Holborn;

    station.requestEntryWithCard(card).should.equal(false);
    triplog.getBalance(card).should.equal(0);
  });

});

describe('A travel card with less credit than the maximum fare', function () {

  it('will not be allowed entry to a station', function () {
    var card = new TravelCard('credit-2');
    var triplog = new TripLog(new FareCalculator());
    var station = stations(triplog).Holborn;

    triplog.addCredit(card, 2.00);
    station.requestEntryWithCard(card).should.equal(false);
  });

  it('will not be charged', function () {
    var card = new TravelCard('credit-1');
    var triplog = new TripLog(new FareCalculator());
    var station = stations(triplog).Holborn;

    triplog.addCredit(card, 1.00);
    var startingBalance = triplog.getBalance(card);

    station.requestEntryWithCard(card).should.equal(false);
    triplog.getBalance(card).should.equal(startingBalance);
  });

});

describe('A travel card with more credit than the maximum fare', function () {

  it('will be allowed entry to a station', function () {
    var card = new TravelCard('credit-30');
    var triplog = new TripLog(new FareCalculator());
    var station = stations(triplog).Holborn;

    triplog.addCredit(card, 30.00);

    station.requestEntryWithCard(card).should.equal(true);
  });

  it('will be charged the maximum fare on entry', function () {
    var card = new TravelCard('credit-15');
    var fc = new FareCalculator();
    var triplog = new TripLog(fc);
    var station = stations(triplog).Holborn;

    triplog.addCredit(card, 15.00);
    var startingBalance = triplog.getBalance(card);

    station.requestEntryWithCard(card).should.equal(true);
    triplog.getBalance(card).should.equal(startingBalance - fc.maxFare());
  });

  it('will be charged the correct fare on exit', function () {
    var card = new TravelCard('credit-12');
    var triplog = new TripLog(new FareCalculator());
    var stationA = stations(triplog).Holborn;
    var stationB = stations(triplog)['Earl’s Court'];

    triplog.addCredit(card, 12.00);
    var startingBalance = triplog.getBalance(card);

    stationA.requestEntryWithCard(card).should.equal(true);
    stationB.requestExitWithCard(card).should.equal(true);
    triplog.getBalance(card).should.equal(startingBalance - 2.50);
  });

});

describe('A travel card that hasn\'t been used at an entry gate', function () {

  it('will be charged the maximum fare on exit', function () {
    var card = new TravelCard('credit-17');
    var fc = new FareCalculator();
    var triplog = new TripLog(fc);
    var station = stations(triplog).Holborn;

    triplog.addCredit(card, 17.00);
    var startingBalance = triplog.getBalance(card);

    station.requestExitWithCard(card).should.equal(true);
    triplog.getBalance(card).should.equal(startingBalance - fc.maxFare());
  });

});

describe('A travel card used on a bus', function () {

  it('will be charged the same for each journey', function () {
    var card = new TravelCard('credit-4');
    var triplog = new TripLog(new FareCalculator());
    var bus = buses(triplog)['328'];

    triplog.addCredit(card, 4.00);
    var startingBalance = triplog.getBalance(card);
    var balanceAfterFirstTrip = startingBalance - 1.80;
    var balanceAfterSecondTrip = balanceAfterFirstTrip - 1.80;

    bus.requestEntryWithCard(card).should.equal(true);
    triplog.getBalance(card).should.equal(balanceAfterFirstTrip);
    bus.requestEntryWithCard(card).should.equal(true);
    triplog.getBalance(card).should.equal(balanceAfterSecondTrip);
  });

});

describe('A user loading a card with £30', function () {
  var expected = 30.00 - 2.50 - 1.80 - 2.00;

  it('will be charged £' + expected + ' for three seperate journeys', function () {
    var card = new TravelCard('credit-three-trips');
    var triplog = new TripLog(new FareCalculator());
    var holborn = stations(triplog).Holborn;
    var earlsCourt = stations(triplog)['Earl’s Court'];
    var bus = buses(triplog)['328'];
    var hammersmith = stations(triplog).Hammersmith;

    triplog.addCredit(card, 30.00);
    holborn.requestEntryWithCard(card);
    earlsCourt.requestExitWithCard(card);
    bus.requestEntryWithCard(card);
    earlsCourt.requestEntryWithCard(card);
    hammersmith.requestExitWithCard(card);

    triplog.getBalance(card).should.equal(expected);
  });

});
