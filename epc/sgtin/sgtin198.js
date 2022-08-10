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
