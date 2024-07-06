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
import { Epc } from "../epc";
import { Type } from "../type";
export declare class Sgln195 extends Epc<Sgln195> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static EXTENSION_OFFSET: number;
    static EXTENSION_END: number;
    static EXTENSION_BITS: number;
    static MAX_EXTENSION_LEN: number;
    static CHAR_BITS: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, location: string, extension: string) => string;
    static PID_URI_TEMPLATE: (company: string, location: string, extension: string) => string;
    constructor(hexEpc?: string);
    clone(): Sgln195;
    getType(): Type;
    static fromTagURI(uri: string): Sgln195;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGln(): string;
    setGln(gln: string): this;
    getCompany(): number;
    setCompany(value: number): this;
    getLocation(): number;
    setLocation(value: number): this;
    getExtension(): string;
    /**
    * All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
    * @param value
    */
    setExtension(value: string): this;
}
