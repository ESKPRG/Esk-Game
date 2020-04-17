class Planet {
    constructor(name, armoury, shop, tavern, chapel, expeditionPost) {
        this.name = name
        this.armoury = armoury;
        this.shop = shop;
        this.tavern = tavern;
        this.chapel = chapel;
        this.expeditionPost = expeditionPost;
    }

    retrieveBuildingLocations() {
        let dict = {};
        for (let [id, value] of Object.entries(this)) {
            if (id !== 'name') {
                dict = {...dict,...value.retrieveBuildingLocation()};
            }
        }

        return dict;
    }

    retrieveNpc(npc) {
        let a;
        switch(npc) {
            case 'blacksmith': a = this.armoury.retrieveNpc(); break;
            case 'shop': a = this.shop.retrieveNpc(); break;
            case 'tavern': a = this.tavern.retrieveNpc(); break;
            case 'chapel': a = this.chapel.retrieveNpc();
        }

        return a;
    }
}

module.exports = Planet