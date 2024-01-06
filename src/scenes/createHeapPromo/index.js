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
  if (ctx.scene.state.nextStep === "awaitingPrefix") {
    const promoPrefix = ctx.message.text;
    ctx.scene.state.nextStep = "awaitingInfo";

    ctx.session.promoPrefix = promoPrefix;

    await ctx.reply(
      `Префикс "${promoPrefix}" записан!\nВыберите тип промокодов`,
      ChooseTypekeyboard
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;

    const [quantity, count] = inputText.split("/").map(Number);

    if (!count || !quantity) {
      await ctx.deleteMessage();
      return await ctx.reply("Введите соообщение в формате <количество>/<награда>", keyboard);
    }
    const newPromo = await insertMultiplePromoCodes(ctx.session.promoPrefix, ctx.scene.state.type, quantity, count);
    if (!newPromo) {
      await ctx.reply(
        `Не удалось создать кучу промокодов промокод "${ctx.session.promoPrefix}"\nПроверьте консоль`
      );
      ctx.scene.state.nextStep = "awaitingName";
      return ctx.scene.enter("managePromo");
    }
    await ctx.reply(
      `Куча промокодов "${ctx.session.promoPrefix}" успешно создана!\nКоличество кодов: ${quantity}, тип: ${ctx.scene.state.type}, награда: ${count}`
    );
    ctx.scene.state.nextStep = "awaitingName";
    ctx.scene.enter("managePromo");
  }
});

module.exports = scene;
