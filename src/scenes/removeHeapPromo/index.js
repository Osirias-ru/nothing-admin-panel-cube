const { Markup, Scenes } = require("telegraf");
const { countPromoCodesByPrefix, deletePromoCodesByPrefix } = require("../../database");

const scene = new Scenes.BaseScene("removeHeapPromo");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Назад", "home")],
]);

scene.enter((ctx) => {
  const message = `Укажите префикс кучи промокодов. Это удалит все промокоды данной этой кучи`;
  ctx.scene.state.nextStep = "awaitingPrefix";

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingPrefix";
  await ctx.deleteMessage();
  ctx.scene.enter("managePromo");
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingPrefix") {
    const promoData = await countPromoCodesByPrefix(ctx.message.text);
    const promoPrefix = ctx.message.text;
    if (!promoData) {
      await ctx.reply(`Кучи с префиксом "${ctx.message.text}" не существует`);
      return ctx.scene.enter("managePromo");
    }
    ctx.scene.state.nextStep = promoPrefix;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("Да", "confirmRemove"),
        Markup.button.callback("Нет", "home"),
      ],
    ]);

    ctx.reply(
      `Куча промокодов "${promoPrefix}" - ${promoData} промокодов.\nВы точно хотите её удалить?`,
      keyboard
    );
  }
});

scene.action("confirmRemove", async (ctx) => {
  const promoPrefix = ctx.scene.state.nextStep;
  ctx.scene.state.nextStep = "awaitingPrefix";
  await ctx.deleteMessage();
  const removePromoCode = await deletePromoCodesByPrefix(promoPrefix);
  if (!removePromoCode)
    ctx.reply(`Не удалось удалить кучу промокодов ${promoPrefix}. Проверьте консоль`);
  await ctx.reply(`Куча промокодов ${promoPrefix} удалена`);
  ctx.scene.enter("managePromo");
});

module.exports = scene;
