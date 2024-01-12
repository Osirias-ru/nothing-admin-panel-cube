const { Markup, Scenes } = require("telegraf");
const { getAllPromoCodes } = require("../../database");

const scene = new Scenes.BaseScene("listPromo");

scene.enter(async (ctx) => {
  ctx.scene.state.currentPage = 1;
  const message = await ctx.reply("Получение рефералок...");
  ctx.scene.state.messageId = message.message_id;
  await sendPromoCodes(ctx);
});

async function canNavigateNext(ctx) {
  const nextPageData = await getAllPromoCodes(ctx.scene.state.currentPage + 1);
  return nextPageData && nextPageData.length > 0;
}

async function canNavigatePrev(ctx) {
  return ctx.scene.state.currentPage > 1;
}

scene.action("home", async (ctx) => {
  await ctx.deleteMessage();
  ctx.scene.enter("managePromo");
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
      const promoCodesPage = await getAllPromoCodes(ctx.scene.state.currentPage);
  
      if (promoCodesPage && promoCodesPage.length > 0) {
        promoCodesPage.forEach((ref) => {
          message += `<code>${ref.name}</code> - пользователей: ${ref.users}\n`;
        });
      } else {
        message = "Рефералки отсутствуют на текущей странице.";
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
