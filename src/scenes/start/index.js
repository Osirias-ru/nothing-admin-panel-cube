const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("start");

scene.enter((ctx) => {
  const message = `Добро пожаловать, ${ctx.from.first_name}! Что будем делать?`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Статистика", "onDev"),
    ],
    [
      Markup.button.callback("Управление", "manage"),
    ],
    [
      Markup.button.callback("Рассылка", "onDev"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("onDev", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("onDev");
});

scene.action("manage", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manage");
});

module.exports = scene;
