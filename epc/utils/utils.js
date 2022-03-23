/*
* EPC Tag Data Standard
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

const HEX_TABLE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

const DEC_TABLE = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8, 
   9, -1, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, 
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
  -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];

const NUMBER_TABLE = [
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 00 - 09
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 10 - 19
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 20 - 29
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1, // 30 - 39
    -1,-1,-1,-1,-1,-1,-1,-1, 0, 1, // 40 - 49
     2, 3, 4, 5, 6, 7, 8, 9,-1,-1  // 50 - 59
];

function computeCheckDigit(barcode) { // https://www.gs1.org/services/how-calculate-check-digit-manually

    // CHECK DIGIT										
    // GTIN-8                                          n01 n02 n03 n04 n05 n06 n07 | n08 
    // GTIN-12                         n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 | n12 
    // GTIN-13                     n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 | n13 
    // GTIN-14                 n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 | n14 
    // GSIN        n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 n14 n15 n16 | n17
    // SSCC    n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 n14 n15 n16 n17 | n18
    // ----------------------------------------------------------------------------------------
    // Mult     x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3
    
    let odd, even = 0;
    let i = barcode.length - 1;

    if (i & 0b1) { // even check
        odd = 0;
    } else {
        odd = NUMBER_TABLE[barcode.charCodeAt(0)];
    }
    // Multiply value of each position by x3, x1 and add results together to create sum
    for (; i > 0; i -= 2) {
        odd  += NUMBER_TABLE[barcode.charCodeAt(i    )];
        even += NUMBER_TABLE[barcode.charCodeAt(i - 1)];
    }
    // Subtract the sum from nearest equal or higher multiple of ten
    let result = (even + odd * 3) % 10; 
    if(result !== 0) {
      result = 10 - result;
    }  
    return result;
}

function getMaxValue(bits) {
    return Math.pow(2, bits) - 1;
}

function hexToByte(hex, offset) {
  return (DEC_TABLE[hex.charCodeAt(offset)] << 4) | DEC_TABLE[hex.charCodeAt(offset + 1)];
}

function randomEan(n) {
    let result = "";
    for (let i = 1; i < n; ++i) {
      result += Math.floor(Math.random() * 10);
    }
    return result + computeCheckDigit(result);
}

function randomHex(len) {
  let result = "";
  for (let i = 0; i < len; ++i) {
    result += HEX_TABLE[Math.floor(Math.random() * HEX_TABLE.length)];
  }
  return result;
}

module.exports = { getMaxValue, randomEan, randomHex, hexToByte, computeCheckDigit};