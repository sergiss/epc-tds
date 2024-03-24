const tds = require("./index.js");
const ITERATIONS = 10000;

describe('Sgcn96 Tests', () => {
  test('Sgcn96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const sgcn = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Sgcn96().setFilter(3).setPartition(6).setSgcn(sgcn);
        epc = new tds.Sgcn96(epc.toHexString());
        expect(sgcn).toEqual(epc.getSgcn());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }
 
  });
});

describe('Gdti96 Tests', () => {
  test('Gdti96 should correctly process and match expected values', () => {
   
      for (let i = 0; i < ITERATIONS; ++i) {
        const gdti = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Gdti96().setFilter(3).setPartition(6).setGdti(gdti);
        epc = new tds.Gdti96(epc.toHexString());
        expect(gdti).toEqual(epc.getGdti());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }
   
  });
});

describe('Gdti174 Tests', () => {
    test('Gdti174 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const gdti = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Gdti174().setFilter(3).setPartition(6).setGdti(gdti);
        epc = new tds.Gdti174(epc.toHexString());
        expect(gdti).toEqual(epc.getGdti());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Cpi96 Tests', () => {
    test('Cpi96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const cpi = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Cpi96().setFilter(3).setPartition(6).setCpi(cpi);
        epc.setSerial(Math.floor(Math.random() * tds.Cpi96.MAX_SERIAL));
        epc = new tds.Cpi96(epc.toHexString());
        expect(cpi).toEqual(epc.getCpi());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Gsrn96 Tests', () => {
    test('Gsrn96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const gsrn = tds.Utils.randomEan(18);
        let epc = new tds.Gsrn96().setFilter(3).setPartition(6).setGsrn(gsrn);
        epc = new tds.Gsrn96(epc.toHexString());
        expect(gsrn).toEqual(epc.getGsrn());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });

  describe('Giai96 Tests', () => {
    test('Giai96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const giai = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Giai96().setFilter(3).setPartition(6).setGiai(giai);
        epc = new tds.Giai96(epc.toHexString());
        expect(giai).toEqual(epc.getGiai());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Giai202 Tests', () => {
    test('Giai202 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const giai = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Giai202().setFilter(3).setPartition(6).setGiai(giai);
        epc = new tds.Giai202(epc.toHexString());
        expect(giai).toEqual(epc.getGiai());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Grai170 Tests', () => {
    test('Grai170 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const grai = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Grai170().setFilter(3).setPartition(6).setGrai(grai);
        epc = new tds.Grai170(epc.toHexString());
        expect(grai).toEqual(epc.getGrai());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Grai96 Tests', () => {
    test('Grai96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const grai = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        let epc = new tds.Grai96().setFilter(3).setPartition(6).setGrai(grai);
        epc = new tds.Grai96(epc.toHexString());
        expect(grai).toEqual(epc.getGrai());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Sscc96 Tests', () => {
    test('Sscc96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const ean = tds.Utils.randomEan(18);
        let epc = new tds.Sscc96().setFilter(3).setPartition(6).setSscc(ean);
        epc = new tds.Sscc96(epc.toHexString());
        expect(ean).toEqual(epc.getSscc());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });

  describe('Sgtin96 Tests', () => {
    test('Sgtin96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const gtin = tds.Utils.randomEan(14);
        let epc = new tds.Sgtin96().setFilter(3).setPartition(6).setGtin(gtin).setSerial(Math.floor(Math.random() * tds.Sgtin96.MAX_SERIAL));
        epc = new tds.Sgtin96(epc.toHexString());
        expect(gtin).toEqual(epc.getGtin());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }
      
    });
  });
  
  describe('Sgtin198 Tests', () => {
    test('Sgtin198 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const gtin = tds.Utils.randomEan(14);
        let epc = new tds.Sgtin198().setFilter(3).setPartition(6).setGtin(gtin).setSerial(tds.Utils.randomHex(tds.Sgtin198.MAX_SERIAL_LEN));
        epc = new tds.Sgtin198(epc.toHexString());
        expect(gtin).toEqual(epc.getGtin());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Sgln96 Tests', () => {
    test('Sgln96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const ean = tds.Utils.randomEan(13);
        let epc = new tds.Sgln96().setFilter(3).setPartition(6).setGln(ean).setExtension(Math.floor(Math.random() * tds.Sgln96.MAX_EXTENSION));
        epc = new tds.Sgln96(epc.toHexString());
        expect(ean).toEqual(epc.getGln());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Sgln195 Tests', () => {
    test('Sgln195 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        const ean = tds.Utils.randomEan(13);
        let epc = new tds.Sgln195().setFilter(3).setPartition(6).setGln(ean).setExtension(tds.Utils.randomHex(tds.Sgln195.MAX_EXTENSION_LEN));
        epc = new tds.Sgln195(epc.toHexString());
        expect(ean).toEqual(epc.getGln());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  
  describe('Gid96 Tests', () => {
    test('Gid96 should correctly process and match expected values', () => {

      for (let i = 0; i < ITERATIONS; ++i) {
        let manager = Math.floor(Math.random() * tds.Gid96.MAX_MANAGER);
        let clazz = Math.floor(Math.random() * tds.Gid96.MAX_CLASS);
        let serial = Math.floor(Math.random() * tds.Gid96.MAX_SERIAL);
        let epc = new tds.Gid96().setManager(manager).setClass(clazz).setSerial(serial);
        epc = new tds.Gid96(epc.toHexString());
        expect(manager).toEqual(epc.getManager());
        expect(clazz).toEqual(epc.getClass());
        expect(serial).toEqual(epc.getSerial());
        
        const uri = epc.toTagURI();
        const tmp = tds.fromTagURI(uri);
        expect(uri).toEqual(tmp.toTagURI());
      }

    });
  });
  