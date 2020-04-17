const Planet = require('./Planet.js')
const Building = require('./Building.js')
const Armoury = require('./Armoury.js')
const Shop = require('./Shop.js')
const Tavern = require('./Tavern.js')
const ExpeditionPost = require('./ExpeditionPost.js')
const ArmouryUpgradePlan = require('./ArmouryUpgradePlan.js')
const Blacksmith = require('./Blacksmith.js')
const Forge = require('./Forge.js')
const Anvil = require('./Anvil.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')
const TavernUpgradePlan = require('./TavernUpgradePlan')
const TavernKeeper = require('./TavernKeeper.js')
const Beds = require('./Beds.js')
const Chapel = require('./Chapel.js')
const Shrines = require('./Shrines.js')
const WarTemple = require('./WarTemple.js')
const LoveShrine = require('./LoveShrine.js')
const GreedSanctum = require('./GreedSanctum.js')
const LabourAltar = require('./LabourAltar.js')
const PeaceSanctuary = require('./PeaceSanctuary.js')
const MahatmaGhandi = require('./MahatmaGhandi.js')
const Gaia = require('./Gaia.js')
const Atrius = require('./Atrius.js')
const Aphrodite = require('./Aphrodite.js')
const Prutus = require('./Prutus.js')
const QuestGiver = require('./QuestGiver.js')
const SanctuaryQuestList = require('./SanctuaryQuestList.js')
const ChapelUpgradePlan = require('./ChapelUpgradePlan.js')
const WeaponShelf = require('./WeaponShelf.js')
const ArmorShelf = require('./ArmorShelf.js')


class Earth extends Planet {
    constructor(name, armoury, shop, tavern, chapel, expeditionPost) {
        super(name, armoury, shop, tavern, chapel, expeditionPost)
    }

    static create() {
        const TavernUpgrade = new TavernUpgradePlan()
        const ShopUpgrade = new ShopUpgradePlan()
        const ArmouryUpgrade = new ArmouryUpgradePlan()
        const ChapelUpgrade = new ChapelUpgradePlan()

        TavernUpgrade.prepare()
        ShopUpgrade.prepare()
        ArmouryUpgrade.prepare()
        ChapelUpgrade.prepare()

        return new Earth(
            "Sanctuary",
            new Armoury(
                ArmouryUpgrade, 
                Building.CLOSED, 
                Blacksmith.create(),
                new Forge(),
                new Anvil(),
                200, 500
            ),
            new Shop(
                ShopUpgrade,
                Building.OPEN,
                ShopKeeper.create(),
                new WeaponShelf(),
                new ArmorShelf(),
                700, 500
            ),
            new Tavern(
                TavernUpgrade,
                Building.CLOSED,
                TavernKeeper.create(),
                Beds['woodenBed'](),
                900, 500
            ),
            new Chapel(
                ChapelUpgrade,
                Building.CLOSED,
                new Shrines(
                    new WarTemple(
                        new Atrius(),
                        1
                    ),
                    new LoveShrine(
                        new Aphrodite(),
                        3
                    ),
                    new PeaceSanctuary(
                        new MahatmaGhandi(),
                        1
                    ),
                    new GreedSanctum(
                        new Prutus(),
                        1
                    ),
                    new LabourAltar(
                        new Gaia(),
                        5
                    )
                ), null,
                null,
                1300, 500
            ),
            new ExpeditionPost(
                null,
                Building.OPEN,
                new QuestGiver(
                    "Sanctuary village Chief",
                    0,
                    80,
                    500,
                    new SanctuaryQuestList(),
                    null
                )
            )
        )
    }
}

module.exports = Earth