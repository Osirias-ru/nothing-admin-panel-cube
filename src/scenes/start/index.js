const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("start");

scene.enter((ctx) => {
  const message = `Добро пожаловать, ${ctx.from.first_name}! Что будем делать?`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Создать промокод", "createPromo"),
      Markup.button.callback("Удалить промокод", "removePromo"),
      Markup.button.callback("Список промокодов", "listPromo"),
    ],
    [
      Markup.button.callback("Добавить подписку", "addSub"),
    ],
    [
      Markup.button.callback("Изменить броски", "changeRolls"),
      Markup.button.callback("Изменить баланс", "changeBal"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("createPromo", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("createPromo");
});

scene.action("removePromo", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("removePromo");
});
scene.action("listPromo", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("listPromo");
});
scene.action("addSub", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("addSub");
});
scene.action("changeRolls", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("changeRolls");
});
scene.action("changeBal", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("changeBal");
});

module.exports = scene;
