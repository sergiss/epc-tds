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
import { Epc } from "../epc";
import { Type } from "../type";
import { Partition } from "../partition";
export declare class Sscc96 extends Epc<Sscc96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, serial: string) => string;
    static PID_URI_TEMPLATE: (company: string, serial: string) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Sscc96;
    getType(): Type;
    static fromTagURI(uri: string): Sscc96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getSscc(): string;
    setSscc(gtin: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getSerialReference(): number;
    setSerialReference(value: number): this;
    getMaxSerialReference(): number;
}
