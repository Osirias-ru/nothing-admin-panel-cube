const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("manageRef");

scene.enter((ctx) => {
  const message = `Управление рефералками`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Создать рефералку", "createRef"),
      Markup.button.callback("Удалить рефералку", "removeRef"),
    ],
    [
      Markup.button.callback("Список промокодов", "listRef"),
    ],
    [
      Markup.button.callback("Отмена", "home"),
    ],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("createRef", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("createRef");
});

scene.action("removeRef", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("removeRef");
});
scene.action("listRef", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("listRef");
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

module.exports = scene;
