const { Markup, Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("onDev");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Отмена", "home")],
]);

scene.enter(async (ctx) => {
  const message = `На разработке`;

  await ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

module.exports = scene;
