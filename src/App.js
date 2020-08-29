import React, { useState, useEffect } from "react";
import {
  getAllThreadMessageService,
  postSlackMessageService,
} from "./services";
import { getChannel, getThreadMessageId } from "./selectors";
import { delay, getTextFromBot, fetchSavedPhone, savePhone } from "./helpers";
import { BOT_NAME, DELAY_TIME, PHONE_KEY_STORAGE } from "./config";

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
  const [otpTest, setOtpTest] = useState("");
  const [otpStaging, setOtpStaging] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchSavedPhone((objectResult) => {
      if (objectResult && objectResult[PHONE_KEY_STORAGE]) {
        setPhone(objectResult[PHONE_KEY_STORAGE]);
      }
    });
  }, []);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const [channel, ts] = await getOtp(phone);
      setChannel(channel);
      setTs(ts);
      await delay(DELAY_TIME);
      const messages = await getAllThreadMessageService({ channel, ts });
      setOtpTest(getTextFromBot(messages, BOT_NAME.TEST));
      setOtpStaging(getTextFromBot(messages, BOT_NAME.STAGING));
    } catch (error) {
      setOtpTest("Error");
      setOtpStaging("Error");
    }
    setIsLoading(false);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    console.log("handleSave", phone);
    savePhone(phone);
    setIsSaving(false);
    setIsEdit(false);
  };

  const handleInput = (e) => {
    setPhone(e.target.value);
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="phone-container">
          <input
            className="phone-input"
            type="text"
            value={phone}
            disabled={!isEdit}
            onChange={handleInput}
          />
          {!isEdit && (
            <button className="btn-secondary btn-edit" onClick={handleEdit}>
              Edit
            </button>
          )}
          {isEdit && (
            <button
              className="btn-secondary btn-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              Save
            </button>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={handleRequest}
          disabled={isLoading}
        >
          {isLoading ? "Getting..." : "Get OTP"}
        </button>
        <div className="otp">
          {otpTest && <p>SIT ${otpTest}</p>}
          {otpStaging && <p>SIT ${otpStaging}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
