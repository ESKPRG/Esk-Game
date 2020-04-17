const component = require('./component.js');

class Background extends component {
    constructor(x, y, img, width, height, type) {
        super(0, x, y, 0, img, width, height, type)
    }

    static blacksmithRoom() {
        return new Background(
            0,
            0,
            'assets/Blacksmith Room-1.png',
            2000,
            1250,
            component.IMAGE
        )
    }


    static dungeon1() {
        return new Background(
            0,
            0,
            'assets/dungeon1.png',
            2000,
            1250,
            component.IMAGE
        )
    }

    static base() {
        return new Background(
            0,
            0,
            'assets/Base.png',
            2000,
            1250,
            component.IMAGE
        )
    }

    static shopRoom() {
        return new Background(
            0,
            0,
            'assets/Shop-1.png',
            2000,
            1250,
            component.IMAGE
        )
    }
}

module.exports = Background;