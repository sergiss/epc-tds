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
