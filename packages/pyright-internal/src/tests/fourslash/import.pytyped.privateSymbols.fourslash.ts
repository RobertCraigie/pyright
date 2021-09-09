/// <reference path="fourslash.ts" />

// @filename: pyrightconfig.json
//// {
////   "typeCheckingMode": "basic"
//// }

// @filename: testLib/py.typed
// @library: true
////

// @filename: testLib/__init__.py
// @library: true
//// from .module1 import one as one, two, three
//// four: int = two * two
//// _five: int = two + three
//// _six: int = 6
//// __all__ = ["_six"]

// @filename: testLib/module1.py
// @library: true
//// one = 1
//// two = 2
//// three = 3

// @filename: .src/test.py
//// from testLib import one
//// from testLib import [|/*marker1*/two|] as two_alias
//// from testLib import [|/*marker2*/three|]
//// from testLib import four
//// from testLib import [|/*marker3*/_five|]
//// from testLib import _six

//// import testLib
//// testLib.one
//// testLib.[|/*marker4*/two|]
//// testLib.[|/*marker5*/three|]
//// testLib.four
//// testLib.[|/*marker6*/_five|]
//// testLib._six

// @ts-ignore
await helper.verifyDiagnostics({
    marker1: { category: 'error', message: `Symbol "two" is private to module` },
    marker2: { category: 'error', message: `Symbol "three" is private to module` },
    marker3: { category: 'error', message: `Symbol "_five" is private to module` },
    marker4: { category: 'error', message: `Symbol "two" is private to module` },
    marker5: { category: 'error', message: `Symbol "three" is private to module` },
    marker6: { category: 'error', message: `Symbol "_five" is private to module` },
});
