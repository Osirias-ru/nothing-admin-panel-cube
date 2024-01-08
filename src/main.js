require('dotenv').config();

const bot = require('./core/bot');
const session = require('./core/session');
const stage = require('./scenes');
const startBot = require('./utils/startBot');
const {createConnection} = require('./database')

bot.use(session);
bot.use(stage.middleware());

createConnection()

const allowedUserIds = [1280865837, 1788067264, ];

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
