/**
 * 96-bit Global Individual Asset Identifier – Recipient (GSRN)
 *
 * The Global Service Relation Number EPC scheme is used to assign a unique identity to a service
 * recipient.
 *
 * Typical use: Hospital admission or club membership
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Gsrn96 extends Epc<Gsrn96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, service: number) => string;
    static PID_URI_TEMPLATE: (company: string, asset: number) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Gsrn96;
    getType(): Type;
    static fromTagURI(uri: string): Gsrn96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGsrn(): string;
    setGsrn(gsrn: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getServiceReference(): number;
    setServiceReference(value: number): this;
}
