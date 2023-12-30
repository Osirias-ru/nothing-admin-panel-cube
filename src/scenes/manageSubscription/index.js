const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("manageSubscription");

scene.enter((ctx) => {
  const message = `Управление подпиской пользователя`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Установить", "setSub"),
    ],
    [
      Markup.button.callback("Изменить", "changeSub"),
    ],
    [
      Markup.button.callback("Назад", "home"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("setSub", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("setSub");
});

scene.action("changeSub", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("changeSub");
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

module.exports = scene;
