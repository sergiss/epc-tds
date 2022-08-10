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