const { Markup, Scenes } = require("telegraf");
const { searchUser, setStatus } = require("../../database");

const scene = new Scenes.BaseScene("setStatus");
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback("Отмена", "home")]
]);

const keyboard_status = Markup.inlineKeyboard([
  [Markup.button.callback("Beginer", "beginner")],
  [Markup.button.callback("Silver", "silver")],
  [Markup.button.callback("Gold", "gold")],
  [Markup.button.callback("Platinum", "platinum")],
  [Markup.button.callback("Diamond", "diamond")],
  [Markup.button.callback("Отмена", "home")]
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

scene.action("beginner", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  const status = setStatus(ctx.session.user, 'beginner');

  if (status === false) {
    await ctx.reply(`Не удалось выдать статус ${status}`);
    return ctx.scene.enter("manageUsers");
  } 

  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

scene.action("silver", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  const status = setStatus(ctx.session.user, 'silver');

  if (status === false) {
    await ctx.reply(`Не удалось выдать статус ${status}`);
    return ctx.scene.enter("manageUsers");
  } 

  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

scene.action("gold", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  const status = setStatus(ctx.session.user, 'gold');

  if (status === false) {
    await ctx.reply(`Не удалось выдать статус ${status}`);
    return ctx.scene.enter("manageUsers");
  }

  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

scene.action("platinum", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  const status = setStatus(ctx.session.user, 'platinum');

  if (status === false) {
    await ctx.reply(`Не удалось выдать статус ${status}`);
    return ctx.scene.enter("manageUsers");
  }

  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
});

scene.action("diamond", async (ctx) => {
  ctx.scene.state.nextStep = "awaitingName";
  const status = setStatus(ctx.session.user, 'diamond');

  if (status === false) {
    await ctx.reply(`Не удалось выдать статус ${status}`);
    return ctx.scene.enter("manageUsers");
  }

  await ctx.deleteMessage();
  ctx.scene.enter("manageUsers");
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

    ctx.session.user = userDB;

    await ctx.deleteMessage();
    await ctx.reply(
      `Выберете статус для пользователя`, keyboard_status
    );
  }
});

module.exports = scene;
