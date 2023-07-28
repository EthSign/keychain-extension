/**
 * Download a string as export.json from the browser.
 *
 * @param data - String to download onto the user's computer.
 */
export function download(data: string) {
  const link = document.createElement("a");
  const blob = new Blob([data], { type: "octet/stream" });
  const name = "export.json",
    url = window.URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", name);
  link.click();
}
