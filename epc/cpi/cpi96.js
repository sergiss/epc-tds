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