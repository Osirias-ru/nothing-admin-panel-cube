const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./createPromocode'),
    require('./removePromocode'),
    require('./listPromocode'),
    require('./addSubscribe'),
    require('./changeRolls'),
    require('./changeBal'),
]);

module.exports = stage;