class Properties {
  constructor(correlationId, replyTo, type, messageId) {
    this.correlationId = correlationId;
    this.replyTo = replyTo;
    this.type = type;
    this.messageId = messageId;
    this.contentType = "application/json";
  }

  toJson() {
    return {
      type: this.type,
      messageId: this.messageId,
      replyTo: this.replyTo,
      correlationId: this.correlationId,
      deliveryMode: 2,
      contentType: this.contentType,
    };
  }
}

module.exports = Properties;
