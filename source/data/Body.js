const Head = require('./Head.js');
const Chest = require('./Chest.js');
const Legs = require('./Legs.js');
const Arms = require('./Arms.js')
const Feet = require('./Feet.js');
const LHand = require('./lHand.js');
const RHand = require('./rHand.js');
const Shoulder = require('./Shoulder.js');
const LFinger = require('./LFinger.js');
const RFinger = require('./RFinger.js');

class Body {
    constructor(head, chest, legs, arms, feet, lHand, rHand, shoulder, lFinger, rFinger) {
        this.head = new Head();
        this.chest = new Chest();
        this.legs = new Legs();
    }
}

module.exports = Body;