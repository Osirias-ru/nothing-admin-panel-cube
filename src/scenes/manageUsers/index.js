const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("manageUsers");

scene.enter((ctx) => {
  const message = `Управление пользователями`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Баланс", "manageBallance")],
    [Markup.button.callback("Подписка", "manageSubscription")],
    [Markup.button.callback("Крутки", "manageRolls")],
    [Markup.button.callback("Отмена", "home")],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("manageBallance", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageBallance");
});

scene.action("manageSubscription", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageSubscription");
});

scene.action("manageRolls", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageRolls");
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

module.exports = scene;
