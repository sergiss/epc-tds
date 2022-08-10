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
