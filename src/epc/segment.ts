/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */

/**
 * Represents a segment of the EPC Tag Data Standard.
 */
export class Segment {
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
  constructor(offset: number, bits: number, digits: number) {
    this.start = offset;
    this.end = offset + bits;
    this.digits = digits;
    this.maxValue = Math.pow(10, digits) - 1; // Max value in n digits
  }
}
