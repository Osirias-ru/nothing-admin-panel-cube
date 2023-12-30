const { Markup, Scenes } = require("telegraf");
const { insertPromoCode } = require("../../database");

const scene = new Scenes.BaseScene("createPromo");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Назад", "home")],
]);

scene.enter((ctx) => {
  const message = `Вперед! Укажите название нового промокода`;
  ctx.scene.state.nextStep = "awaitingName";

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  ctx.scene.enter("managePromo");
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const promoCode = ctx.message.text;
    ctx.scene.state.nextStep = "awaitingInfo";

    ctx.session.promoCode = promoCode;

    await ctx.reply(
      `Промокод "${promoCode}" записан!\nВведите количество активаций и монет(например, "100/50" создаст код на 100 активаций по 50 монет)`,
      keyboard
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;

    const [activations, coins] = inputText.split("/").map(Number);

    if (!coins || !activations) {
      await ctx.deleteMessage();
      return await ctx.reply("Введите соообщение в формате <активации>/<монеты>", keyboard);
    }
    const newPromo = insertPromoCode(ctx.session.promoCode, activations, coins);
    if (!newPromo) {
      await ctx.reply(
        `Не удалось создать промокод "${ctx.session.promoCode}"\nПроверьте консоль`
      );
      ctx.scene.state.nextStep = "awaitingName";
      return ctx.scene.enter("managePromo");
    }
    await ctx.reply(
      `Промокод "${ctx.session.promoCode}" успешно создан!\nКоличество активаций: ${activations}, Монетки: ${coins}`
    );
    ctx.scene.state.nextStep = "awaitingName";
    ctx.scene.enter("managePromo");
  }
});

module.exports = scene;
