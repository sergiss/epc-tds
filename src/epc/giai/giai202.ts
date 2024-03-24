/**
 * 202-bit Global Individual Asset Identifier (GIAI)
 * 
 * The Global Individual Asset Identifier EPC scheme is used to assign a unique identity to a specific 
 * asset, such as a forklift or a computer.
 * 
 * Typical use: Fixed asset
 * 
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */

import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";

export class Giai202 extends Epc<Giai202> {

	static EPC_HEADER = 0x38;

	static TOTAL_BITS = 202;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;

	static TAG_URI = 'giai-202';
	// F.C.A (Filter, Company, Asset)
	static TAG_URI_TEMPLATE = (filter: number, company: string, asset: string) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${asset}`}; 
	// C.A (Company, Asset)
	static PID_URI_TEMPLATE = (company: string, asset: string) => {return `urn:epc:id:giai:${company}.${asset}`};

	// Partition table columns: Company prefix, Asset Type
	static PARTITIONS = [ new Partition(Giai202.PARTITION_END, 40, 12, 148, 18),   // 0 40 12 148 18
						  new Partition(Giai202.PARTITION_END, 37, 11, 151, 19),   // 1 37 11 151 19
						  new Partition(Giai202.PARTITION_END, 34, 10, 154, 20),   // 2 34 10 154 20 
						  new Partition(Giai202.PARTITION_END, 30,  9, 158, 21),   // 3 30 09 158 21 
						  new Partition(Giai202.PARTITION_END, 27,  8, 161, 22),   // 4 27 08 161 22 
						  new Partition(Giai202.PARTITION_END, 24,  7, 164, 23),   // 5 24 07 164 23 
						  new Partition(Giai202.PARTITION_END, 20,  6, 168, 24) ]; // 6 20 06 168 24

	constructor(hexEpc?: string) {	
		super(Giai202.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Giai202.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Giai202().setFromBitArray(this) as Giai202;
	}

	getType() {
		return Type.GIAI202;
	}

	static fromTagURI(uri: string) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Giai202();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setAssetReference(data[2]);
				return result;
			}
		} catch (e) {
			console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.A (Filter, Company, Asset)
		const partition = Giai202.PARTITIONS[this.getPartition()];
		return Giai202.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getAssetReference());
	}

	toIdURI() { // C.A (Company, Asset)
		const partition = Giai202.PARTITIONS[this.getPartition()];
		return Giai202.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getAssetReference());
	}
	
	toBarcode() {
		return this.getGiai();
	}

	getTotalBits() {
		return Giai202.TOTAL_BITS;
	}

	getHeader() {
		return Giai202.EPC_HEADER;
	}

	getPartition() {
		return super.get(Giai202.PARTITION_OFFSET, Giai202.PARTITION_END);
	}

	setPartition(value: number) {
		if (value < 0 || value >= Giai202.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Giai202.PARTITIONS.length - 1})`);
		}
		super.set(value, Giai202.PARTITION_OFFSET, Giai202.PARTITION_END);
		return this;
	}

	getGiai() {
		const partition = Giai202.PARTITIONS[this.getPartition()];
        const companyPrefix = super.getSegmentString(partition.a);
		const asset = super.getString(partition.b.start, partition.b.end, 7);
		return  companyPrefix + asset;
	}

	setGiai(giai: string) {
		const partition = Giai202.PARTITIONS[this.getPartition()];  
		super.setSegment(Number(giai.substring(0, partition.a.digits)), partition.a);
        const tmp = partition.a.digits + partition.b.digits;
		super.setString(giai.substring(partition.a.digits, tmp), partition.b.start, partition.b.end, 7);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Giai202.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value: number) {
		super.setSegment(value, Giai202.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getAssetReference() {
		const segment = Giai202.PARTITIONS[this.getPartition()].b;
		return super.getString(segment.start, segment.end, 7);
	}

	setAssetReference(value: string) {
		const segment = Giai202.PARTITIONS[this.getPartition()].b;
		super.setString(value, segment.start, segment.end, 7);
		return this;
	}

}