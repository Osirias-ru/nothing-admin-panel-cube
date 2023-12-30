const { Markup, Scenes } = require("telegraf");
const { insertMultiplePromoCodes } = require("../../database");

const scene = new Scenes.BaseScene("createHeapPromo");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Назад", "home")],
]);

scene.enter((ctx) => {
  const message = `Куча промокодов - за раз создаст множество промокодов с одинаковым префиксом\n\nУкажите префикс, не используйте символ _`;
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
    const promoPrefix = ctx.message.text;
    ctx.scene.state.nextStep = "awaitingInfo";

    ctx.session.promoPrefix = promoPrefix;

    await ctx.reply(
      `Префикс "${promoPrefix}" записан!\nВведите кол-во промокодов и количество монет (например, "100/50" создаст кучу из 100 кодов по 50 монет)`,
      keyboard
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;

    const [quantity, coins] = inputText.split("/").map(Number);

    if (!coins || !quantity) {
      await ctx.deleteMessage();
      return await ctx.reply("Введите соообщение в формате <количество>/<монеты>", keyboard);
    }
    const newPromo = await insertMultiplePromoCodes(ctx.session.promoPrefix, quantity, coins);
    if (!newPromo) {
      await ctx.reply(
        `Не удалось создать кучу промокодов промокод "${ctx.session.promoPrefix}"\nПроверьте консоль`
      );
      ctx.scene.state.nextStep = "awaitingName";
      return ctx.scene.enter("managePromo");
    }
    await ctx.reply(
      `Куча промокодов "${ctx.session.promoPrefix}" успешно создана!\nКоличество кодов: ${quantity}, Монетки: ${coins}`
    );
    ctx.scene.state.nextStep = "awaitingName";
    ctx.scene.enter("managePromo");
  }
});

module.exports = scene;
