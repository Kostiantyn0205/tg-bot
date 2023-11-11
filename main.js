const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const botToken = '6789789435:AAGXBoHP2jr4WIOmrZyHK78Cf2j_Rt0LPSk';
const weatherApiKey = '0a43173ed967face9c38c6b47a4065bd';

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет! Я бот погоды. Введи /weather, чтобы узнать текущую погоду и получить совет по одежде.');
});
nm
bot.onText(/\/weather/, async (msg) => {
    try {
        const chatId = msg.chat.id;

        const geocoding = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=Kharkiv&limit=5&appid=${weatherApiKey}`);
        const lat = geocoding.data[0].lat;
        const lon = geocoding.data[0].lon;

        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&appid=${weatherApiKey}`);
        // const temperature = weatherResponse.data.main.temp;
        const temperature = (weatherResponse.data.main.temp - 273.15).toFixed(0);
        const weatherDescription = weatherResponse.data.weather[0].description;

        let advice = 'Наденьте что-то уютное!';

        // Добавь логику для советов по одежде на основе погоды.

        const message = `Текущая погода: ${temperature}°C, ${weatherDescription}. ${advice}`;
        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error fetching weather:', error);
        bot.sendMessage(msg.chat.id, 'Извините, что-то пошло не так.');
    }
});