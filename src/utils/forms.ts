export function autofill(inputs: HTMLCollectionOf<HTMLInputElement> | null, username?: string, password?: string) {
  if (!inputs) {
    return;
  }
  for (let j = 0; j < inputs.length; j++) {
    // Autofill
    if (username && (inputs[j].getAttribute("name") === "username" || inputs[j].getAttribute("name") === "email")) {
      inputs[j].value = username;
    } else if (password && (inputs[j].getAttribute("name") === "password" || inputs[j].type === "password")) {
      inputs[j].value = password;
    }
  }
}
