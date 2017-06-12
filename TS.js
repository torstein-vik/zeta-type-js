/* Type fields:
addid
multid
add
mult
parser
*/

const P  = require('./parsing/parsers.js');

class TannakianSymbol {
    constructor(val){
        this.val = val;
    }


}

function TS (type){
    var ts = {
        addid: new TannakianSymbol([]),
        add: (x) => (y) => x.val.concat(y.val),
        addinv: TS.bind((x) => [x, -1]),
        sub: (x) => (y) => ts.add(x)(ts.addinv(y))
    }

    if (typeof type.multid !== 'undefined'){
        ts.multid = TS.pure(type.multid);
    }

    if (typeof type.mult !== 'undefined'){
        ts.mult = (x) => (y) => TS.bind((x) => TS.bind((y) => pure(x * y))(y.val))(x.val); //[].join(x.map(([xe, xn]) => y.map(([ye, yn]) => [type.mult(xe)(ye), xn * yn])));
    }

    if (typeof type.parser !== 'undefined'){
        let parseset = P.expect("Ø").then(P.Return([])).or(P.lift([P.expect("{"), P.delimited(P.spaces.then(P.text(', ').then(P.spaces)), type.parser), P.expect("}")], (_, v, __) => v));

        ts.parser = P.lift([parseset, P.expect('/'), parseset], (x, _, y) => ts.sub(x.map(TS.pure)(y.map(TS.pure))));
    }

    return ts;
}

TS.bind = (f) => (x) => new TannakianSymbol([].concat.apply([], x.val.map(([e, n]) => f(e).map(([ei, ni]) => [ei, ni * n]))));

TS.pure = (x) => new TannakianSymbol([[x, 1]])

const Integer = {
    addid: 0,
    multid: 1,
    add: (x) => (y) => x + y,
    mult: (x) => (y) => x * y,
    parser: P.integer
}
