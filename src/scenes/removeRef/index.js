const { Markup, Scenes } = require("telegraf");
const { getRef, removeRef } = require("../../database");

const scene = new Scenes.BaseScene("removePromo");

scene.enter((ctx) => {
  const message = `Что то не понравилось? Тогда просто удалим это!`;
  ctx.scene.state.nextStep = "awaitingName";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Назад", "home")],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  ctx.scene.enter("managePromo");
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const ref = ctx.message.text;
    const refData = await getRef(ref);
    if(!refData) {
      await ctx.reply(
        `Рефералки "${ctx.message.text}" не существует`,
      );
      return ctx.scene.enter("managePromo");
    }
    ctx.scene.state.nextStep = ref;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("Да", "confirmRemove"),
        Markup.button.callback("Нет", "home"),
      ],
    ]);

    ctx.reply(
      `Реферлка "${ref}" - ${refData.users} пользователей.\nВы точно хотите её удалить?`,
      keyboard
    );
  }
});

scene.action("confirmRemove", async (ctx) => {
  const ref = ctx.scene.state.nextStep;
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  const rRef = await removeRef(ref);
  if (!rRef)
    ctx.reply(`Не удалось удалить рефералку ${ref}. Проверьте консоль`);
  ctx.scene.enter("managePromo");
});

module.exports = scene;
