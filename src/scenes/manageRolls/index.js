const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("manageRolls");

scene.enter((ctx) => {
  const message = `Управление бросками пользователя`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Установить", "setRolls"),
    ],
    [
      Markup.button.callback("Изменить", "changeRolls"),
    ],
    [
      Markup.button.callback("Назад", "home"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("setRolls", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("setRolls");
});

scene.action("changeRolls", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("changeRolls");
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

module.exports = scene;
