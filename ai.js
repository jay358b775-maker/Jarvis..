const JarvisAI = {
  status: "READY_FOR_BACKEND",

  history: [],

  async think(message) {
    if (!message || !message.trim()) {
      return "Please tell me what you need.";
    }

    this.history.push({
      role: "user",
      content: message
    });

    return "I received your request. My AI brain still needs a secure model connection.";
  },

  clearMemory() {
    this.history = [];
  }
};

window.JarvisAI = JarvisAI;
