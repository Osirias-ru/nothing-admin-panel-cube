require('dotenv').config();

const session = require('./src/core/session');
const stage = require('./src/scenes');
const startBot = require('./src/utils/startBot');
const {createConnection} = require('./src/database')
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session);
bot.use(stage.middleware());

createConnection()

const allAllowedUserIds = [1280865837, 1788067264, 715074066];
const supportsAccountsUserIds = process.env.SUPPORTS.split(",")
const supportsIDs = supportsAccountsUserIds.map(str => parseInt(str, 10));


const checkUserId = (ctx, next) => {
    const userId = ctx.message.from.id;
  
    if (allAllowedUserIds.includes(userId)) {
      return next();
    } else if (supportsIDs.includes(userId)){
      try {ctx.scene.enter('SUPmanage')}
      catch(e) {console.error(e)}
    } else {
      ctx.reply('Что это мы тут забыли? Начитерить хотим, да?\nДавай, это, брысь');
    }
  };

bot.command('start', checkUserId, (ctx) => ctx.scene.enter('start'));

startBot(bot);
