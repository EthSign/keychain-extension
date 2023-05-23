/* eslint-disable no-undef */

(function () {

  if (!document.getElementById("ethsign-keychain-banner")) {
    // just place a div at top right
    var container = document.createElement('div');
    container.id = "ethsign-keychain-banner";
    container.style.position = 'fixed';
    container.style.top = "0.5rem";
    container.style.left = "0.5rem";
    container.style.right = "0.5rem";
    container.style.display = "none";
    document.body.appendChild(container);

    // Style reset
    var style = document.createElement("style");
    style.textContent = `
      html, body, div, span, applet, object, iframe,
      h1, h2, h3, h4, h5, h6, p, blockquote, pre,
      a, abbr, acronym, address, big, cite, code,
      del, dfn, em, img, ins, kbd, q, s, samp,
      small, strike, strong, sub, sup, tt, var,
      b, u, i, center,
      dl, dt, dd, ol, ul, li,
      fieldset, form, label, legend,
      table, caption, tbody, tfoot, thead, tr, th, td,
      article, aside, canvas, details, embed, 
      figure, figcaption, footer, header, hgroup, 
      menu, nav, output, ruby, section, summary,
      time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      /* HTML5 display-role reset for older browsers */
      article, aside, details, figcaption, figure, 
      footer, header, hgroup, menu, nav, section {
        display: block;
      }
      body {
        line-height: 1;
      }
      ol, ul {
        list-style: none;
      }
      blockquote, q {
        quotes: none;
      }
      blockquote:before, blockquote:after,
      q:before, q:after {
        content: '';
        content: none;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
    `;

    var innerContainer = document.createElement("div");
    innerContainer.style.display = "flex";
    innerContainer.style.width = "100%";
    innerContainer.style.justifyContent = "center";
    innerContainer.style.backgroundColor = "#cccccc";
    innerContainer.style.height = "1.5rem";
    const shadow = container.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    shadow.appendChild(innerContainer);

    var message = document.createElement("p");
    message.id = "ethsign-keychain-banner-message";
    message.textContent = "Would you like to save your credentials for xxx on this site?";
    message.style.marginRight = "auto";
    innerContainer.appendChild(message);

    var neverSave = document.createElement("button");
    neverSave.id = "ethsign-keychain-never-save";
    neverSave.textContent = "Never Save";
    neverSave.onclick = () => {
      chrome.runtime.sendMessage({ type: "GET_ACTIVE_URL" }, (response) => {
        // TODO: Add loading state here
        chrome.runtime.sendMessage({ type: "NEVER_SAVE", data: { url: response.data } },
          (response) => {
            // Clear loading state
            if (response.data === "OK") {
              container.style.display = "none"
            }
          })
      });
    }
    innerContainer.appendChild(neverSave);

    var notNow = document.createElement("button");
    notNow.id = "ethsign-keychain-not-now";
    notNow.textContent = "Not Now";
    notNow.onclick = () => {
      chrome.runtime.sendMessage({ type: "GET_ACTIVE_URL" }, (response) => {
        chrome.runtime.sendMessage({ type: "CLEAR_PENDING_FOR_SITE", data: { url: response.data } })
        container.style.display = "none"
      });
    }
    innerContainer.appendChild(notNow);

    var save = document.createElement("button");
    save.id = "ethsign-keychain-save";
    save.textContent = "Save";
    save.onclick = () => {
      chrome.runtime.sendMessage({ type: "GET_ACTIVE_URL" }, (response) => {
        // TODO: Add loading state here
        chrome.runtime.sendMessage({ type: "PERSIST", data: { url: response.data } },
          (response) => {
            // Clear loading state
            if (response.data === "OK") {
              container.style.display = "none"
            }
          })
      });
    }
    innerContainer.appendChild(save);

    // alert('New injection');
  }

})();