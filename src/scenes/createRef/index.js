const { Markup, Scenes } = require("telegraf");
const { insertRef } = require("../../database");

const scene = new Scenes.BaseScene("createRef");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Назад", "home")],
]);

scene.enter((ctx) => {
  const message = `Вперед! Укажите название новой рефералки`;
  ctx.scene.state.nextStep = "awaitingName";

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  ctx.scene.enter("manageRef");
});


scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const ref = ctx.message.text;
    const newRef = await insertRef(ref);
    if(newRef) {
      await ctx.reply(
        `Рефералка "${ref}" записана!`,
        keyboard
      );
    }
    else {
      await ctx.reply(
        `Не удалось создать рефералку "${ref}"\nПроверьте консоль и убедитесь что рефералки с таким именем нет`
      );
      ctx.scene.state.nextStep = "awaitingName";
      return ctx.scene.enter("manageRef");
    }
  }
});

module.exports = scene;
