let TELEGRAM_CONFIG = new TelegramConfig('');

//Telegram config class
function TelegramConfig(telegramToken) {
    this.TELEGRAM_TOKEN = telegramToken;
    this.TELEGRAM_URL = 'https://api.telegram.org/bot';
}

TelegramConfig.prototype.getFullUrl = function () {
    return this.TELEGRAM_URL + this.TELEGRAM_TOKEN;
};

//Bot class
function Bot(config, update) {
    this.config = config;
    this.update = update;
}

//Base bot methods
Bot.prototype.getMethodUrl = function (method) {
    return this.config.getFullUrl() + '/' + method;
};

Bot.prototype.register = function () {
    return this.request('setWebHook', {
        'url': ScriptApp.getService().getUrl()
    });
};

Bot.prototype.unregister = function () {
    return this.request('setWebHook', {});
};

Bot.prototype.getMe = function () {
    return this.request('getMe', {});
};

Bot.prototype.getMessageFromId = function () {
    return this.update.message.from.id;
};

Bot.prototype.request = function (method, data, parse) {
    if (parse === undefined) {
        parse = true;
    }

    const options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(data)
    };

    const response = UrlFetchApp.fetch(this.getMethodUrl(method), options);

    if (parse) {
        return JSON.parse(response.getContentText());
    }

    return response;
};

//Other bot methods
Bot.prototype.sendMessage = function (text, chatId) {
    chatId = chatId !== undefined ? chatId : this.getMessageFromId();

    return this.request('sendMessage', {
        'chat_id': chatId,
        'text': text
    });
};

Bot.prototype.sendChatAction = function (action, chatId) {
    chatId = chatId !== undefined ? chatId : this.getMessageFromId();

    this.request('sendChatAction', {
        chat_id: chatId,
        action: action
    });
};


//App functions
function setWebHook() {
    const bot = new Bot(TELEGRAM_CONFIG, {});

    bot.register();
}

function unsetWebHook() {
    const bot = new Bot(TELEGRAM_CONFIG, {});

    bot.unregister();
}

function getMe() {
    const bot = new Bot(TELEGRAM_CONFIG, {});

    bot.getMe();
}

function doPost(e) {
    if (e.postData.type === "application/json") {
        const update = JSON.parse(e.postData.contents);

        const bot = new Bot(TELEGRAM_CONFIG, update);

        bot.sendMessage('Hello');
    }
}

function doGet(e) {

}