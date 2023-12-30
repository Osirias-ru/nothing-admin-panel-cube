const { Markup, Scenes } = require("telegraf");
const { searchUser, updateVipStatus } = require("../../database");

const scene = new Scenes.BaseScene("changeSub");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Отмена", "home")],
]);

const subKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Неделя", "add-7"),
    Markup.button.callback("Месяц", "add-30"),
    Markup.button.callback("3 месяца", "add-90"),
    Markup.button.callback("Полгода", "add-180"),
    Markup.button.callback("Год", "add-360"),
  ],
  [Markup.button.callback("Назад", "home")],
]);

scene.enter((ctx) => {
  const message = `Введите tg_id или юзернейм пользователя`;
  ctx.scene.state.nextStep = "awaitingName";

  ctx.reply(message, keyboard);
});

scene.action("home", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

scene.action("add-7", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  await addSub(ctx, 7);
});
scene.action("add-30", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  await addSub(ctx, 30);
});
scene.action("add-90", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  await addSub(ctx, 90);
});
scene.action("add-180", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  await addSub(ctx, 180);
});
scene.action("add-360", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  await ctx.deleteMessage();
  await addSub(ctx, 360);
});

scene.hears(/.*/, async (ctx) => {
  if (ctx.scene.state.nextStep === "awaitingName") {
    const user = ctx.message.text;
    const userDB = await searchUser(user);
    if (userDB === false) {
      await ctx.reply(`Не удалось найти пользователя ${user}`);
      return ctx.scene.enter("manageUsers");
    } else if (!userDB) {
      await ctx.reply(`Произошла ошибка при поиске пользователя ${user}`);
      return ctx.scene.enter("manageUsers");
    }
    ctx.scene.state.nextStep = "awaitingInfo";

    ctx.session.user = userDB;

    await ctx.reply(
      `Выберите на сколько дней нужно выдать подписку\nВы можете также ввести любой срок, написав кол-во дней числом. Чтобы вычесть дни подписки добавть перед чилом -`,
      subKeyboard
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;
    const days = parseInt(inputText);

    if (isNaN(days)) {
      await ctx.deleteMessage();
      return await ctx.reply(
        "Введите соообщение в формате <кол-во дней>, или выберите срок ниже",
        subKeyboard
      );
    }
    await addSub(ctx, days);
  }
});

async function addSub(ctx, days) {
  const newSubDays = await updateVipStatus(ctx.session.user.tg_id, days);
  if (newSubDays === null) {
    await ctx.reply(`Не удалось изменить дни подписки\nПроверьте консоль`);
    ctx.scene.state.nextStep = "awaitingName";
    return ctx.scene.enter("manageUsers");
  }
  await ctx.reply(
    `Пользователю ${
      ctx.session.user.nickname
        ? ctx.session.user.nickname
        : ctx.session.user.tg_id
    } изменены дни подписки!\nКоличество дней: ${newSubDays}`
  );
  ctx.scene.state.nextStep = "awaitingName";
  ctx.scene.enter("manageUsers");
}

module.exports = scene;
