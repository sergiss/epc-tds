/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */

import { Segment } from "./segment";

/**
 * Represents a partition of the EPC Tag Data Standard.
 */
export class Partition {
  a: Segment;
  b: Segment;

  /**
   * Creates an instance of Partition.
   * @param offset The starting bit position for the first segment.
   * @param bits1 The number of bits allocated to the first segment.
   * @param digits1 The number of digits that the first segment can represent.
   * @param bits2 The number of bits allocated to the second segment.
   * @param digits2 The number of digits that the second segment can represent.
   */
  constructor(
    offset: number,
    bits1: number,
    digits1: number,
    bits2: number,
    digits2: number
  ) {
    this.a = new Segment(offset, bits1, digits1);
    this.b = new Segment(this.a.end, bits2, digits2);
  }
}
