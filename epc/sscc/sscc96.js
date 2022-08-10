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