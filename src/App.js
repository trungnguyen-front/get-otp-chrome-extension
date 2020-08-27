import React, { useState } from "react";
import {
  getAllThreadMessageService,
  postSlackMessageService,
} from "./services";
import { getChannel, getThreadMessageId } from "./selectors";
import {delay, getTextFromBot} from "./helpers";
import {BOT_NAME, DELAY_TIME} from "./config";

export const getOtp = async (phone = "0716163120") => {
  const message = `!sms get otp ${phone}`;
  const postMessage = await postSlackMessageService(message);
  const channel = getChannel(postMessage);
  const ts = getThreadMessageId(postMessage);
  return [channel, ts];
};

function App() {
  const [channel, setChannel] = useState("");
  const [ts, setTs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const [channel, ts] = await getOtp();
      setChannel(channel);
      setTs(ts);
      await delay(DELAY_TIME);
      const messages = await getAllThreadMessageService({ channel, ts });
      setOtp(getTextFromBot(messages,BOT_NAME.TEST));
    } catch (error) {
      setOtp("Error");
    }
    setIsLoading(false);
  };


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleRequest} disabled={isLoading}>{isLoading ? "Loading..." : 'Get OTP'}</button>
          {otp}
      </header>
    </div>
  );
}

export default App;
