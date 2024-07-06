/**
 * 174-bit Global Document Type Identifier (GDTI)
 *
 * The Global Document Type Identifier EPC scheme is used to assign a unique identity to
 * a specific document, such as land registration papers, an insurance policy, and others.
 *
 * Typical use: Document
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Gdti174 extends Epc<Gdti174> {
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
    static TAG_URI_TEMPLATE: (filter: number, company: string, document: string, serial: string) => string;
    static PID_URI_TEMPLATE: (company: string, document: string, serial: string) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Gdti174;
    getType(): Type;
    static fromTagURI(uri: string): Gdti174;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGdti(): string;
    setGdti(gdti: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getDocumentReference(): number;
    setDocumentReference(value: number): this;
    getSerial(): string;
    setSerial(value: string): this;
}
