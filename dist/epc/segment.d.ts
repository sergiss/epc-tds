/**
 * Represents a segment of the EPC Tag Data Standard.
 */
export declare class Segment {
    start: number;
    end: number;
    digits: number;
    maxValue: number;
    /**
     * Creates an instance of Segment.
     * @param offset The initial offset of the segment.
     * @param bits The number of bits in the segment.
     * @param digits The number of digits the segment can represent.
     */
    constructor(offset: number, bits: number, digits: number);
}
