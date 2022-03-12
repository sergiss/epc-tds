/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

class Segment {

  constructor(offset, bits, digits) {
    this.start    = offset;
    this.end      = offset + bits;
    this.digits   = digits;
    this.maxValue = Math.pow(10, digits) - 1; // Max value in n digits
  }

}

module.exports = { Segment };