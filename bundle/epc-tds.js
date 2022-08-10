require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * 96-bit Component / Part Identifier (CPI)
 * 
 * The Component / Part EPC identifier is designed for use by the technical industries (including the
 * automotive sector) for the unique identification of parts or components. 
 * 
 * Typical use: Technical industries (e.g. automotive ) - components and parts
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Cpi96 extends Epc {

	static EPC_HEADER = 0x3C;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 65;
	static SERIAL_END       = Cpi96.TOTAL_BITS;
	static SERIAL_BITS      = 31;
	static MAX_SERIAL       = Utils.getMaxValue(Cpi96.SERIAL_BITS);

	static TAG_URI = 'cpi-96';
	
	static TAG_URI_TEMPLATE = (filter, company, part, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${part}.${serial}`}; // F.C.P.S (Filter, Company, Part, Serial)
	static PID_URI_TEMPLATE = (company, part, serial) => {return `urn:epc:id:cpi:${company}.${part}.${serial}`}; // C.P.S   (Company, Part, Serial)

	// Partition table columns: Company prefix, Item Reference
	static PARTITIONS = [ new Partition(Cpi96.PARTITION_END, 40, 12, 11, 3),   // 0 40 12 11 3
						  new Partition(Cpi96.PARTITION_END, 37, 11, 14, 4),   // 1 37 11 14 4
						  new Partition(Cpi96.PARTITION_END, 34, 10, 17, 5),   // 2 34 10 17 5 
						  new Partition(Cpi96.PARTITION_END, 30,  9, 21, 6),   // 3 30 09 21 6 
						  new Partition(Cpi96.PARTITION_END, 27,  8, 24, 7),   // 4 27 08 24 7 
						  new Partition(Cpi96.PARTITION_END, 24,  7, 27, 8),   // 5 24 07 27 8 
						  new Partition(Cpi96.PARTITION_END, 20,  6, 31, 9) ]; // 6 20 06 31 9

	constructor(hexEpc) {	
		super(Cpi96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Cpi96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Cpi96().setFromBitArray(this);
	}

	getType() {
		return Type.GPI96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Cpi96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setPartReference(parseInt(data[2]));
				result.setSerial(parseInt(data[3]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.P.S (Filter, Company, Part, Serial)
		let partition = Cpi96.PARTITIONS[this.getPartition()];
		return Cpi96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b), this.getSerial());
	}

	toIdURI() { // C.P.S (Company, Part, Serial)
		let partition = Cpi96.PARTITIONS[this.getPartition()];
		return Cpi96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegment(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getCpi();
	}

	getTotalBits() {
		return Cpi96.TOTAL_BITS;
	}

	getHeader() {
		return Cpi96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Cpi96.PARTITION_OFFSET, Cpi96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Cpi96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Cpi96.PARTITIONS.length - 1})`);
		}
		super.set(value, Cpi96.PARTITION_OFFSET, Cpi96.PARTITION_END);
		return this;
	}

	getCpi() {
        let partition = Cpi96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let asset = super.getSegment(partition.b);
		return companyPrefix + asset;
	}

	setCpi(cpi) { // ean
        let partition = Cpi96.PARTITIONS[this.getPartition()];  
		super.setSegment(cpi.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(cpi.substring(partition.a.digits, tmp), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Cpi96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Cpi96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getPartReference() {
		return super.getSegment(Cpi96.PARTITIONS[this.getPartition()].b);
	}

	setPartReference(value) {
		super.setSegment(value, Cpi96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getSerial() {
		return super.get(Cpi96.SERIAL_OFFSET, Cpi96.SERIAL_END);
	}

	setSerial(value) {
		if(value > Cpi96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Cpi96.MAX_SERIAL})`);
		super.set(value, Cpi96.SERIAL_OFFSET, Cpi96.SERIAL_END);
		return this;
	}

}

module.exports = { Cpi96 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],2:[function(require,module,exports){
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
},{"./utils/bit-array":20}],3:[function(require,module,exports){
/**
 * 174-bit Global Document Type Identifier (GDTI)
 * 
 * The Global Document Type Identifier EPC scheme is used to assign a unique identity to 
 * a specific document, such as land registration papers, an insurance policy, and others.
 * 
 * Typical use: Document
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Gdti174 extends Epc {

	static EPC_HEADER = 0x3E;

	static TOTAL_BITS = 174;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 55;
	static SERIAL_END       = Gdti174.TOTAL_BITS;
	static SERIAL_BITS      = 119;
	static MAX_SERIAL_LEN   = 17;
	static CHAR_BITS = (Gdti174.SERIAL_END - Gdti174.SERIAL_OFFSET) / Gdti174.MAX_SERIAL_LEN; // 7

	static TAG_URI = "gdti-174";
	
	static TAG_URI_TEMPLATE = (filter, company, document, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${document}.${serial}`}; // F.C.D.S (Filter, Company, Document, Serial)
	static PID_URI_TEMPLATE = (company, document, serial) => {return `urn:epc:id:gdti:${company}.${document}.${serial}`}; // C.D.S   (Company, Document, Serial)

	// Partition table columns: Company prefix, Item Reference
	static PARTITIONS = [ new Partition(Gdti174.PARTITION_END, 40, 12,  1, 0),   // 0 40 12 01 0
						  new Partition(Gdti174.PARTITION_END, 37, 11,  4, 1),   // 1 37 11 04 1
						  new Partition(Gdti174.PARTITION_END, 34, 10,  7, 2),   // 2 34 10 07 2 
						  new Partition(Gdti174.PARTITION_END, 30,  9, 11, 3),   // 3 30 09 11 3 
						  new Partition(Gdti174.PARTITION_END, 27,  8, 14, 4),   // 4 27 08 14 4 
						  new Partition(Gdti174.PARTITION_END, 24,  7, 17, 5),   // 5 24 07 17 5 
						  new Partition(Gdti174.PARTITION_END, 20,  6, 21, 6) ]; // 6 20 06 21 6

	constructor(hexEpc) {	
		super(Gdti174.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Gdti174.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Gdti174().setFromBitArray(this);
	}

	getType() {
		return Type.Gdti174;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Gdti174();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setDocumentReference(parseInt(data[2]));
				result.setSerial(data[3]);
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.D.S (Filter, Company, Document, Serial)
		let partition = Gdti174.PARTITIONS[this.getPartition()];
		return Gdti174.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.D.S (Company, Document, Serial)
		let partition = Gdti174.PARTITIONS[this.getPartition()];
		return Gdti174.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getGdti();
	}

	getTotalBits() {
		return Gdti174.TOTAL_BITS;
	}

	getHeader() {
		return Gdti174.EPC_HEADER;
	}

	getPartition() {
		return super.get(Gdti174.PARTITION_OFFSET, Gdti174.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Gdti174.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Gdti174.PARTITIONS.length - 1})`);
		}
		super.set(value, Gdti174.PARTITION_OFFSET, Gdti174.PARTITION_END);
		return this;
	}

	getGdti() {
		let partition = Gdti174.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let document = super.getSegmentString(partition.b);		
        let result = companyPrefix + document;
		return result + Utils.computeCheckDigit(result) + this.getSerial();
	}

	setGdti(gdti) {
		let partition = Gdti174.PARTITIONS[this.getPartition()];  
		super.setSegment(gdti.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(gdti.substring(partition.a.digits, tmp), partition.b);
        this.setSerial(gdti.substring(tmp + 1, gdti.length));        
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Gdti174.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Gdti174.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getDocumentReference() {
		return super.getSegment(Gdti174.PARTITIONS[this.getPartition()].b);
	}

	setDocumentReference(value) {
		super.setSegment(value, Gdti174.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getSerial() {
		return super.getString(Gdti174.SERIAL_OFFSET, Gdti174.SERIAL_END, Gdti174.CHAR_BITS);
	}

	setSerial(value) {
		if(!value || value.length > Gdti174.MAX_SERIAL_LEN) throw new Error(`Value '${value}' length out of range (max length: ${Gdti174.MAX_SERIAL_LEN})`);
		super.setString(value, Gdti174.SERIAL_OFFSET, Gdti174.SERIAL_END, Gdti174.CHAR_BITS);
		return this;
	}

}

module.exports = { Gdti174 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],4:[function(require,module,exports){
/**
 * 96-bit Global Document Type Identifier (GDTI)
 * 
 * The Global Document Type Identifier EPC scheme is used to assign a unique identity to 
 * a specific document, such as land registration papers, an insurance policy, and others.
 * 
 * Typical use: Document
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Gdti96 extends Epc {

	static EPC_HEADER = 0x2C;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 55;
	static SERIAL_END       = Gdti96.TOTAL_BITS;
	static SERIAL_BITS      = 41;
	static MAX_SERIAL       = Utils.getMaxValue(Gdti96.SERIAL_BITS); // 2199023255551

	static TAG_URI = "gdti-96";
	
	static TAG_URI_TEMPLATE = (filter, company, document, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${document}.${serial}`}; // F.C.D.S (Filter, Company, Document, Serial)
	static PID_URI_TEMPLATE = (company, document, serial) => {return `urn:epc:id:gdti:${company}.${document}.${serial}`}; // C.D.S   (Company, Document, Serial)

	// Partition table columns: Company prefix, Item Reference
	static PARTITIONS = [ new Partition(Gdti96.PARTITION_END, 40, 12,  1, 0),   // 0 40 12 01 0
						  new Partition(Gdti96.PARTITION_END, 37, 11,  4, 1),   // 1 37 11 04 1
						  new Partition(Gdti96.PARTITION_END, 34, 10,  7, 2),   // 2 34 10 07 2 
						  new Partition(Gdti96.PARTITION_END, 30,  9, 11, 3),   // 3 30 09 11 3 
						  new Partition(Gdti96.PARTITION_END, 27,  8, 14, 4),   // 4 27 08 14 4 
						  new Partition(Gdti96.PARTITION_END, 24,  7, 17, 5),   // 5 24 07 17 5 
						  new Partition(Gdti96.PARTITION_END, 20,  6, 21, 6) ]; // 6 20 06 21 6

	constructor(hexEpc) {	
		super(Gdti96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Gdti96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Gdti96().setFromBitArray(this);
	}

	getType() {
		return Type.Gdti96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Gdti96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setDocumentReference(parseInt(data[2]));
				result.setSerial(parseInt(data[3]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.D.S (Filter, Company, Document, Serial)
		let partition = Gdti96.PARTITIONS[this.getPartition()];
		return Gdti96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.D.S (Company, Document, Serial)
		let partition = Gdti96.PARTITIONS[this.getPartition()];
		return Gdti96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getGdti();
	}

	getTotalBits() {
		return Gdti96.TOTAL_BITS;
	}

	getHeader() {
		return Gdti96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Gdti96.PARTITION_OFFSET, Gdti96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Gdti96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Gdti96.PARTITIONS.length - 1})`);
		}
		super.set(value, Gdti96.PARTITION_OFFSET, Gdti96.PARTITION_END);
		return this;
	}

	getGdti() {
		let partition = Gdti96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let document = super.getSegmentString(partition.b);		
        let result = companyPrefix + document;
		return result + Utils.computeCheckDigit(result) + this.getSerial();
	}

	setGdti(gdti) {
		let partition = Gdti96.PARTITIONS[this.getPartition()];  
		super.setSegment(gdti.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(gdti.substring(partition.a.digits, tmp), partition.b);
        this.setSerial(Number(gdti.substring(tmp + 1, gdti.length)));        
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Gdti96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Gdti96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getDocumentReference() {
		return super.getSegment(Gdti96.PARTITIONS[this.getPartition()].b);
	}

	setDocumentReference(value) {
		super.setSegment(value, Gdti96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getSerial() {
		return super.get(Gdti96.SERIAL_OFFSET, Gdti96.SERIAL_END);
	}

	setSerial(value) {
		if(value > Gdti96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gdti96.MAX_SERIAL})`);
		super.set(value, Gdti96.SERIAL_OFFSET, Gdti96.SERIAL_END);
		return this;
	}

}

module.exports = { Gdti96 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],5:[function(require,module,exports){
/**
 * 202-bit Global Individual Asset Identifier (GIAI)
 * 
 * The Global Individual Asset Identifier EPC scheme is used to assign a unique identity to a specific 
 * asset, such as a forklift or a computer.
 * 
 * Typical use: Fixed asset
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Giai202 extends Epc { // FIXME: incorrect asset reference

	static EPC_HEADER = 0x38;

	static TOTAL_BITS = 202;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;

	static TAG_URI = 'giai-202';
	
	static TAG_URI_TEMPLATE = (filter, company, asset) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${asset}`}; // F.C.A (Filter, Company, Asset)
	static PID_URI_TEMPLATE = (company, asset) => {return `urn:epc:id:giai:${company}.${asset}`}; // C.A (Company, Asset)

	// Partition table columns: Company prefix, Asset Type
	static PARTITIONS = [ new Partition(Giai202.PARTITION_END, 40, 12, 148, 18),   // 0 40 12 148 18
						  new Partition(Giai202.PARTITION_END, 37, 11, 151, 19),   // 1 37 11 151 19
						  new Partition(Giai202.PARTITION_END, 34, 10, 154, 20),   // 2 34 10 154 20 
						  new Partition(Giai202.PARTITION_END, 30,  9, 158, 21),   // 3 30 09 158 21 
						  new Partition(Giai202.PARTITION_END, 27,  8, 161, 22),   // 4 27 08 161 22 
						  new Partition(Giai202.PARTITION_END, 24,  7, 164, 23),   // 5 24 07 164 23 
						  new Partition(Giai202.PARTITION_END, 20,  6, 168, 24) ]; // 6 20 06 168 24

	constructor(hexEpc) {	
		super(Giai202.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Giai202.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Giai202().setFromBitArray(this);
	}

	getType() {
		return Type.GIAI202;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Giai202();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setAssetReference(parseInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.A (Filter, Company, Asset)
		let partition = Giai202.PARTITIONS[this.getPartition()];
		return Giai202.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b));
	}

	toIdURI() { // C.A (Company, Asset)
		let partition = Giai202.PARTITIONS[this.getPartition()];
		return Giai202.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegment(partition.b));
	}
	
	toBarcode() {
		return this.getGiai();
	}

	getTotalBits() {
		return Giai202.TOTAL_BITS;
	}

	getHeader() {
		return Giai202.EPC_HEADER;
	}

	getPartition() {
		return super.get(Giai202.PARTITION_OFFSET, Giai202.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Giai202.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Giai202.PARTITIONS.length - 1})`);
		}
		super.set(value, Giai202.PARTITION_OFFSET, Giai202.PARTITION_END);
		return this;
	}

	getGiai() {
		let partition = Giai202.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let asset = super.getSegment(partition.b);
		return  companyPrefix + asset;
	}

	setGiai(giai) {
		let partition = Giai202.PARTITIONS[this.getPartition()];  
		super.setSegment(giai.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(giai.substring(partition.a.digits, tmp), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Giai202.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Giai202.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getAssetReference() {
		return super.getSegment(Giai202.PARTITIONS[this.getPartition()].b);
	}

	setAssetReference(value) {
		super.setSegment(value, Giai202.PARTITIONS[this.getPartition()].b);
		return this;
	}

}

module.exports = { Giai202 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],6:[function(require,module,exports){
/**
 * 96-bit Global Individual Asset Identifier (GIAI)
 * 
 * The Global Individual Asset Identifier EPC scheme is used to assign a unique identity to a specific 
 * asset, such as a forklift or a computer.
 * 
 * Typical use: Fixed asset
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Giai96 extends Epc {

	static EPC_HEADER = 0x52;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;

	static TAG_URI = 'giai-96';
	
	static TAG_URI_TEMPLATE = (filter, company, asset) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${asset}`}; // F.C.A (Filter, Company, Asset)
	static PID_URI_TEMPLATE = (company, asset) => {return `urn:epc:id:giai:${company}.${asset}`}; // C.A (Company, Asset)

	// Partition table columns: Company prefix, Asset Type
	static PARTITIONS = [ new Partition(Giai96.PARTITION_END, 40, 12, 42, 13),   // 0 40 12 42 13
						  new Partition(Giai96.PARTITION_END, 37, 11, 45, 14),   // 1 37 11 45 14
						  new Partition(Giai96.PARTITION_END, 34, 10, 48, 15),   // 2 34 10 48 15 
						  new Partition(Giai96.PARTITION_END, 30,  9, 52, 16),   // 3 30 09 52 16 
						  new Partition(Giai96.PARTITION_END, 27,  8, 55, 17),   // 4 27 08 55 17 
						  new Partition(Giai96.PARTITION_END, 24,  7, 58, 18),   // 5 24 07 58 18 
						  new Partition(Giai96.PARTITION_END, 20,  6, 62, 19) ]; // 6 20 06 62 19

	constructor(hexEpc) {	
		super(Giai96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Giai96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Giai96().setFromBitArray(this);
	}

	getType() {
		return Type.GIAI96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Giai96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setAssetReference(parseInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.A (Filter, Company, Asset)
		let partition = Giai96.PARTITIONS[this.getPartition()];
		return Giai96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b));
	}

	toIdURI() { // C.A (Company, Asset)
		let partition = Giai96.PARTITIONS[this.getPartition()];
		return Giai96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegment(partition.b));
	}
	
	toBarcode() {
		return this.getGiai();
	}

	getTotalBits() {
		return Giai96.TOTAL_BITS;
	}

	getHeader() {
		return Giai96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Giai96.PARTITION_OFFSET, Giai96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Giai96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Giai96.PARTITIONS.length - 1})`);
		}
		super.set(value, Giai96.PARTITION_OFFSET, Giai96.PARTITION_END);
		return this;
	}

	getGiai() {
		let partition = Giai96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let asset = super.getSegment(partition.b);
		return companyPrefix + asset;
	}

	setGiai(giai) {
		let partition = Giai96.PARTITIONS[this.getPartition()];  
		super.setSegment(giai.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(giai.substring(partition.a.digits, tmp), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Giai96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Giai96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getAssetReference() {
		return super.getSegment(Giai96.PARTITIONS[this.getPartition()].b);
	}

	setAssetReference(value) {
		super.setSegment(value, Giai96.PARTITIONS[this.getPartition()].b);
		return this;
	}

}

module.exports = { Giai96 };

},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],7:[function(require,module,exports){
/**
 * 96-bit Serialised Global Trade Item Number (SGTIN)
 * 
 * The General Identifier EPC scheme is independent of any specifications or identity scheme outside
 * the EPCglobal Tag Data Standard.
 * 
 * Typical use: Unspecified
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 
class Gid96 extends Epc {

	static EPC_HEADER = 0x35;

	static TOTAL_BITS = 96;

    static MANAGER_OFFSET = 8;
	static MANAGER_END    = 36;
	static MANAGER_BITS   = 28;
	static MAX_MANAGER    = Utils.getMaxValue(Gid96.MANAGER_BITS);

	static CLASS_OFFSET   = 36;
	static CLASS_END      = 60;
	static CLASS_BITS     = 24;
	static MAX_CLASS      = Utils.getMaxValue(Gid96.CLASS_BITS);

	static SERIAL_OFFSET  = 60;
	static SERIAL_END     = Gid96.TOTAL_BITS;
	static SERIAL_BITS    = 36;
	static MAX_SERIAL     = Utils.getMaxValue(Gid96.SERIAL_BITS);

	static TAG_URI = 'gid-96';
	
	static TAG_URI_TEMPLATE = (manager, clazz, serial) => {return `urn:epc:tag:${this.TAG_URI}:${manager}.${clazz}.${serial}`}; // M.C.S (Manager, Class, Serial)
	static PID_URI_TEMPLATE = (manager, clazz, serial) => {return `urn:epc:id:gid:${manager}.${clazz}.${serial}`}; // M.C.S (Manager, Class, Serial)

	constructor(hexEpc) {	
		super(Gid96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Gid96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

    getFilter() {
        throw new Error('Unsupported method.');
    }

    setFilter() {
        throw new Error('Unsupported method.');
    }

	clone() {
		return new Gid96().setFromBitArray(this);
	}

	getType() {
		return Type.GID96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Gid96();
				result.setManager(parseInt(data[0]));
				result.setClass(parseInt(data[1]));
				result.setSerial(parseInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // M.C.S (Manager, Class, Serial)
		return Gid96.TAG_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
	}

	toIdURI() { // M.C.S (Manager, Class, Serial)
		return Gid96.PID_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
	}

	getTotalBits() {
		return Gid96.TOTAL_BITS;
	}

	getHeader() {
		return Gid96.EPC_HEADER;
	}

    getManager() {
        return super.get(Gid96.MANAGER_OFFSET, Gid96.MANAGER_END);
    }

    setManager(value) {
		if(value > Gid96.MAX_MANAGER) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gid96.MAX_MANAGER})`);
		super.set(value, Gid96.MANAGER_OFFSET, Gid96.MANAGER_END);
		return this;
    }

    getClass() {
        return super.get(Gid96.CLASS_OFFSET, Gid96.CLASS_END);
    }

    setClass(value) {
		if(value > Gid96.MAX_CLASS) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gid96.MAX_CLASS})`);
		super.set(value, Gid96.CLASS_OFFSET, Gid96.CLASS_END);
		return this;
    }

	getSerial() {
		return super.get(Gid96.SERIAL_OFFSET, Gid96.SERIAL_END);
	}

	setSerial(value) {
		if(value > Gid96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gid96.MAX_SERIAL})`);
		super.set(value, Gid96.SERIAL_OFFSET, Gid96.SERIAL_END);
		return this;
	}

}

module.exports = { Gid96 };

},{"../epc":2,"../type":19,"../utils/utils":21}],8:[function(require,module,exports){
/**
 * 170-bit Global Returnable Asset Identifier (GRAI)
 * 
 * The Global Returnable Asset Identifier EPC scheme is used to assign a unique identity to a specific 
 * returnable asset, such as a reusable shipping container or a pallet skid.
 * 
 * Typical use: Returnable/reusable asset
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Grai96 } = require('./grai96');
 
class Grai170 extends Epc {

	static EPC_HEADER = 0x37;

	static TOTAL_BITS = 170;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 58;
	static SERIAL_END       = Grai170.TOTAL_BITS;
	static SERIAL_BITS      = 112;
    static MAX_SERIAL_LEN   = 16;
	static CHAR_BITS = (Grai170.SERIAL_END - Grai170.SERIAL_OFFSET) / Grai170.MAX_SERIAL_LEN; // 7

	static TAG_URI = 'grai-170';
	
	static TAG_URI_TEMPLATE = (filter, company, asset, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${asset}.${serial}`}; // F.C.A.S (Filter, Company, AssetType, Serial)
	static PID_URI_TEMPLATE = (company, asset, serial) => {return `urn:epc:id:grai:${company}.${asset}.${serial}`}; // C.A.S   (Company, AssetType, Serial)

	constructor(hexEpc) {	
		super(Grai170.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Grai170.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Grai170().setFromBitArray(this);
	}

	getType() {
		return Type.GRAI170;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Grai170();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setAssetType(parseInt(data[2]));
				result.setSerial(data[3]);
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.I.S (Filter, Company, Asset Type, Serial)
		let partition = Grai96.PARTITIONS[this.getPartition()];
		return Grai170.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.I.S (Company, Asset Type, Serial)
		let partition = Grai96.PARTITIONS[this.getPartition()];
		return Grai170.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getGrai();
	}

	getTotalBits() {
		return Grai170.TOTAL_BITS;
	}

	getHeader() {
		return Grai170.EPC_HEADER;
	}

	getPartition() {
		return super.get(Grai170.PARTITION_OFFSET, Grai170.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Grai96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Grai96.PARTITIONS.length - 1})`);
		}
		super.set(value, Grai170.PARTITION_OFFSET, Grai170.PARTITION_END);
		return this;
	}

	getGrai() {
		let partition = Grai96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let assetType = super.getSegmentString(partition.b);		
        let result = companyPrefix + assetType;
		return result + Utils.computeCheckDigit(result) + this.getSerial();
	}

	setGrai(grai) {
		let partition = Grai96.PARTITIONS[this.getPartition()];  
		super.setSegment(grai.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(grai.substring(partition.a.digits, tmp), partition.b);
        this.setSerial(String(grai.substring(tmp + 1, grai.length)));      
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Grai96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Grai96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getAssetType() {
		return super.getSegment(Grai96.PARTITIONS[this.getPartition()].b);
	}

	setAssetType(value) {
		super.setSegment(value, Grai96.PARTITIONS[this.getPartition()].b);
		return this;
	}

    getSerial() {
		return super.getString(Grai170.SERIAL_OFFSET, Grai170.SERIAL_END, Grai170.CHAR_BITS);
	}

    /**
	* All values permitted by GS1 General Specifications (up to 16 alphanumeric characters)
	* @param value
	*/
	setSerial(value) {
		if(!value || value.length > Grai170.MAX_SERIAL_LEN) throw new Error(`Value '${value}' length out of range (max length: ${Grai170.MAX_SERIAL_LEN})`);
		super.setString(value, Grai170.SERIAL_OFFSET, Grai170.SERIAL_END, Grai170.CHAR_BITS);
        return this;
	}

}

module.exports = { Grai170 };

},{"../epc":2,"../type":19,"../utils/utils":21,"./grai96":9}],9:[function(require,module,exports){
/**
 * 96-bit Global Returnable Asset Identifier (GRAI)
 * 
 * The Global Returnable Asset Identifier EPC scheme is used to assign a unique identity to a specific 
 * returnable asset, such as a reusable shipping container or a pallet skid.
 * 
 * Typical use: Returnable/reusable asset
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Grai96 extends Epc {

	static EPC_HEADER = 0x33;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 58;
	static SERIAL_END       = Grai96.TOTAL_BITS;
	static SERIAL_BITS      = 38;
	static MAX_SERIAL       = Utils.getMaxValue(Grai96.SERIAL_BITS); // 274877906943

	static TAG_URI = 'grai-96';
	
	static TAG_URI_TEMPLATE = (filter, company, asset, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${asset}.${serial}`}; // F.C.A.S (Filter, Company, AssetType, Serial)
	static PID_URI_TEMPLATE = (company, asset, serial) => {return `urn:epc:id:grai:${company}.${asset}.${serial}`}; // C.A.S   (Company, AssetType, Serial)

	// Partition table columns: Company prefix, Asset Type
	static PARTITIONS = [ new Partition(Grai96.PARTITION_END, 40, 12,  4, 0),   // 0 40 12 04 0
						  new Partition(Grai96.PARTITION_END, 37, 11,  7, 1),   // 1 37 11 07 1
						  new Partition(Grai96.PARTITION_END, 34, 10, 10, 2),   // 2 34 10 10 2 
						  new Partition(Grai96.PARTITION_END, 30,  9, 14, 3),   // 3 30 09 14 3 
						  new Partition(Grai96.PARTITION_END, 27,  8, 17, 4),   // 4 27 08 17 4 
						  new Partition(Grai96.PARTITION_END, 24,  7, 20, 5),   // 5 24 07 20 5 
						  new Partition(Grai96.PARTITION_END, 20,  6, 24, 6) ]; // 6 20 06 24 6

	constructor(hexEpc) {	
		super(Grai96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Grai96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Grai96().setFromBitArray(this);
	}

	getType() {
		return Type.GRAI96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Grai96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setAssetType(parseInt(data[2]));
				result.setSerial(parseInt(data[3]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.I.S (Filter, Company, Asset Type, Serial)
		let partition = Grai96.PARTITIONS[this.getPartition()];
		return Grai96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.I.S (Company, Asset Type, Serial)
		let partition = Grai96.PARTITIONS[this.getPartition()];
		return Grai96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getGrai();
	}

	getTotalBits() {
		return Grai96.TOTAL_BITS;
	}

	getHeader() {
		return Grai96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Grai96.PARTITION_OFFSET, Grai96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Grai96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Grai96.PARTITIONS.length - 1})`);
		}
		super.set(value, Grai96.PARTITION_OFFSET, Grai96.PARTITION_END);
		return this;
	}

	getGrai() {
		let partition = Grai96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let assetType = super.getSegmentString(partition.b);		
        let result = companyPrefix + assetType;
		return result + Utils.computeCheckDigit(result) + this.getSerial();
	}

	setGrai(grai) {
		let partition = Grai96.PARTITIONS[this.getPartition()];  
		super.setSegment(grai.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(grai.substring(partition.a.digits, tmp), partition.b);
        this.setSerial(Number(grai.substring(tmp + 1, grai.length)));        
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Grai96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Grai96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getAssetType() {
		return super.getSegment(Grai96.PARTITIONS[this.getPartition()].b);
	}

	setAssetType(value) {
		super.setSegment(value, Grai96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getSerial() {
		return super.get(Grai96.SERIAL_OFFSET, Grai96.SERIAL_END);
	}

	setSerial(value) {
		if(value > Grai96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Grai96.MAX_SERIAL})`);
		super.set(value, Grai96.SERIAL_OFFSET, Grai96.SERIAL_END);
		return this;
	}

}

module.exports = { Grai96 };

},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],10:[function(require,module,exports){
/**
 * 96-bit Global Individual Asset Identifier – Recipient (GSRN)
 *  
 * The Global Service Relation Number EPC scheme is used to assign a unique identity to a service
 * recipient.
 * 
 * Typical use: Hospital admission or club membership
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Gsrn96 extends Epc {

	static EPC_HEADER = 0x2D;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;

	static TAG_URI = 'gsrn-96';
	
	static TAG_URI_TEMPLATE = (filter, company, service) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${service}`}; // F.C.S (Filter, Company, Service)
	static PID_URI_TEMPLATE = (company, asset) => {return `urn:epc:id:gsrn:${company}.${asset}`}; // C.S (Company, Service)

	// Partition table columns: Company prefix, Service Reference
	static PARTITIONS = [ new Partition(Gsrn96.PARTITION_END, 40, 12, 18, 5),    // 0 40 12 18 5
						  new Partition(Gsrn96.PARTITION_END, 37, 11, 21, 6),    // 1 37 11 21 6
						  new Partition(Gsrn96.PARTITION_END, 34, 10, 24, 7),    // 2 34 10 24 7 
						  new Partition(Gsrn96.PARTITION_END, 30,  9, 28, 8),    // 3 30 09 28 8 
						  new Partition(Gsrn96.PARTITION_END, 27,  8, 31, 9),    // 4 27 08 31 9 
						  new Partition(Gsrn96.PARTITION_END, 24,  7, 34, 10),   // 5 24 07 34 10 
						  new Partition(Gsrn96.PARTITION_END, 20,  6, 38, 11) ]; // 6 20 06 38 11

	constructor(hexEpc) {	
		super(Gsrn96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Gsrn96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Gsrn96().setFromBitArray(this);
	}

	getType() {
		return Type.GSRN96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Gsrn96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setServiceReference(parseInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.S (Filter, Company, Service)
		let partition = Gsrn96.PARTITIONS[this.getPartition()];
		return Gsrn96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b));
	}

	toIdURI() { // C.S (Company, Service))
		let partition = Gsrn96.PARTITIONS[this.getPartition()];
		return Gsrn96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegment(partition.b));
	}
	
	toBarcode() {
		return this.getGsrn();
	}

	getTotalBits() {
		return Gsrn96.TOTAL_BITS;
	}

	getHeader() {
		return Gsrn96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Gsrn96.PARTITION_OFFSET, Gsrn96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Gsrn96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Gsrn96.PARTITIONS.length - 1})`);
		}
		super.set(value, Gsrn96.PARTITION_OFFSET, Gsrn96.PARTITION_END);
		return this;
	}

	getGsrn() {
		let partition = Gsrn96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let service = super.getSegmentString(partition.b);
        let result = companyPrefix + service;
		return result + Utils.computeCheckDigit(result);
	}

	setGsrn(gsrn) {
		let partition = Gsrn96.PARTITIONS[this.getPartition()];  
		super.setSegment(gsrn.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(gsrn.substring(partition.a.digits, tmp), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Gsrn96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Gsrn96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getServiceReference() {
		return super.getSegment(Gsrn96.PARTITIONS[this.getPartition()].b);
	}

	setServiceReference(value) {
		super.setSegment(value, Gsrn96.PARTITIONS[this.getPartition()].b);
		return this;
	}

}

module.exports = { Gsrn96 };

},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],11:[function(require,module,exports){
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
},{"./segment":12}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
/**
 * 96-bit Serialised Global Coupon Number (SGCN)
 * 
 * The Global Coupon Number EPC scheme is used to assign a unique identity to a coupon.
 * 
 * Typical use: Coupon
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Sgcn96 extends Epc {

	static EPC_HEADER = 0x3F;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 55;
	static SERIAL_END       = Sgcn96.TOTAL_BITS;
	static SERIAL_BITS      = 41;
	static MAX_SERIAL       = Utils.getMaxValue(Sgcn96.SERIAL_BITS);

	static TAG_URI = "sgcn-96";
	
	static TAG_URI_TEMPLATE = (filter, company, coupon, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${coupon}.${serial}`}; // F.C.C.S (Filter, Company, Coupon, Serial)
	static PID_URI_TEMPLATE = (company, coupon, serial) => {return `urn:epc:id:sgcn:${company}.${coupon}.${serial}`}; // C.C.S   (Company, Coupon, Serial)

	// Partition table columns: Company prefix, Item Reference
	static PARTITIONS = [ new Partition(Sgcn96.PARTITION_END, 40, 12,  1, 0),   // 0 40 12 01 0
						  new Partition(Sgcn96.PARTITION_END, 37, 11,  4, 1),   // 1 37 11 04 1
						  new Partition(Sgcn96.PARTITION_END, 34, 10,  7, 2),   // 2 34 10 07 2 
						  new Partition(Sgcn96.PARTITION_END, 30,  9, 11, 3),   // 3 30 09 11 3 
						  new Partition(Sgcn96.PARTITION_END, 27,  8, 14, 4),   // 4 27 08 14 4 
						  new Partition(Sgcn96.PARTITION_END, 24,  7, 17, 5),   // 5 24 07 17 5 
						  new Partition(Sgcn96.PARTITION_END, 20,  6, 21, 6) ]; // 6 20 06 21 6

	constructor(hexEpc) {	
		super(Sgcn96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Sgcn96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Sgcn96().setFromBitArray(this);
	}

	getType() {
		return Type.Sgcn96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Sgcn96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setCouponReference(parseInt(data[2]));
				result.setSerial(parseInt(data[3]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.C.S (Filter, Company, Coupon, Serial)
		let partition = Sgcn96.PARTITIONS[this.getPartition()];
		return Sgcn96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.C.S (Company, Coupon, Serial)
		let partition = Sgcn96.PARTITIONS[this.getPartition()];
		return Sgcn96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getSgcn();
	}

	getTotalBits() {
		return Sgcn96.TOTAL_BITS;
	}

	getHeader() {
		return Sgcn96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Sgcn96.PARTITION_OFFSET, Sgcn96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Sgcn96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgcn96.PARTITIONS.length - 1})`);
		}
		super.set(value, Sgcn96.PARTITION_OFFSET, Sgcn96.PARTITION_END);
		return this;
	}

	getSgcn() {
		let partition = Sgcn96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
		let coupon = super.getSegmentString(partition.b);		
        let result = companyPrefix + coupon;
		return result + Utils.computeCheckDigit(result) + this.getSerial();
	}

	setSgcn(sgcn) {
		let partition = Sgcn96.PARTITIONS[this.getPartition()];  
		super.setSegment(sgcn.substring(0, partition.a.digits), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
		super.setSegment(sgcn.substring(partition.a.digits, tmp), partition.b);
        this.setSerial(sgcn.substring(tmp + 1, sgcn.length));        
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Sgcn96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Sgcn96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getCouponReference() {
		return super.getSegment(Sgcn96.PARTITIONS[this.getPartition()].b);
	}

	setCouponReference(value) {
		super.setSegment(value, Sgcn96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getSerial() {
		return super.get(Sgcn96.SERIAL_OFFSET, Sgcn96.SERIAL_END).toString().substring(1);
	}

	setSerial(value) {
		if(value > Sgcn96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgcn96.MAX_SERIAL})`);
		super.set(Number('1' + value), Sgcn96.SERIAL_OFFSET, Sgcn96.SERIAL_END);
		return this;
	}

}

module.exports = { Sgcn96 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],14:[function(require,module,exports){
/**
 * 96-bit Global Location Number With or Without Extension (SGLN)
 * 
 * The SGLN EPC scheme is used to assign a unique identity to a physical location, such as a specific
 * building or a specific unit of shelving within a warehouse.
 * 
 * Typical use: Location
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Sgln96 } = require('./sgln96');
 
class Sgln195 extends Epc {

	static EPC_HEADER = 0x39;

	static TOTAL_BITS = 195;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static EXTENSION_OFFSET = 55;
	static EXTENSION_END    = Sgln195.TOTAL_BITS;
	static EXTENSION_BITS   = 140;
	static MAX_EXTENSION_LEN = 20;
    static CHAR_BITS = (Sgln195.EXTENSION_END - Sgln195.EXTENSION_OFFSET) / Sgln195.MAX_EXTENSION_LEN;

	static TAG_URI = 'sgln-195';

	static TAG_URI_TEMPLATE = (filter, company, location, extension) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${location}.${extension}`}; // F.C.L.E (Filter, Company, Location, Extension)
	static PID_URI_TEMPLATE = (company, location, extension) => {return `urn:epc:id:sgln:${company}.${location}.${extension}`}; // C.L.E   (Company, Location, Extension)

	constructor(hexEpc) {	
		super(Sgln195.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Sgln195.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Sgln195().setFromBitArray(this);
	}

	getType() {
		return Type.SGLN195;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Sgln195();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompany(parseInt(data[1]));
				result.setLocation(parseInt(data[2]));
				result.setExtension(data[3]);
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.L.E (Filter, Company, Location, Extension)
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		return Sgln195.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
	}

	toIdURI() { // C.L.E   (Company, Location, Extension)
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		return Sgln195.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
	}
	
	toBarcode() {
		return this.getGln();
	}

	getTotalBits() {
		return Sgln195.TOTAL_BITS;
	}

	getHeader() {
		return Sgln195.EPC_HEADER;
	}

	getPartition() {
		return super.get(Sgln195.PARTITION_OFFSET, Sgln195.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Sgln96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgln96.PARTITIONS.length - 1})`);
		}
		super.set(value, Sgln195.PARTITION_OFFSET, Sgln195.PARTITION_END);
		return this;
	}

	getGln() {
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		let result = this.getSegmentString(partition.a) + this.getSegmentString(partition.b);
		return result + Utils.computeCheckDigit(result);
	}

	setGln(gln) { // ean
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		super.setSegment(gln.substring(0, partition.a.digits), partition.a);
		super.setSegment(Number(gln.substring(partition.a.digits, partition.a.digits + partition.b.digits)), partition.b);
		return this;
	}

	getCompany() {
		return super.getSegment(Sgln96.PARTITIONS[this.getPartition()].a);
	}

	setCompany(value) {
		super.setSegment(value, Sgln96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getLocation() {
		return super.getSegment(Sgln96.PARTITIONS[this.getPartition()].b);
	}

	setLocation(value) {
		super.setSegment(value, Sgln96.PARTITIONS[this.getPartition()].b);
		return this;
	}

    getExtension() {
		return super.getString(Sgln195.EXTENSION_OFFSET, Sgln195.EXTENSION_END, Sgln195.CHAR_BITS);
	}

    /**
	* All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
	* @param value
	*/
	setExtension(value) {
		if(!value || value.length > Sgln195.MAX_EXTENSION_LEN) throw new Error(`Value '${value}' length out of range (max length: ${Sgln195.MAX_EXTENSION_LEN})`);
		super.setString(value, Sgln195.EXTENSION_OFFSET, Sgln195.EXTENSION_END, Sgln195.CHAR_BITS);
        return this;
	}

}

module.exports = { Sgln195 };

},{"../epc":2,"../type":19,"../utils/utils":21,"./sgln96":15}],15:[function(require,module,exports){
/**
 * 96-bit Global Location Number With or Without Extension (SGLN)
 * 
 * The SGLN EPC scheme is used to assign a unique identity to a physical location, such as a specific
 * building or a specific unit of shelving within a warehouse.
 * 
 * Typical use: Location
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Sgln96 extends Epc {

	static EPC_HEADER = 0x32;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static EXTENSION_OFFSET = 55;
	static EXTENSION_END    = Sgln96.TOTAL_BITS;
	static EXTENSION_BITS   = 41;
	static MAX_EXTENSION    = Utils.getMaxValue(Sgln96.EXTENSION_BITS); // 274877906943

	static TAG_URI = 'sgln-96';
	
	static TAG_URI_TEMPLATE = (filter, company, location, extension) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${location}.${extension}`}; // F.C.L.E (Filter, Company, Location, Extension)
	static PID_URI_TEMPLATE = (company, location, extension) => {return `urn:epc:id:sgln:${company}.${location}.${extension}`}; // C.L.E   (Company, Location, Extension)

	// Partition table columns: Company prefix, Location Reference
	static PARTITIONS = [ new Partition(Sgln96.PARTITION_END, 40, 12,  1, 0),   // 0 40 12 01 0
                          new Partition(Sgln96.PARTITION_END, 37, 11,  4, 1),   // 1 37 11 04 1
                          new Partition(Sgln96.PARTITION_END, 34, 10,  7, 2),   // 2 34 10 07 2 
                          new Partition(Sgln96.PARTITION_END, 30,  9, 11, 3),   // 3 30 09 11 3 
                          new Partition(Sgln96.PARTITION_END, 27,  8, 14, 4),   // 4 27 08 14 4 
                          new Partition(Sgln96.PARTITION_END, 24,  7, 17, 5),   // 5 24 07 17 5 
                          new Partition(Sgln96.PARTITION_END, 20,  6, 21, 6) ]; // 6 20 06 21 6

	constructor(hexEpc) {	
		super(Sgln96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Sgln96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Sgln96().setFromBitArray(this);
	}

	getType() {
		return Type.SGLN96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Sgln96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompany(parseInt(data[1]));
				result.setLocation(parseInt(data[2]));
				result.setExtension(parseInt(data[3]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.L.E (Filter, Company, Location, Extension)
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		return Sgln96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
	}

	toIdURI() { // C.L.E   (Company, Location, Extension)
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		return Sgln96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
	}
	
	toBarcode() {
		return this.getGln();
	}

	getTotalBits() {
		return Sgln96.TOTAL_BITS;
	}

	getHeader() {
		return Sgln96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Sgln96.PARTITION_OFFSET, Sgln96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Sgln96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgln96.PARTITIONS.length - 1})`);
		}
		super.set(value, Sgln96.PARTITION_OFFSET, Sgln96.PARTITION_END);
		return this;
	}

	getGln() {
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		let result = this.getSegmentString(partition.a) + this.getSegmentString(partition.b);
		return result + Utils.computeCheckDigit(result);
	}

	setGln(gln) { // ean
		let partition = Sgln96.PARTITIONS[this.getPartition()];
		super.setSegment(gln.substring(0, partition.a.digits), partition.a);
		super.setSegment(Number(gln.substring(partition.a.digits, partition.a.digits + partition.b.digits)), partition.b);
		return this;
	}

	getCompany() {
		return super.getSegment(Sgln96.PARTITIONS[this.getPartition()].a);
	}

	setCompany(value) {
		super.setSegment(value, Sgln96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getLocation() {
		return super.getSegment(Sgln96.PARTITIONS[this.getPartition()].b);
	}

	setLocation(value) {
		super.setSegment(value, Sgln96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getExtension() {
		return super.get(Sgln96.EXTENSION_OFFSET, Sgln96.EXTENSION_END);
	}

	setExtension(value) {
		if(value > Sgln96.MAX_EXTENSION) throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgln96.MAX_EXTENSION})`);
		super.set(value, Sgln96.EXTENSION_OFFSET, Sgln96.EXTENSION_END);
		return this;
	}

}

module.exports = { Sgln96 };

},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],16:[function(require,module,exports){
/**
 * 198-bit Serialised Global Trade Item Number (SGTIN)
 * 
 * The Serialised Global Trade Item Number EPC scheme is used to assign a unique identity to an 
 * instance of a trade item, such as a specific instance of a product or SKU.
 * 
 * Typical use: Trade item
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Sgtin96 } = require('./sgtin96');

class Sgtin198 extends Epc {

	static EPC_HEADER = 0x36;

	static TOTAL_BITS       = 198;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 58;
	static SERIAL_END       = Sgtin198.TOTAL_BITS;
	static MAX_SERIAL_LEN   = 20;
	static CHAR_BITS = (Sgtin198.SERIAL_END - Sgtin198.SERIAL_OFFSET) / Sgtin198.MAX_SERIAL_LEN; // 7

	static TAG_URI = 'sgtin-198';
	
	static TAG_URI_TEMPLATE = (filter, company, item, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${item}.${serial}`}; // F.C.I.S (Filter, Company, Item, Serial)
	static PID_URI_TEMPLATE = (company, item, serial) => {return `urn:epc:id:sgtin:${company}.${item}.${serial}`}; // C.I.S   (Company, Item, Serial)

	constructor(hexEpc) {	
		super(Sgtin198.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Sgtin198.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Sgtin198().setFromBitArray(this);
	}

	getType() {
		return Type.SGTIN198;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Sgtin198();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setItemReference(parseInt(data[2]));
				result.setSerial(data[3]);
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.I.S (Filter, Company, Item, Serial)
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		return Sgtin198.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.I.S (Company, Item, Serial)
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		return Sgtin198.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getGtin();
	}

	getTotalBits() {
		return Sgtin198.TOTAL_BITS;
	}

	getHeader() {
		return Sgtin198.EPC_HEADER;
	}

	getPartition() {
		return super.get(Sgtin198.PARTITION_OFFSET, Sgtin198.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Sgtin96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgtin96.PARTITIONS.length - 1})`);
		}
		super.set(value, Sgtin96.PARTITION_OFFSET, Sgtin96.PARTITION_END);
        return this;
	}

	getGtin() {
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		let item = super.getSegmentString(partition.b);
		let result = item.substring(0, 1) + super.getSegmentString(partition.a) + item.substring(1);
		return result + Utils.computeCheckDigit(result);
	}

    setGtin(gtin) { // ean
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		super.setSegment(gtin.substring(1, partition.a.digits + 1), partition.a);
		super.setSegment(Number(gtin.charAt(0) + gtin.substring(partition.a.digits + 1, partition.a.digits + partition.b.digits)), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Sgtin96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Sgtin96.PARTITIONS[this.getPartition()].a);
        return this;
	}

	getItemReference() {
		return super.getSegment(Sgtin96.PARTITIONS[this.getPartition()].b);
	}

	setItemReference(value) {
		super.setSegment(value, Sgtin96.PARTITIONS[this.getPartition()].b);
        return this;
	}

	getSerial() {
		return super.getString(Sgtin198.SERIAL_OFFSET, Sgtin198.SERIAL_END, Sgtin198.CHAR_BITS);
	}

    /**
	* All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
	* @param value
	*/
	setSerial(value) {
		if(!value || value.length > Sgtin198.MAX_SERIAL_LEN) throw new Error(`Value '${value}' length out of range (max length: ${Sgtin198.MAX_SERIAL_LEN})`);
		super.setString(value, Sgtin198.SERIAL_OFFSET, Sgtin198.SERIAL_END, Sgtin198.CHAR_BITS);
        return this;
	}

}

module.exports = { Sgtin198 };

},{"../epc":2,"../type":19,"../utils/utils":21,"./sgtin96":17}],17:[function(require,module,exports){
/**
 * 96-bit Serialised Global Trade Item Number (SGTIN)
 * 
 * The Serialised Global Trade Item Number EPC scheme is used to assign a unique identity to an 
 * instance of a trade item, such as a specific instance of a product or SKU.
 * 
 * Typical use: Trade item
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Sgtin96 extends Epc {

	static EPC_HEADER = 0x30;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;
	static SERIAL_OFFSET    = 58;
	static SERIAL_END       = Sgtin96.TOTAL_BITS;
	static SERIAL_BITS      = 38;
	static MAX_SERIAL       = Utils.getMaxValue(Sgtin96.SERIAL_BITS); // 274877906943

	static TAG_URI = 'sgtin-96';
	
	static TAG_URI_TEMPLATE = (filter, company, item, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${item}.${serial}`}; // F.C.I.S (Filter, Company, Item, Serial)
	static PID_URI_TEMPLATE = (company, item, serial) => {return `urn:epc:id:sgtin:${company}.${item}.${serial}`}; // C.I.S   (Company, Item, Serial)

	// Partition table columns: Company prefix, Item Reference
	static PARTITIONS = [ new Partition(Sgtin96.PARTITION_END, 40, 12,  4, 1),   // 0 40 12 04 1
						  new Partition(Sgtin96.PARTITION_END, 37, 11,  7, 2),   // 1 37 11 07 2
						  new Partition(Sgtin96.PARTITION_END, 34, 10, 10, 3),   // 2 34 10 10 3 
						  new Partition(Sgtin96.PARTITION_END, 30,  9, 14, 4),   // 3 30 09 14 4 
						  new Partition(Sgtin96.PARTITION_END, 27,  8, 17, 5),   // 4 27 08 17 5 
						  new Partition(Sgtin96.PARTITION_END, 24,  7, 20, 6),   // 5 24 07 20 6 
						  new Partition(Sgtin96.PARTITION_END, 20,  6, 24, 7) ]; // 6 20 06 24 7

	constructor(hexEpc) {	
		super(Sgtin96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Sgtin96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Sgtin96().setFromBitArray(this);
	}

	getType() {
		return Type.SGTIN96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Sgtin96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setItemReference(parseInt(data[2]));
				result.setSerial(parseInt(data[3]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.I.S (Filter, Company, Item, Serial)
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		return Sgtin96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}

	toIdURI() { // C.I.S (Company, Item, Serial)
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		return Sgtin96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
	}
	
	toBarcode() {
		return this.getGtin();
	}

	getTotalBits() {
		return Sgtin96.TOTAL_BITS;
	}

	getHeader() {
		return Sgtin96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Sgtin96.PARTITION_OFFSET, Sgtin96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Sgtin96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgtin96.PARTITIONS.length - 1})`);
		}
		super.set(value, Sgtin96.PARTITION_OFFSET, Sgtin96.PARTITION_END);
		return this;
	}

	getGtin() {
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		let item = super.getSegmentString(partition.b);
		let result = item.substring(0, 1) + super.getSegmentString(partition.a) + item.substring(1);
		return result + Utils.computeCheckDigit(result);
	}

	setGtin(gtin) { // ean
		let partition = Sgtin96.PARTITIONS[this.getPartition()];
		super.setSegment(gtin.substring(1, partition.a.digits + 1), partition.a);
		super.setSegment(Number(gtin.charAt(0) + gtin.substring(partition.a.digits + 1, partition.a.digits + partition.b.digits)), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Sgtin96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Sgtin96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getItemReference() {
		return super.getSegment(Sgtin96.PARTITIONS[this.getPartition()].b);
	}

	setItemReference(value) {
		super.setSegment(value, Sgtin96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getSerial() {
		return super.get(Sgtin96.SERIAL_OFFSET, Sgtin96.SERIAL_END);
	}

	setSerial(value) {
		if(value > Sgtin96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Sgtin96.MAX_SERIAL})`);
		super.set(value, Sgtin96.SERIAL_OFFSET, Sgtin96.SERIAL_END);
		return this;
	}

}

module.exports = { Sgtin96 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],18:[function(require,module,exports){
/**
 * 96-bit Serial Shipping Container Code (SSCC)
 * 
 * The Serial Shipping Container Code EPC scheme is used to assign a unique identity to a logistics
 * handling unit, such as the aggregate contents of a shipping container or a pallet load.
 * 
 * Typical use: Pallet load or other logistics unit load
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 * 
 */

 const Utils = require('../utils/utils');
 const { Epc } = require('../epc');
 const { Type } = require('../type');
 const { Partition } = require('../partition');
 
class Sscc96 extends Epc {

	static EPC_HEADER = 0x31;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;

	static TAG_URI = 'sscc-96';

	static TAG_URI_TEMPLATE = (filter, company, serial) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${serial}`}; // F.C.S (Filter, Company, Serial)
	static PID_URI_TEMPLATE = (company, serial) => {return `urn:epc:id:sscc:${company}.${serial}`};                       // C.S   (Company, Serial)

	// Partition table columns: Company prefix, Serial Reference
	static PARTITIONS = [ new Partition(Sscc96.PARTITION_END, 40, 12, 18,  5),   // 0 40 12 18 05
						  new Partition(Sscc96.PARTITION_END, 37, 11, 21,  6),   // 1 37 11 21 06
						  new Partition(Sscc96.PARTITION_END, 34, 10, 24,  7),   // 2 34 10 24 07 
						  new Partition(Sscc96.PARTITION_END, 30,  9, 28,  8),   // 3 30 09 28 08 
						  new Partition(Sscc96.PARTITION_END, 27,  8, 31,  9),   // 4 27 08 31 09 
						  new Partition(Sscc96.PARTITION_END, 24,  7, 34, 10),   // 5 24 07 34 10 
						  new Partition(Sscc96.PARTITION_END, 20,  6, 38, 11) ]; // 6 20 06 38 11

	constructor(hexEpc) {	
		super(Sscc96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Sscc96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Sscc96().setFromBitArray(this);
	}

	getType() {
		return Type.SSCC96;
	}

	static fromTagURI(uri) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Sscc96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setSerialReference(parseInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.S (Filter, Company, Serial)
		let partition = Sscc96.PARTITIONS[this.getPartition()];
		return Sscc96.TAG_URI_TEMPLATE( this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b));
	}

	toIdURI() { // C.S   (Company, Serial)
		let partition = Sscc96.PARTITIONS[this.getPartition()];
		return Sscc96.PID_URI_TEMPLATE( this.getSegmentString(partition.a), this.getSegmentString(partition.b));
	}
	
	toBarcode() {
		return this.getSscc();
	}

	getTotalBits() {
		return Sscc96.TOTAL_BITS;
	}

	getHeader() {
		return Sscc96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Sscc96.PARTITION_OFFSET, Sscc96.PARTITION_END);
	}

	setPartition(value) {
		if (value < 0 || value >= Sscc96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Sscc96.PARTITIONS.length - 1})`);
		}
		super.set(value, Sscc96.PARTITION_OFFSET, Sscc96.PARTITION_END);
		return this;
	}

	getSscc() {
		let partition = Sscc96.PARTITIONS[this.getPartition()];
		let item = super.getSegmentString(partition.b);
		let result = item.substring(0, 1) + super.getSegmentString(partition.a) + item.substring(1);
		return result + Utils.computeCheckDigit(result);
	}

	setSscc(gtin) { // ean
		let partition = Sscc96.PARTITIONS[this.getPartition()];
		super.setSegment(gtin.substring(1, partition.a.digits + 1), partition.a);
		super.setSegment(Number(gtin.charAt(0) + gtin.substring(partition.a.digits + 1, partition.a.digits + partition.b.digits)), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Sscc96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value) {
		super.setSegment(value, Sscc96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getSerialReference() {
		return super.getSegment(Sscc96.PARTITIONS[this.getPartition()].b);
	}

	setSerialReference(value) {
		super.setSegment(value, Sscc96.PARTITIONS[this.getPartition()].b);
		return this;
	}

	getMaxSerialReference() {
		return Sscc96.PARTITIONS[this.getPartition()].b.maxValue;
	}

}

module.exports = { Sscc96 };
},{"../epc":2,"../partition":11,"../type":19,"../utils/utils":21}],19:[function(require,module,exports){
/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

class Type {

  static SGTIN96  = "SGTIN-96";
  static SGTIN198 = "SGTIN-198";
  static SSCC96   = "SSCC-96";
  static SGLN96   = "SGLN-96";
  static SGLN195  = "SGLN-195";
  static GRAI96   = "GRAI-96";
  static GRAI170  = "GRAI-170";
  static GID96    = "GID-96";
  static GIAI96   = "GIAI-96";
  static GIAI220  = "GIAI-220";
  static GSRN96   = "GSRN-96";
  static GPI96    = "GPI-96";
  static GDTI96   = "GDTI-96";
  static GDTI174  = "GDTI-174";
  static SGCN96   = "SGCN-96";

}

module.exports = { Type };
},{}],20:[function(require,module,exports){
/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

class BitArray {

  static REVERSE_HEX_CHARS = ['0','8','4','C','2','A','6','E','1','9','5' ,'D' ,'3' ,'B' ,'7' ,'F'];

  static REVERSE_DEC_TABLE = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                              -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                              -1,-1,-1,-1,-1,-1,-1,-1, 0,8,4,12,2,10,6,14,1,9,-1,-1,-1,-1,
                              -1,-1,-1,5,13,3,11,7,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                              -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,13,3,11,7,15,-1];

  constructor(length) {
    this.length = (length + 7) >> 3;
    this.data = [];
  }

  /**
   * Set selected bit
   * @param index
   */
  setBit(index) {
    this.data[index >> 3] |= 1 << (index & 7);
  }

  /**
   * Clear selected bit
   * @param index
   */
  clearBit(index) {
    this.data[index >> 3] &= ~(1 << (index & 7));
  }

  /**
   * Check if selected bit is set
   * @param offset
   * @return
   */
  isBit(index) {
    return (this.data[index >> 3] >> (index & 7)) & 0b1;
  }

  /**
   * Clear data of bit array.
   */
  clear() {
    for (let i = 0; i < this.length; i++) {
      this.data[i] = 0;
    }
  }

  set(value, startIndex, endIndex) {
    let v = BigInt(value);
    for (let i = 0n; startIndex < endIndex; i++) {
      endIndex--;
      if ((v >> i) & 0b1n) { // check bit
        this.setBit(endIndex);
      } else {
        this.clearBit(endIndex);
      }
    }
  }

  getBigInt(startIndex, endIndex) {
    let result = 0n;
    for (let i = 0n; startIndex < endIndex; i++) {
      if (this.isBit(--endIndex)) {
        result |= 1n << i; // set bit
      }
    }
    return result;
  }

  get(startIndex, endIndex) {
    return Number(this.getBigInt(startIndex, endIndex));
  }

  getSigned(startIndex, endIndex) {
    let i, result = 0n;
    for (i = 0n; startIndex < endIndex; i++) {
      if (this.isBit(--endIndex)) {
        result |= 1n << i; // set bit
      }
    }
    let mask = 1n << i - 1n;
    if (result & mask) { // check first bit
        result = (mask ^ result) - mask;
    }
    return Number(result);
  }

  setString(value, startIndex, endIndex, charBits) {
    for (let i = 0; i < value.length && (charBits = Math.min(charBits, endIndex - startIndex)) > 0; ++i) { // iterate bytes
      this.set(value.charCodeAt(i), startIndex, startIndex += charBits);
    }
    for (; startIndex < endIndex; ++startIndex) { // clear remaining bits
      this.clearBit(startIndex);
    }
  }

  /**
  * Return string from bit array
  * @param startIndex offset
  * @param endIndex last bit
  * @param charBits how many bits has stored in a byte (max 8 bits)
  * @return
  */
  getString(startIndex, endIndex, charBits) {
    let b, result = "";
    for (let i = 0; (charBits = Math.min(charBits, endIndex - startIndex)) > 0; ++i) { // iterate bytes
      if(b = this.get(startIndex, startIndex += charBits)) {
        result += String.fromCharCode(b);
      }
    }
    return result;
  } 

  /**
   * Return a hexadecimal string representation of the bit array.
   * @return hexadecimal base 16
   */
  toHexString() {
    let b, result = "";
    for (let i = 0; i < this.length; ++i) {
      b = this.data[i]; // iterate bytes
      result += BitArray.REVERSE_HEX_CHARS[b & 0xf] + BitArray.REVERSE_HEX_CHARS[(b & 0xf0) >> 4];
    }
    return result;
  }

  /**
   * Return a binary string representation of the bit array.
   * @return binary base 2
   */
  toBitString() {
    let b, result = "";
    for (let i = 0; i < this.length; ++i) {
      b = this.data[i]; // iterate bytes
      for (let j = 0; j < 8; ++j) {
        result += ((b >>> j) & 0b1) ? "1" : "0";
      }
    }
    return result;
  }

  setFromBitArray(bitArray) {
    this.data = [...bitArray.data];
    return this;
  }

  setFromHexString(hex) { 
    if (hex.length & 0b1) { // odd check
      hex = '0' + hex; // even hex
    }
    this.data = new Array(hex.length >> 1);
    for (let j = 0, i = 0; i < this.length; i++, j += 2) {
      this.data[i] = BitArray.REVERSE_DEC_TABLE[hex.charCodeAt(j)] | (BitArray.REVERSE_DEC_TABLE[hex.charCodeAt(j+1)] << 4)
    }
    return this;
  }

  not() {
    let result = new BitArray(this.length << 3);    
    for(let i = 0; i < result.data.length; ++i) {
        result.data[i] = ~this.data[i];
    }
    return result;
  }

  or(bitArray) {
    let result;
    if(bitArray.length > this.length) {
      result = new BitArray(bitArray.data.length << 3);
    } else {
      result = new BitArray(this.length << 3);
    }    
    for(let i = 0; i < result.data.length; ++i) {
      result.data[i] = bitArray.data[i] | this.data[i];
    }
    return result;
  }

  xor(bitArray) {
    let result;
    if(bitArray.length > this.length) {
      result = new BitArray(bitArray.data.length << 3);
    } else {
      result = new BitArray(this.length << 3);
    }    
    for(let i = 0; i < result.data.length; ++i) {
      result.data[i] = bitArray.data[i] ^ this.data[i];
    }
    return result;
  }

  and(bitArray) {
    let result;
    if(bitArray.length > this.length) {
      result = new BitArray(bitArray.data.length << 3);
    } else {
      result = new BitArray(this.length << 3);
    }    
    for(let i = 0; i < result.data.length; ++i) {
      result.data[i] = bitArray.data[i] & this.data[i];
    }
    return result;
  }

}

module.exports = { BitArray };

},{}],21:[function(require,module,exports){
/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

const HEX_TABLE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

const DEC_TABLE = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8, 
   9, -1, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, 
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
  -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];

const NUMBER_TABLE = [
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 00 - 09
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 10 - 19
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 20 - 29
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 30 - 39
    -1,-1,-1,-1,-1,-1,-1,-1, 0, 1, // 40 - 49
     2, 3, 4, 5, 6, 7, 8, 9,-1,-1  // 50 - 59
];

function computeCheckDigit(barcode) { // https://www.gs1.org/services/how-calculate-check-digit-manually

    // CHECK DIGIT										
    // GTIN-8                                          n01 n02 n03 n04 n05 n06 n07 | n08 
    // GTIN-12                         n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 | n12 
    // GTIN-13                     n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 | n13 
    // GTIN-14                 n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 | n14 
    // GSIN        n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 n14 n15 n16 | n17
    // SSCC    n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 n14 n15 n16 n17 | n18
    // ----------------------------------------------------------------------------------------
    // Mult     x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3
    
    let odd, even = 0;
    let i = barcode.length - 1;

    if (i & 0b1) { // even check
        odd = 0;
    } else {
        odd = NUMBER_TABLE[barcode.charCodeAt(0)];
    }
    // Multiply value of each position by x3, x1 and add results together to create sum
    for (; i > 0; i -= 2) {
        odd  += NUMBER_TABLE[barcode.charCodeAt(i    )];
        even += NUMBER_TABLE[barcode.charCodeAt(i - 1)];
    }
    // Subtract the sum from nearest equal or higher multiple of ten
    let result = (even + odd * 3) % 10; 
    if(result !== 0) {
      result = 10 - result;
    }  
    return result;
}

function getMaxValue(bits) {
    return Math.pow(2, bits) - 1;
}

function hexToByte(hex, offset) {
  return (DEC_TABLE[hex.charCodeAt(offset)] << 4) | DEC_TABLE[hex.charCodeAt(offset + 1)];
}

function randomEan(n) {
    let result = "";
    for (let i = 1; i < n; ++i) {
      result += Math.floor(Math.random() * 10);
    }
    return result + computeCheckDigit(result);
}

function randomHex(len) {
  let result = "";
  for (let i = 0; i < len; ++i) {
    result += HEX_TABLE[Math.floor(Math.random() * HEX_TABLE.length)];
  }
  return result;
}

module.exports = { getMaxValue, randomEan, randomHex, hexToByte, computeCheckDigit};
},{}],"epc-tds":[function(require,module,exports){
/*
 * EPC Tag Data Standard
 * 2021 Sergio S. - https://github.com/sergiss/epc-tds
 */

"use strict";

const Utils = require("./epc/utils/utils");
const { Sgtin96 } = require("./epc/sgtin/sgtin96");
const { Sgtin198 } = require("./epc/sgtin/sgtin198");
const { Sgln96 } = require("./epc/sgln/sgln96");
const { Sgln195 } = require("./epc/sgln/sgln195");
const { Sscc96 } = require("./epc/sscc/sscc96");
const { Grai96 } = require("./epc/grai/grai96");
const { Grai170 } = require("./epc/grai/grai170");
const { Gid96 } = require("./epc/gid/gid96");
const { Giai96 } = require("./epc/giai/giai96");
const { Giai202 } = require("./epc/giai/giai202");
const { Gsrn96 } = require("./epc/gsrn/gsrn96");
const { Cpi96 } = require("./epc/cpi/cpi96");
const { Gdti96 } = require("./epc/gdti/gdti96");
const { Gdti174 } = require("./epc/gdti/gdti174");
const { Sgcn96 } = require("./epc/sgcn/sgcn96");

function fromTagURI(uri) {
  const value = uri.split(':');
  switch (value[3]) {
    case Sgtin96.TAG_URI:
      return Sgtin96.fromTagURI(uri);
    case Sgtin198.TAG_URI:
      return Sgtin198.fromTagURI(uri);
    case Grai96.TAG_URI:
      return Grai96.fromTagURI(uri);
    case Grai170.TAG_URI:
      return Grai170.fromTagURI(uri);
    case Sscc96.TAG_URI:
      return Sscc96.fromTagURI(uri);
    case Sgln96.TAG_URI:
      return Sgln96.fromTagURI(uri);
    case Sgln195.TAG_URI:
      return Sgln195.fromTagURI(uri);
    case Gid96.TAG_URI:
      return Gid96.fromTagURI(uri);
    case Giai96.TAG_URI:
      return Giai96.fromTagURI(uri);
    case Giai202.TAG_URI:
      return Giai202.fromTagURI(uri);
    case Gsrn96.TAG_URI:
      return Gsrn96.fromTagURI(uri);
    case Cpi96.TAG_URI:
      return Cpi96.fromTagURI(uri);
    case Gdti96.TAG_URI:
      return Gdti96.fromTagURI(uri);
    case Gdti174.TAG_URI:
      return Gdti174.fromTagURI(uri);
    case Sgcn96.TAG_URI:
      return Sgcn96.fromTagURI(uri);
    default:
      throw new Error(`Unsupported Tag URI: '${uri}'`);
  }
}

function valueOf(hexEpc) {
  let header = Utils.hexToByte(hexEpc, 0); // first byte of EPC
  switch (header) {
    case Grai96.EPC_HEADER:
      return new Grai96(hexEpc);
    case Grai170.EPC_HEADER:
      return new Grai170(hexEpc);
    case Sscc96.EPC_HEADER:
      return new Sscc96(hexEpc);
    case Sgln96.EPC_HEADER:
      return new Sgln96(hexEpc);
    case Sgln195.EPC_HEADER:
      return new Sgln195(hexEpc);
    case Sgtin96.EPC_HEADER:
      return new Sgtin96(hexEpc);
    case Sgtin198.EPC_HEADER:
      return new Sgtin198(hexEpc);
    case Gid96.EPC_HEADER:
      return new Gid96(hexEpc);
    case Giai96.EPC_HEADER:
      return new Giai96(hexEpc);
    case Giai202.EPC_HEADER:
      return new Giai202(hexEpc);
    case Gsrn96.EPC_HEADER:
      return new Gsrn96(hexEpc);
    case Cpi96.EPC_HEADER:
      return new Cpi96(hexEpc);
    case Gdti96.EPC_HEADER:
      return new Gdti96(hexEpc);
    case Gdti174.EPC_HEADER:
      return new Gdti174(hexEpc);
    case Sgcn96.EPC_HEADER:
      return new Sgcn96(hexEpc);
    default:
      throw new Error(`Unsupported EPC: '${hexEpc}'`);
  }
}

exports = module.exports = { Sgtin96, Sgtin198, Sgln96, Sgln195, Sscc96, Grai96, Grai170, Gid96, Giai96, Giai202, Gsrn96, Cpi96, Gdti96, Gdti174, Sgcn96, Utils };
exports.valueOf = valueOf;
exports.fromTagURI = fromTagURI;
},{"./epc/cpi/cpi96":1,"./epc/gdti/gdti174":3,"./epc/gdti/gdti96":4,"./epc/giai/giai202":5,"./epc/giai/giai96":6,"./epc/gid/gid96":7,"./epc/grai/grai170":8,"./epc/grai/grai96":9,"./epc/gsrn/gsrn96":10,"./epc/sgcn/sgcn96":13,"./epc/sgln/sgln195":14,"./epc/sgln/sgln96":15,"./epc/sgtin/sgtin198":16,"./epc/sgtin/sgtin96":17,"./epc/sscc/sscc96":18,"./epc/utils/utils":21}]},{},[]);
