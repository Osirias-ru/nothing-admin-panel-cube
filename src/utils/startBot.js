const startBot = (bot, botConfig = {}) => {
    bot.launch(botConfig)
        .then(() => console.log(`Bot @${bot.botInfo.username} started!`));
};

module.exports = startBot;