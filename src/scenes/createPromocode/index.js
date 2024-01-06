const { Markup, Scenes } = require("telegraf");
const { insertPromoCode } = require("../../database");

const scene = new Scenes.BaseScene("createPromo");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Назад", "home")],
]);

const ChooseTypekeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Монетки", "home"),
    Markup.button.callback("Гемы", "gems"),
    Markup.button.callback("Подписка", "vip_status"),
    Markup.button.callback("Броски", "rolls"),
    Markup.button.callback("Луна", "items"),
  ],
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

scene.action("coins", async (ctx) => {
  ctx.scene.state.type = "coins";
  ctx.scene.state.nextStep = "awaitingInfo";
  await ctx.deleteMessage();
  await ctx.reply(
    `Введите количество активаций и монет(например, "100/50" создаст код на 100 активаций по 50 монет)!`,
    keyboard
  );
});
scene.action("gems", async (ctx) => {
  ctx.scene.state.type = "gems";
  ctx.scene.state.nextStep = "awaitingInfo";
  await ctx.deleteMessage();
  await ctx.reply(
    `Введите количество активаций и гемов(например, "100/1" создаст код на 100 активаций по 1 паку на 60 гемов)!`,
    keyboard
  );
});
scene.action("items", async (ctx) => {
  ctx.scene.state.type = "items";
  ctx.scene.state.nextStep = "awaitingInfo";
  await ctx.deleteMessage();
  await ctx.reply(
    `Введите количество активаций и лун(например, "100/1" создаст код на 100 активаций по 1 луне)!`,
    keyboard
  );
});
scene.action("vip_status", async (ctx) => {
  ctx.scene.state.type = "vip_status";
  ctx.scene.state.nextStep = "awaitingInfo";
  await ctx.deleteMessage();
  await ctx.reply(
    `Введите количество активаций и дней(например, "100/30" создаст код на 100 активаций по 30 дневонй подписке)!`,
    keyboard
  );
});
scene.action("rolls", async (ctx) => {
  ctx.scene.state.type = "rolls";
  ctx.scene.state.nextStep = "awaitingInfo";
  await ctx.deleteMessage();
  await ctx.reply(
    `Введите количество активаций и бросков(например, "100/5" создаст код на 100 активаций по 5 броскам)!`,
    keyboard
  );
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const promoCode = ctx.message.text;
    ctx.scene.state.nextStep = "awaitingType";

    ctx.session.promoCode = promoCode;

    await ctx.reply(
      `Промокод "${promoCode}" записан!\nВыберите тип промокода`,
      ChooseTypekeyboard
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;

    const [activations, count] = inputText.split("/").map(Number);

    if (!count || !activations) {
      await ctx.deleteMessage();
      return await ctx.reply(
        "Введите соообщение в формате <активации>/<кол-во>",
        keyboard
      );
    }
    const newPromo = insertPromoCode(
      ctx.session.promoCode,
      ctx.scene.state.type,
      activations,
      count
    );
    if (!newPromo) {
      await ctx.reply(
        `Не удалось создать промокод "${ctx.session.promoCode}"\nПроверьте консоль`
      );
      ctx.scene.state.nextStep = "awaitingName";
      return ctx.scene.enter("managePromo");
    }
    await ctx.reply(
      `Промокод "${ctx.session.promoCode}" успешно создан!\nКоличество активаций: ${activations}, тип: ${ctx.scene.state.type}, награда: ${count}`
    );
    ctx.scene.state.nextStep = "awaitingName";
    ctx.scene.enter("managePromo");
  }
});

module.exports = scene;
