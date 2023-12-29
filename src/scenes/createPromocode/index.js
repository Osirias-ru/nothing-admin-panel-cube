const { Markup, Scenes } = require("telegraf");
const { insertPromoCode } = require("../../database");

const scene = new Scenes.BaseScene("createPromo");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Отмена", "home")],
]);

scene.enter((ctx) => {
  const message = `Вперед! Укажите название нового промокода`;
  ctx.scene.state.nextStep = "awaitingName";

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  ctx.scene.enter("start");
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const promoCode = ctx.message.text;
    ctx.scene.state.nextStep = "awaitingInfo";

    ctx.session.promoCode = promoCode;

    await ctx.reply(
      `Промокод "${promoCode}" записан!\nВведите количество монет и активаций(например, "100/50" создаст код на 50 активаций по 100 монет)`,
      keyboard
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;

    const [coins, activations] = inputText.split("/").map(Number);

    if (!coins || !activations) {
      await ctx.deleteMessage();
      return await ctx.reply("Введите соообщение в формате <монеты>/<активации>", keyboard);
    }
    const newPromo = insertPromoCode(ctx.session.promoCode, activations, coins);
    if (!newPromo) {
      await ctx.reply(
        `Не удалось создать промокод "${ctx.session.promoCode}"\nПроверьте консоль`
      );
      ctx.scene.state.nextStep = "awaitingName";
      return ctx.scene.enter("start");
    }
    await ctx.reply(
      `Промокод "${ctx.session.promoCode}" успешно создан!\nКоличество активаций: ${activations}, Монетки: ${coins}`
    );
    ctx.scene.state.nextStep = "awaitingName";
    ctx.scene.enter("start");
  }
});

module.exports = scene;
