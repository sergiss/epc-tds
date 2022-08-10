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
