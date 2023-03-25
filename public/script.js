window.addEventListener("message", function (event) {
  // if (event.type === "EthSignKeychainEvent") {
  //   this.setTimeout(function () {
  //     window.postMessage({ type: "EthSignKeychainEvent", text: "Received event." });
  //   }, 0);
  // }
  if(event.data.type && event.data.type === "EthSignKeychainEvent") {
    window.postMessage({type : "ETHSIGN_KEYCHAIN_EVENT", text: this.window.ethereum ? "ethereum exists" : "ethereum does not exist"}, "*");
  }
  console.log("page javascript got message:", event);
});
