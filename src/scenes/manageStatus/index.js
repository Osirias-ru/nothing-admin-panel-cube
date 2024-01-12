const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("manageStatus");

scene.enter((ctx) => {
  const message = `Управление статусом пользователя`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Установить", "setStatus"),
    ],
    [
      Markup.button.callback("Назад", "home"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("setStatus", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("setStatus");
});


scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

module.exports = scene;
