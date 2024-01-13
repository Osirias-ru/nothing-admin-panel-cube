const { Markup, Scenes } = require("telegraf");
const { getRef, getUsersByReferral } = require("../../database");

const scene = new Scenes.BaseScene("getAllUserRef");

scene.enter(async (ctx) => {
  ctx.scene.state.currentPage = 1;
  ctx.scene.state.nextStep = "awaitingName";

  const txt = "Введите имя рефералки по которой нужно получить статистику"
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Назад", "home")],
  ]);

  const message = await ctx.reply(txt, keyboard);
  ctx.scene.state.messageId = message.message_id;
});

async function canNavigateNext(ctx) {
  const nextPageData = await getUsersByReferral(ctx.scene.state.nextStep, ctx.scene.state.currentPage + 1);
  return nextPageData && nextPageData.length > 0;
}

async function canNavigatePrev(ctx) {
  return ctx.scene.state.currentPage > 1;
}

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("manageRef");
});

scene.hears(/.*/, async (ctx) => {
    if (ctx.scene.state.nextStep === "awaitingName") {
      const ref = ctx.message.text;
      const refData = await getRef(ref);
      if(!refData) {
        await ctx.reply(
          `Рефералки "${ctx.message.text}" не существует`,
        );
        return ctx.scene.enter("manageRef");
      }
      ctx.scene.state.nextStep = ref;
      await sendPromoCodes(ctx);
    }
});

scene.action("nextPage", async (ctx) => {
  if (await canNavigateNext(ctx)) {
    ctx.scene.state.currentPage++;
    await sendPromoCodes(ctx);
  }
});

scene.action("prevPage", async (ctx) => {
  if (await canNavigatePrev(ctx)) {
    ctx.scene.state.currentPage--;
    await sendPromoCodes(ctx);
  }
});

async function sendPromoCodes(ctx) {
    try {
      let message = "";
      const promoCodesPage = await getUsersByReferral(ctx.scene.state.nextStep, ctx.scene.state.currentPage);
  
      if (promoCodesPage && promoCodesPage.length > 0) {
        promoCodesPage.forEach((user) => {
          message += `<code>${user.tg_id}</code> - бросков: ${user.rolls}, ранг: ${user.status}, побед: ${user.win}\n`;
        });
      } else {
        message = "Пользователи отсутствуют на текущей странице.";
      }
  
      const canNavigatePrevValue = await canNavigatePrev(ctx);
      const canNavigateNextValue = await canNavigateNext(ctx);
  
      // Обновление клавиатуры с учетом возможности навигации
      const updatedKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "Предыдущая страница",
            "prevPage",
            !canNavigatePrevValue
          ),
          Markup.button.callback(
            "Следующая страница",
            "nextPage",
            !canNavigateNextValue
          ),
        ],
        [Markup.button.callback("Назад", "home")],
      ]);
  
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        ctx.scene.state.messageId,
        null,
        message,
        { ...updatedKeyboard, disable_web_page_preview: true, parse_mode: "HTML",}
      );
    } catch (error) {
      console.error("Произошла ошибка при отправке рефералок:", error);
    }
  }
  
module.exports = scene;
