/* global chrome */

export const notify = (title, message) => {
  const options = {
    type: "basic",
    iconUrl: "48.png",
    title,
    message,
  };
  chrome.notifications.create("notificationId", options);
};
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export const findBot = (messages, botName) => {
  return messages.find((message) => {
    const {
      bot_profile: { name },
    } = message;
    return name === botName;
  });
};
export const getTextFromBot = (messages, botName) => {
  const bot = findBot(messages, botName);
  return bot ? bot.text : "";
};
