const startBot = async (bot, botConfig = {}) => {
    try {
        await bot.launch()
        .then(() => console.log(`Bot @${bot.botInfo.username} started!`));
    }
    catch(e) {
        console.error(e)
    }
};

module.exports = startBot;