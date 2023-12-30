const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("managePromo");

scene.enter((ctx) => {
  const message = `Управление промокодами`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("Создать промо", "createPromo"),
      Markup.button.callback("Удалить промо", "removePromo"),
    ],
    [
      Markup.button.callback("Создать кучу промо", "createHeapPromo"),
      Markup.button.callback("Удалить кучу промо", "removeHeapPromo"),
    ],
    [
      Markup.button.callback("Список промокодов", "listPromo"),
    ],
    [
      Markup.button.callback("Отмена", "home"),
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
scene.action("createHeapPromo", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("createHeapPromo");
});
scene.action("removeHeapPromo", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("removeHeapPromo");
});
scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

module.exports = scene;
