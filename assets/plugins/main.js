// It's good practice to use strict mode to catch common coding errors.
"use strict";

window.main = {
  // A consistent data object
  data: {
    id: "kilo",
    name: "djjfjjdf",
    gmail: "married@",
    coin: 0,
    
  },

  // A helper function to consistently send messages using a clear protocol
  _sendMessage: function (type, payload) {
    if (window.Toaster) {
      window.Toaster.postMessage(
        JSON.stringify({
          type: type,
          payload: payload,
        })
      );
    }
    console.log("Sent message to Flutter with type:", type, "and payload:", payload);
  },

  // A method for sending a greeting
  greeting: function () {
    this._sendMessage("greeting", "Hello greeting");
  },

  // A method for sending a more complex message with a callback.
  // The callback now receives a structured message.
  sayHello: function (name, callback) {
    console.log("hello " + name);
    // Send a message via the helper function with a callback identifier
    this._sendMessage("sayHello", { name: name });

    // Assuming the callback is handled on the Flutter side and responds
    // back with a message, which is a more reliable pattern.
    // However, if you need an immediate callback, that's a different pattern.
  },

  // A method for sending a "Back" message
  flutter: function () {
    this._sendMessage("back", null);
  },

  // A corrected method to set data, ensuring 'this' context is correct
  setData: function () {
    //this.data = d;
    console.log("Data updated to:", this.data);
  },
};


window.game_sayHello_simple = function () {
  if (window.Toaster) {
    window.Toaster.postMessage(JSON.stringify({ type: "simpleHello" }));
  }
  console.log("hello");
};


