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
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Sgtin96 extends Epc<Sgtin96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, item: string, serial: number) => string;
    static PID_URI_TEMPLATE: (company: string, item: string, serial: number) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Sgtin96;
    getType(): Type;
    static fromTagURI(uri: string): Sgtin96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGtin(): string;
    setGtin(gtin: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getItemReference(): number;
    setItemReference(value: number): this;
    getSerial(): number;
    setSerial(value: number): this;
}
