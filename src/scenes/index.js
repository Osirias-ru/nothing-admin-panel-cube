const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./manage'),
    require('./SUPmanage'),
    require('./manageRef'),
    require('./manageUsers'),

    require('./createRef'),
    require('./removeRef'),
    require('./listRef'),
    require('./getAllReferalUsers'),

    require('./manageBallance'),
    require('./setBal'),
    require('./changeBal'),

    require('./manageRolls'),
    require('./setRolls'),
    require('./changeRolls'),
    
    require('./manageStatus'),
    require('./setStatus'),

    require('./onDev'),
]);

module.exports = stage;