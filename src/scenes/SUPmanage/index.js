const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("SUPmanage");

scene.enter((ctx) => {
  const message = `Управление пользователями`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Баланс", "manageBallance")],
    [Markup.button.callback("Статус", "manageStatus")],
    [Markup.button.callback("Крутки", "manageRolls")],
  ]);
  
  ctx.reply(message, keyboard);
});

scene.action("manageBallance", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageBallance");
});

scene.action("manageStatus", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageStatus");
});

scene.action("manageRolls", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageRolls");
});


module.exports = scene;
