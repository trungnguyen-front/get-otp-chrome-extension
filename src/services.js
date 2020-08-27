import axios from "axios";
import qs from "querystring";
import {CHANNEL_GET_OTP, TOKEN} from "./config";

// https://api.slack.com/methods/conversations.replies
export const getAllThreadMessageService = async ({ channel, ts }) => {
  const url = "https://slack.com/api/conversations.replies";
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        `Bearer ${TOKEN}`,
    },
  };
  const data = {
    channel,
    ts,
  };

  try {
    const postResult = await axios.post(url, qs.stringify(data), config);
    return postResult.data.messages;
  } catch (error) {
    return error;
  }
};

// https://api.slack.com/methods/chat.postMessage
export const postSlackMessageService = async (message) => {
  const url = "https://slack.com/api/chat.postMessage";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
          `Bearer ${TOKEN}`,
    },
  };
  const data = {
    channel: CHANNEL_GET_OTP,
    text: message,
  };

  try {
    const postMessageResult = await axios.post(
      url,
      JSON.stringify(data),
      config
    );
    return postMessageResult.data;
  } catch (error) {
    return error;
  }
};
