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
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Grai96 extends Epc<Grai96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, asset: string, serial: number) => string;
    static PID_URI_TEMPLATE: (company: string, asset: string, serial: number) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Grai96;
    getType(): Type;
    static fromTagURI(uri: string): Grai96;
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
    getSerial(): number;
    setSerial(value: number): this;
}
