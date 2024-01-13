const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("SUPmanage");

scene.enter((ctx) => {
  const message = `Управление промокодами и данными пользователей`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Пользователи", "manageUsers"),
    ],
    [
      Markup.button.callback("Назад", "home"),
    ],
  ]);

  ctx.reply(message, keyboard);
});


scene.action("manageUsers", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

module.exports = scene;
