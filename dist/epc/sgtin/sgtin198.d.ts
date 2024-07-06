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
import { Epc } from "../epc";
import { Type } from "../type";
export declare class Sgtin198 extends Epc<Sgtin198> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static MAX_SERIAL_LEN: number;
    static CHAR_BITS: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, item: string, serial: string) => string;
    static PID_URI_TEMPLATE: (company: string, item: string, serial: string) => string;
    constructor(hexEpc?: string);
    clone(): Sgtin198;
    getType(): Type;
    static fromTagURI(uri: string): Sgtin198;
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
    getSerial(): string;
    /**
    * All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
    * @param value
    */
    setSerial(value: string): this;
}
