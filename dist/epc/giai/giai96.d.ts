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
export declare class Giai96 extends Epc<Giai96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, asset: bigint) => string;
    static PID_URI_TEMPLATE: (company: string, asset: bigint) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Giai96;
    getType(): Type;
    static fromTagURI(uri: string): Giai96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGiai(): string;
    setGiai(giai: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getAssetReference(): bigint;
    setAssetReference(value: bigint): this;
}
