require("dotenv").config();

const session = require("./src/core/session");
const stage = require("./src/scenes");
const startBot = require("./src/utils/startBot");
const { createConnection } = require("./src/database");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session);
bot.use(stage.middleware());

const allAllowedUserIds = [1280865837, 1788067264, 715074066];
const supportsIDs = process.env.SUPPORTS_IDS.split(',').map(Number);
console.log(supportsIDs)

const checkUserId = (ctx, next) => {
  console.log("Проверка id")
  const userId = ctx.message.from.id;
  console.log("id-",userId)

  if (allAllowedUserIds.includes(userId)) {
    console.log("Админ")
    return next();
  } else if (supportsIDs.includes(userId)) {
    console.log("Сапорт")
    return ctx.scene.enter("SUPmanage");
  } else {
    ctx.reply(
      "Что это мы тут забыли? Начитерить хотим, да?\nДавай, это, брысь"
    );
  }
};

bot.command("start", checkUserId, (ctx) => ctx.scene.enter("start"));

createConnection()
  .then(async () => {
    console.log("Connected to the database");
    console.log("Включение бота")
    await startBot(bot);
  })
  .catch((error) => console.error("Error connecting to the database:", error));

bot.catch((error) => console.error("Telegraf error:", error));
