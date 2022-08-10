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