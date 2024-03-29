/**
 * 96-bit Global Individual Asset Identifier (GIAI)
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
 
export class Giai96 extends Epc<Giai96> {

	static EPC_HEADER = 0x34;

	static TOTAL_BITS = 96;
	static PARTITION_OFFSET = 11;
	static PARTITION_END    = 14;

	static TAG_URI = 'giai-96';
	// F.C.A (Filter, Company, Asset)
	static TAG_URI_TEMPLATE = (filter: number, company: string, asset: bigint) => {return `urn:epc:tag:${this.TAG_URI}:${filter}.${company}.${asset}`};
	// C.A (Company, Asset)
	static PID_URI_TEMPLATE = (company: string, asset: bigint) => {return `urn:epc:id:giai:${company}.${asset}`}; 

	// Partition table columns: Company prefix, Asset Type
	static PARTITIONS = [ new Partition(Giai96.PARTITION_END, 40, 12, 42, 13),   // 0 40 12 42 13
						  new Partition(Giai96.PARTITION_END, 37, 11, 45, 14),   // 1 37 11 45 14
						  new Partition(Giai96.PARTITION_END, 34, 10, 48, 15),   // 2 34 10 48 15 
						  new Partition(Giai96.PARTITION_END, 30,  9, 52, 16),   // 3 30 09 52 16 
						  new Partition(Giai96.PARTITION_END, 27,  8, 55, 17),   // 4 27 08 55 17 
						  new Partition(Giai96.PARTITION_END, 24,  7, 58, 18),   // 5 24 07 58 18 
						  new Partition(Giai96.PARTITION_END, 20,  6, 62, 19) ]; // 6 20 06 62 19

	constructor(hexEpc?: string) {	
		super(Giai96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Giai96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	clone() {
		return new Giai96().setFromBitArray(this) as Giai96;
	}

	getType() {
		return Type.GIAI96;
	}

	static fromTagURI(uri: string) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Giai96();
				result.setFilter(parseInt(data[0]));
				result.setPartition(12 - data[1].length);
				result.setCompanyPrefix(parseInt(data[1]));
				result.setAssetReference(BigInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // F.C.A (Filter, Company, Asset)
		const partition = Giai96.PARTITIONS[this.getPartition()];
		return Giai96.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentBigInt(partition.b));
	}

	toIdURI() { // C.A (Company, Asset)
		const partition = Giai96.PARTITIONS[this.getPartition()];
		return Giai96.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentBigInt(partition.b));
	}
	
	toBarcode() {
		return this.getGiai();
	}

	getTotalBits() {
		return Giai96.TOTAL_BITS;
	}

	getHeader() {
		return Giai96.EPC_HEADER;
	}

	getPartition() {
		return super.get(Giai96.PARTITION_OFFSET, Giai96.PARTITION_END);
	}

	setPartition(value: number) {
		if (value < 0 || value >= Giai96.PARTITIONS.length) {
			throw new Error(`Value '${value}' out of range (min: 0, max: ${Giai96.PARTITIONS.length - 1})`);
		}
		super.set(value, Giai96.PARTITION_OFFSET, Giai96.PARTITION_END);
		return this;
	}

	getGiai() {
		const partition = Giai96.PARTITIONS[this.getPartition()];
		const companyPrefix = super.getSegmentString(partition.a);
		const asset = super.getSegmentBigInt(partition.b);
		return companyPrefix + asset;
	}

	setGiai(giai: string) {
		const partition = Giai96.PARTITIONS[this.getPartition()];  
		super.setSegment(Number(giai.substring(0, partition.a.digits)), partition.a);
		const tmp = partition.a.digits + partition.b.digits;
		super.setSegment(Number(giai.substring(partition.a.digits, tmp)), partition.b);
		return this;
	}

	getCompanyPrefix() {
		return super.getSegment(Giai96.PARTITIONS[this.getPartition()].a);
	}

	setCompanyPrefix(value: number) {
		super.setSegment(value, Giai96.PARTITIONS[this.getPartition()].a);
		return this;
	}

	getAssetReference() {
		return super.getSegmentBigInt(Giai96.PARTITIONS[this.getPartition()].b);
	}

	setAssetReference(value: bigint) {
		super.setSegment(value, Giai96.PARTITIONS[this.getPartition()].b);
		return this;
	}

}
