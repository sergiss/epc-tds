/**
 * 96-bit Serialised Global Coupon Number (SGCN)
 *
 * The Global Coupon Number EPC scheme is used to assign a unique identity to a coupon.
 *
 * Typical use: Coupon
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Sgcn96 extends Epc<Sgcn96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, coupon: string, serial: string) => string;
    static PID_URI_TEMPLATE: (company: string, coupon: string, serial: string) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Sgcn96;
    getType(): Type;
    static fromTagURI(uri: string): Sgcn96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getSgcn(): string;
    setSgcn(sgcn: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getCouponReference(): number;
    setCouponReference(value: number): this;
    getSerial(): string;
    setSerial(value: number): this;
}
