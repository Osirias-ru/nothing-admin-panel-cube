const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("manageBallance");

scene.enter((ctx) => {
  const message = `Управление балансом пользователя`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Установить", "setBal"),
    ],
    [
      Markup.button.callback("Изменить", "changeBal"),
    ],
    [
      Markup.button.callback("Назад", "home"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("setBal", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("setBal");
});

scene.action("changeBal", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("changeBal");
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

module.exports = scene;
