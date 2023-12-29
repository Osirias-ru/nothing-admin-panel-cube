const { Markup, Scenes } = require("telegraf");
const { getPromoCode, removePromoCode } = require("../../database");

const scene = new Scenes.BaseScene("removePromo");

scene.enter((ctx) => {
  const message = `Что то не понравилось? Тогда просто удалим это!`;
  ctx.scene.state.nextStep = "awaitingName";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Отмена", "home")],
  ]);

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const promoData = await getPromoCode(ctx.message.text);
    const promoCode = ctx.message.text;
    if(!promoData.activations) {
      await ctx.reply(
        `Промокода "${ctx.message.text}" не существует`,
      );
      return ctx.scene.enter("start");
    }
    ctx.scene.state.nextStep = promoCode;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("Да", "confirmRemove"),
        Markup.button.callback("Нет", "home"),
      ],
    ]);

    ctx.reply(
      `Промокод "${promoCode}" - ${promoData.activations} активаций, ${promoData.coins} монет.\nВы точно хотите его удалить?`,
      keyboard
    );
  }
});

scene.action("confirmRemove", async (ctx) => {
  const promoCode = ctx.scene.state.nextStep;
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  await removePromoCode(promoCode);
  if (!removePromoCode)
    ctx.reply(`Не удалось удалить промокод ${promoCode}. Проверьте консоль`);
  ctx.scene.enter("start");
});

module.exports = scene;
