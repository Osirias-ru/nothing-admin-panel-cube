const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./manage'),
    require('./managePromo'),
    require('./manageUsers'),

    require('./createRef'),
    require('./removePromocode'),
    require('./listPromocode'),

    require('./createHeapPromo'),
    require('./removeHeapPromo'),

    require('./manageBallance'),
    require('./setBal'),
    require('./changeBal'),

    require('./manageSubscription'),
    require('./setSubscribe'),
    require('./changeSubscribe'),

    require('./manageRolls'),
    require('./setRolls'),
    require('./changeRolls'),


    require('./onDev'),
]);

module.exports = stage;