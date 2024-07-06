export declare const Utils: {
    computeCheckDigit: (barcode: string) => number;
    getMaxValue: (bits: number) => number;
    hexToByte: (hex: string, offset: number) => number;
    randomEan: (n: number) => string;
    randomHex: (len: number) => string;
};
