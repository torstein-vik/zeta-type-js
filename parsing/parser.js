"use strict";

// Concat and flatMap (http://stackoverflow.com/questions/39837678/why-no-array-prototype-flatmap-in-javascript)

const concat = (x,y) => x.concat(y)
const flatMap = (f,xs) => xs.map(f).reduce(concat, [])

Array.prototype.flatMap = function(f) {
  return flatMap(f,this);
};

/*
Types:

0 - Bind
1 - Or
2 - Next
3 - Fail
4 - Return

*/

class Parser{
    constructor(type, v1, v2){
        this.type = type;
        this.v1 = v1;
        this.v2 = v2;
    }

    bind(f){
        return new Parser(0, this, f);
    }

    or(alt){
        return new Parser(1, this, alt);
    }
}

const Return = (val) => new Parser(4, val);

const Fail = new Parser(3);

const Next = new Parser(2);


const _parserInternal =
{
    0: (v1, v2, rec, string) => rec(v1, string).flatMap((result) => rec(v2(result.value), result.post)),
    1: (v1, v2, rec, string) => rec(v1, string).concat(rec(v2, string)),
    2: (v1, v2, rec, string) => string.length > 0 ? [{value: string[0], post: string.slice(1)}] : [],
    3: (v1, v2, rec, string) => [],
    4: (v1, v2, rec, string) => [{value: v1, post: string}]
}

function _parses(parser, string){
    return _parserInternal[parser.type](parser.v1, parser.v2, _parses, string);
}

function parses(parser, string){
    var results = _parses(parser, string);
    return results.filter((x) => x.post == "").map((x) => x.value);
}

function parse(parser, string){
    var results = parses(parser, string);

    if (results.length == 1){
        return results[0];
    } else if (results.length == 0) {
        console.log("No parse!");
    } else {
        console.log("Ambigous parse! ");
        console.dir(results);
    }
}

module.exports = {
    Parser: Parser,
    Return: Return,
    Fail:   Fail,
    Next:   Next,
    parses: parses,
    parse:  parse
}
