/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

const { BitArray } = require('./utils/bit-array');

class Epc extends BitArray {

	static EPC_HEADER_OFFSET = 0;
	static EPC_HEADER_END    = 8;
	static FILTER_OFFSET     = 8;
	static FILTER_END        = 11;
	static FILTER_MAX_VALUE  = 7;

    constructor(length) {
        super(length);
    }

	clone() {
		throw new Error('Unimplemented method.');
	}

	getType() {
		throw new Error('Unimplemented method.');
	}

	toTagURI() {
        throw new Error('Unimplemented method.');
    }

	toIdURI() {
        throw new Error('Unimplemented method.');
    }

    toBarcode() {
        throw new Error('Unimplemented method.');
    }

    getTotalBits() {
        throw new Error('Unimplemented method.');
    }

    getHeader() {
        throw new Error('Unimplemented method.');
    }

    /**
	 * The filter value is additional control information that may be included in
	 * the EPC memory bank of a Gen 2 tag. The intended use of the filter value is
	 * to allow an RFID reader to select or deselect the tags corresponding to
	 * certain physical objects, to make it easier to read the desired tags in an
	 * environment where there may be other tags present in the environment
	 * @return
	 */
	getFilter() {
		return super.get(Epc.FILTER_OFFSET, Epc.FILTER_END);
	}
	
	/**
	 * 0.- All Others (see Section 10.1). 			  
	 * 1.- Point of Sale (POS) Trade Item .			  
	 * 2.- Full Case for Transport. 	        		  
	 * 3.- Reserved (see Section 10.1). 	    		  
	 * 4.- Inner Pack Trade Item Grouping for Handling.
	 * 5.- Reserved (see Section 10.1). 	               
	 * 6.- Unit Load. 	                               
	 * 7.- Unit inside Trade Item or component inside a
	 *     product not intended for individual sale.	
	 * @param value
	 */
	setFilter(value) {
		if (value < 0 || value > Epc.FILTER_MAX_VALUE) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Epc.FILTER_MAX_VALUE})`);
		}
		super.set(value, Epc.FILTER_OFFSET, Epc.FILTER_END);
		return this;
	}

	getSegment(segment) {
		return super.get(segment.start, segment.end);
	}

	setSegment(value, segment) {
		if (value < 0 || value > segment.maxValue) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${segment.maxValue})`);
		}
		super.set(value, segment.start, segment.end);
	}

	getSegmentString(segment) {
		return String(this.getSegment(segment)).padStart(segment.digits, '0');
	}

}

module.exports = { Epc }