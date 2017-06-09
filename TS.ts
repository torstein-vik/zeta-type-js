const P = require('parser.js');

interface Type{
    add?;
    addid?;
    mult?;
    multid?;
    parser?;
}

const Integer : Type= {
    addid: 0,
    multid: 1,
    add: (x, y) => x + y,
    mult: (x, y) => x * y, 
}