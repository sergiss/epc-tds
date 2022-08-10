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
