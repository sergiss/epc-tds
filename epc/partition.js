/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

const { Segment } = require('./segment');

class Partition {
		
	 constructor(offset, bits1, digits1, bits2, digits2) {
		this.a = new Segment(offset, bits1, digits1);
		this.b = new Segment(this.a.end, bits2, digits2);
	}

}

module.exports = { Partition };