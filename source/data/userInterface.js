const component = require('./component.js');

class userInterface extends component {
    constructor(x, y, z, img, width, height, type) {
        super(1, x, y, z, img, width, height, type)
    }

    static battleInterface() {
        return new userInterface(
            0,
            0,
            1,
            'assets/basic_UI(larger).png',
            2000,
            1250,
            component.IMAGE
        )
    }

    static addAbility(ability, count) {
        return new userInterface(
            (35 + (count * 155)),
            1130,
            1,
            ability.img,
            125,
            125,
            component.IMAGE
        )
    }

    static abilityBorder(x, y) {
        return new userInterface(
            x,
            y,
            2,
            'assets/selectedAbility.png',
            130,
            150,
            component.IMAGE
        )
    }

    static backButton() {
        return new userInterface(
            1825, 25,
            1,
            'assets/backButton.png',
            150, 75,
            component.IMAGE
        )
    }

    static speaker() {
        return new userInterface(
            1825, 70,
            1,
            'assets/speaker.png',
            80, 80,
            component.IMAGE
        )
    }
}

module.exports = userInterface;