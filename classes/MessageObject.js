const express = require("express");
const app = express();
app.locals.CurrentDate = null;

class MessageObject {
  constructor(id, refid, type, content, time, replyHandler) {
    this.id = id;
    this.refid = refid;
    this.content = content;
    this.time = time;
    this.type = type;
    this.replyHandler = replyHandler;
  }

  toJson() {
    return {
      type: this.type,
      id: this.id,
      refid: this.refid,
      content: this.content,
      time: this.time,
      replyHandler: this.replyHandler,
    };
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getTime() {
    return this.time;
  }

  setTimeAsCurrentTime() {
    this.time = new Date();
  }

  getRefId() {
    return this.refid;
  }

  getType() {
    return this.type;
  }

  getContent() {
    return this.content;
  }

  isNotNullOrEmpty(myObject) {
    if (myObject !== null && myObject !== undefined) {
      const userId = myObject.userId;
      if (!userId) {
        return false;
      } else {
        for (const key of Object.keys(myObject)) {
          if (
            key !== "EncryptedIndex" &&
            key !== "startTime" &&
            key !== "endTime"
          ) {
            const value = myObject[key];
            if (value === null || value === undefined) {
              return false;
            }
          }
        }
        return true;
      }
    } else {
      return false;
    }
  }

  checkSessionEntity() {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    let sessionDateTime = app.locals.CurrentDate;

    if (!sessionDateTime) {
      app.locals.CurrentDate = currentDate;
      return true;
    } else {
      sessionDateTime = new Date(sessionDateTime).setHours(0, 0, 0, 0);

      if (sessionDateTime < currentDate) {
        app.locals.CurrentDate = currentDate;
        return true;
      } else {
        return false;
      }
    }
  }

 
}

module.exports = MessageObject;
