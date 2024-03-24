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
import { Epc } from "../epc";
import { Type } from "../type";
export declare class Grai170 extends Epc<Grai170> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL_LEN: number;
    static CHAR_BITS: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, asset: string, serial: string) => string;
    static PID_URI_TEMPLATE: (company: string, asset: string, serial: string) => string;
    constructor(hexEpc?: string);
    clone(): Grai170;
    getType(): Type;
    static fromTagURI(uri: string): Grai170;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGrai(): string;
    setGrai(grai: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getAssetType(): number;
    setAssetType(value: number): this;
    getSerial(): string;
    /**
    * All values permitted by GS1 General Specifications (up to 16 alphanumeric characters)
    * @param value
    */
    setSerial(value: string): this;
}
