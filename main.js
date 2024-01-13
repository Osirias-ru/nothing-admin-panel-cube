require("dotenv").config();

const session = require("./src/core/session");
const stage = require("./src/scenes");
const startBot = require("./src/utils/startBot");
const { createConnection } = require("./src/database");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session);
bot.use(stage.middleware());

createConnection();

const allAllowedUserIds = [1280865837, 1788067264, 715074066];
const supportsIDs = [
  1032527933, 5783423792, 1023140548, 757164729, 5152121100, 1214281828,
  1226663482, 5367089466, 6616756525, 5140781119, 5578765515, 5537871320,
  1786645312, 872845362, 1499163175, 1580601460,
];

const checkUserId = (ctx, next) => {
  const userId = ctx.message.from.id;

  if (allAllowedUserIds.includes(userId)) {
    return next();
  } else if (supportsIDs.includes(userId)) {
    return ctx.scene.enter("SUPmanage");
  } else {
    ctx.reply(
      "Что это мы тут забыли? Начитерить хотим, да?\nДавай, это, брысь"
    );
  }
};

bot.command("start", checkUserId, (ctx) => ctx.scene.enter("start"));

startBot(bot);
