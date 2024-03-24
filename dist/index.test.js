"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const ITERATIONS = 10000;
describe('Sgcn96 Tests', () => {
    test('Sgcn96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const sgcn = _1.default.Utils.randomEan(13) + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Sgcn96().setFilter(3).setPartition(6).setSgcn(sgcn);
            epc = new _1.default.Sgcn96(epc.toHexString());
            expect(sgcn).toEqual(epc.getSgcn());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Gdti96 Tests', () => {
    test('Gdti96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const gdti = _1.default.Utils.randomEan(13) + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Gdti96().setFilter(3).setPartition(6).setGdti(gdti);
            epc = new _1.default.Gdti96(epc.toHexString());
            expect(gdti).toEqual(epc.getGdti());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Gdti174 Tests', () => {
    test('Gdti174 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const gdti = _1.default.Utils.randomEan(13) + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Gdti174().setFilter(3).setPartition(6).setGdti(gdti);
            epc = new _1.default.Gdti174(epc.toHexString());
            expect(gdti).toEqual(epc.getGdti());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Cpi96 Tests', () => {
    test('Cpi96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const cpi = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Cpi96().setFilter(3).setPartition(6).setCpi(cpi);
            epc.setSerial(Math.floor(Math.random() * _1.default.Cpi96.MAX_SERIAL));
            epc = new _1.default.Cpi96(epc.toHexString());
            expect(cpi).toEqual(epc.getCpi());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Gsrn96 Tests', () => {
    test('Gsrn96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const gsrn = _1.default.Utils.randomEan(18);
            let epc = new _1.default.Gsrn96().setFilter(3).setPartition(6).setGsrn(gsrn);
            epc = new _1.default.Gsrn96(epc.toHexString());
            expect(gsrn).toEqual(epc.getGsrn());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Giai96 Tests', () => {
    test('Giai96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const giai = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Giai96().setFilter(3).setPartition(6).setGiai(giai);
            epc = new _1.default.Giai96(epc.toHexString());
            expect(giai).toEqual(epc.getGiai());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Giai202 Tests', () => {
    test('Giai202 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const giai = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Giai202().setFilter(3).setPartition(6).setGiai(giai);
            epc = new _1.default.Giai202(epc.toHexString());
            expect(giai).toEqual(epc.getGiai());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Grai170 Tests', () => {
    test('Grai170 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const grai = _1.default.Utils.randomEan(13) + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Grai170().setFilter(3).setPartition(6).setGrai(grai);
            epc = new _1.default.Grai170(epc.toHexString());
            expect(grai).toEqual(epc.getGrai());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Grai96 Tests', () => {
    test('Grai96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const grai = _1.default.Utils.randomEan(13) + Math.floor(Math.random() * _1.default.Utils.getMaxValue(16));
            let epc = new _1.default.Grai96().setFilter(3).setPartition(6).setGrai(grai);
            epc = new _1.default.Grai96(epc.toHexString());
            expect(grai).toEqual(epc.getGrai());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Sscc96 Tests', () => {
    test('Sscc96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const ean = _1.default.Utils.randomEan(18);
            let epc = new _1.default.Sscc96().setFilter(3).setPartition(6).setSscc(ean);
            epc = new _1.default.Sscc96(epc.toHexString());
            expect(ean).toEqual(epc.getSscc());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Sgtin96 Tests', () => {
    test('Sgtin96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const gtin = _1.default.Utils.randomEan(14);
            let epc = new _1.default.Sgtin96().setFilter(3).setPartition(6).setGtin(gtin).setSerial(Math.floor(Math.random() * _1.default.Sgtin96.MAX_SERIAL));
            epc = new _1.default.Sgtin96(epc.toHexString());
            expect(gtin).toEqual(epc.getGtin());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Sgtin198 Tests', () => {
    test('Sgtin198 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const gtin = _1.default.Utils.randomEan(14);
            let epc = new _1.default.Sgtin198().setFilter(3).setPartition(6).setGtin(gtin).setSerial(_1.default.Utils.randomHex(_1.default.Sgtin198.MAX_SERIAL_LEN));
            epc = new _1.default.Sgtin198(epc.toHexString());
            expect(gtin).toEqual(epc.getGtin());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Sgln96 Tests', () => {
    test('Sgln96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const ean = _1.default.Utils.randomEan(13);
            let epc = new _1.default.Sgln96().setFilter(3).setPartition(6).setGln(ean).setExtension(Math.floor(Math.random() * _1.default.Sgln96.MAX_EXTENSION));
            epc = new _1.default.Sgln96(epc.toHexString());
            expect(ean).toEqual(epc.getGln());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Sgln195 Tests', () => {
    test('Sgln195 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            const ean = _1.default.Utils.randomEan(13);
            let epc = new _1.default.Sgln195().setFilter(3).setPartition(6).setGln(ean).setExtension(_1.default.Utils.randomHex(_1.default.Sgln195.MAX_EXTENSION_LEN));
            epc = new _1.default.Sgln195(epc.toHexString());
            expect(ean).toEqual(epc.getGln());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
describe('Gid96 Tests', () => {
    test('Gid96 should correctly process and match expected values', () => {
        for (let i = 0; i < ITERATIONS; ++i) {
            let manager = Math.floor(Math.random() * _1.default.Gid96.MAX_MANAGER);
            let clazz = Math.floor(Math.random() * _1.default.Gid96.MAX_CLASS);
            let serial = Math.floor(Math.random() * _1.default.Gid96.MAX_SERIAL);
            let epc = new _1.default.Gid96().setManager(manager).setClass(clazz).setSerial(serial);
            epc = new _1.default.Gid96(epc.toHexString());
            expect(manager).toEqual(epc.getManager());
            expect(clazz).toEqual(epc.getClass());
            expect(serial).toEqual(epc.getSerial());
            const uri = epc.toTagURI();
            const tmp = _1.default.fromTagURI(uri);
            expect(uri).toEqual(tmp.toTagURI());
        }
    });
});
