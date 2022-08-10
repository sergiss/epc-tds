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
