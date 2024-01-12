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

const allowedUserIds = [1280865837, 1788067264, 715074066];

const checkUserId = (ctx, next) => {
    const userId = ctx.message.from.id;
  
    if (allowedUserIds.includes(userId)) {
      return next();
    } else {
      ctx.reply('Что это мы тут забыли? Начитерить хотим, да?\nДавай, это, брысь');
    }
  };

bot.command('start', checkUserId, (ctx) => ctx.scene.enter('start'));

startBot(bot);
