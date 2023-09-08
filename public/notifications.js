/* eslint-disable no-undef */

(function () {

  if (!document.getElementById("ethsign-keychain-banner")) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
    document.head.appendChild(link);

    // just place a div at top right
    var container = document.createElement('div');
    container.id = "ethsign-keychain-banner";
    container.style.position = 'fixed';
    container.style.top = "0";
    container.style.left = "0";
    container.style.right = "0";
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
    innerContainer.style.backgroundColor = "#EF6820";
    const shadow = container.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    shadow.appendChild(innerContainer);

    var innerContainer2 = document.createElement("div");
    innerContainer2.style.display = "flex";
    innerContainer2.style.width = "100%";
    innerContainer2.style.justifyContent = "center";
    innerContainer2.style.margin = "1.5rem";
    innerContainer.appendChild(innerContainer2);

    var svg = document.createElement("div");
    svg.style.margin = "auto 0.5rem auto 0";
    svg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    <circle cx="11.6032" cy="12.6037" r="11.6032" fill="#FFBA95"/>
    <g filter="url(#filter0_d_419_14245)">
    <circle cx="11.6029" cy="12.6039" r="7.35587" fill="white"/>
    <mask id="mask0_419_14245" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="8" y="8" width="7" height="12">
    <path d="M14.6124 8.95068H8.33032V19.9594H14.6124V8.95068Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_419_14245)">
    <mask id="mask1_419_14245" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="6" width="15" height="14">
    <ellipse cx="11.6034" cy="13.1002" rx="6.85951" ry="6.85951" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask1_419_14245)">
    <path d="M14.6126 12.082C14.6126 10.3538 13.2051 8.95068 11.4716 8.95068C9.7381 8.95068 8.33057 10.3538 8.33057 12.082C8.33057 13.298 9.03187 14.3566 10.0542 14.8735V19.7132C10.0542 19.8511 10.1628 19.9594 10.3011 19.9594H12.6371C12.7754 19.9594 12.8841 19.8511 12.8841 19.7132V14.8784C13.9064 14.3615 14.6126 13.303 14.6126 12.082Z" fill="#FFBA95"/>
    </g>
    </g>
    <rect x="10.1472" y="0.207031" width="2.91186" height="5.41473" fill="white"/>
    </g>
    <defs>
    <filter id="filter0_d_419_14245" x="1.80336" y="0.207031" width="19.5991" height="24.6403" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="2.44371"/>
    <feGaussianBlur stdDeviation="1.22185"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_419_14245"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_419_14245" result="shape"/>
    </filter>
    </defs>
    </svg>
    `;
    innerContainer2.appendChild(svg);
    // var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    // var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    var message = document.createElement("p");
    message.style.margin = "auto 0";
    message.style.fontFamily = `"IBM Plex Sans", sans-serif`;
    message.id = "ethsign-keychain-banner-message";
    message.textContent = "Would you like to save your password for xxx on this site?";
    message.style.color = "white";
    innerContainer2.appendChild(message);

    var neverSave = document.createElement("span");
    neverSave.style.color = "#FFFFFF";
    neverSave.style.textDecoration = "underline";
    neverSave.style.fontFamily = `"IBM Plex Sans", sans-serif`;
    neverSave.style.cursor = "pointer";
    neverSave.style.margin = "auto auto auto 0.5rem";
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
    innerContainer2.appendChild(neverSave);

    var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "0.5rem";
    innerContainer2.appendChild(buttonContainer);

    var notNow = document.createElement("button");
    notNow.style.padding = "10px 18px";
    notNow.style.backgroundColor = "transparent";
    notNow.style.border = "1px solid #F9FAFB";
    notNow.style.color = "#FFFFFF";
    notNow.style.fontWeight = "500";
    notNow.style.flexShrink = "none";
    notNow.style.borderRadius = "6px";
    notNow.style.boxShadow = "0px 1px 2px 0px #1018280D";
    notNow.style.fontFamily = `"IBM Plex Sans", sans-serif`;
    notNow.style.whiteSpace = "nowrap";
    notNow.style.cursor = "pointer";
    notNow.id = "ethsign-keychain-not-now";
    notNow.textContent = "Not Now";
    notNow.onclick = () => {
      chrome.runtime.sendMessage({ type: "GET_ACTIVE_URL" }, (response) => {
        chrome.runtime.sendMessage({ type: "CLEAR_PENDING_FOR_SITE", data: { url: response.data } })
        container.style.display = "none"
      });
    }
    buttonContainer.appendChild(notNow);

    var save = document.createElement("button");
    save.style.padding = "10px 18px";
    save.style.backgroundColor = "#FFFFFF";
    save.style.border = "1px solid #FDFAF9";
    save.style.color = "#CF5C10";
    save.style.fontWeight = "500";
    save.style.flexShrink = "none";
    save.style.borderRadius = "6px";
    save.style.boxShadow = "0px 1px 2px 0px #1018280D";
    save.style.fontFamily = `"IBM Plex Sans", sans-serif`;
    save.style.whiteSpace = "nowrap";
    save.style.cursor = "pointer";
    save.id = "ethsign-keychain-save";
    save.textContent = "Save Password";
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
    buttonContainer.appendChild(save);

    // alert('New injection');
  }

})();