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
export const extractOTP = message => {
  const formatMessage = message.replace(/(\r\n|\n|\r)/gm, "");
  const start = formatMessage.indexOf('Use OTP') + 8;
  return formatMessage.substr(start, 4);
}
export const getTextFromBot = (messages, botName) => {
  const bot = findBot(messages, botName);
  return bot ? extractOTP(bot.text) : "";
};
