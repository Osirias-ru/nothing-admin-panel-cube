const { Markup, Scenes } = require("telegraf");
const { searchUser, updateBal } = require("../../database");

const scene = new Scenes.BaseScene("changeBal");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Отмена", "home")],
]);

scene.enter((ctx) => {
  const message = `Введите tg_id или юзернейм пользователя`;
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
    const user = ctx.message.text;
    const userDB = await searchUser(user);
    if (userDB === false) {
      await ctx.reply(`Не удалось найти пользователя ${user}`);
      return ctx.scene.enter("start");
    } else if (!userDB) {
      await ctx.reply(`Произошла ошибка при поиске пользователя ${user}`);
      return ctx.scene.enter("start");
    }
    ctx.scene.state.nextStep = "awaitingInfo";

    ctx.session.user = userDB;

    await ctx.reply(
      `Введите число для изменения текущих монеток\nЕсли вы хотите забрать монетки, то поставте перед числом -`,
    );
  } else if (ctx.scene.state.nextStep === "awaitingInfo") {
    const inputText = ctx.message.text;
    const rolls = parseInt(inputText);

    if (isNaN(rolls)) {
      await ctx.deleteMessage();
      return await ctx.reply(
        "Введите соообщение в формате <кол-во монет>"
      );
    }
    await changeRolls(ctx, rolls);
  }
});

async function changeRolls(ctx, coins) {
  const newCoins = await updateBal(ctx.session.user.tg_id, coins);
  if (newCoins === null) {
    await ctx.reply(`Не удалось изменить броски\nПроверьте консоль`);
    ctx.scene.state.nextStep = "awaitingName";
    return ctx.scene.enter("start");
  }
  await ctx.reply(
    `Пользователю ${
      ctx.session.user.nickname
        ? ctx.session.user.nickname
        : ctx.session.user.tg_id
    } изменен баланс!\nКоличество монеток: ${newCoins}`
  );
  ctx.scene.state.nextStep = "awaitingName";
  ctx.scene.enter("start");
}

module.exports = scene;
