import CONSTANT from "../utils/constants.js";

export function renderEmailList(mailData) {
  if (!mailData || !mailData.value || mailData.value.length === 0) {
    return CONSTANT.NO_MAIL_DISPLAY;
  }

  let listMailHtml = CONSTANT.LIST_MAIL_HTML;

  mailData.value.forEach((mail, idx) => {
    const isSunny =
      mail.subject && mail.subject.includes(CONSTANT.MAIL_STATUS.SUNNY);
    const isCloudy =
      mail.subject && mail.subject.includes(CONSTANT.MAIL_STATUS.CLOUDY);
    const isRainy =
      mail.subject && mail.subject.includes(CONSTANT.MAIL_STATUS.RAINY);

    const username = mail.from?.emailAddress?.address;
    let colorBackground = "white";
    let textColor = "black";
    if (isSunny) {
      colorBackground = CONSTANT.STATUS_COLOR.SUNNY;
    }
    if (isCloudy) {
      colorBackground = CONSTANT.STATUS_COLOR.CLOUDY;
      textColor = "white";
    }
    if (isRainy) {
      colorBackground = CONSTANT.STATUS_COLOR.RAINY;
      textColor = "white";
    }
    listMailHtml += `
      <div class="card mb-3 mail-card" data-index="${idx}" style="cursor:pointer;background:${colorBackground};color:${textColor};">
        <div class="card-body">
          <div class="card-title" style="font-size:1.2rem;font-weight:bold;">
            ${mail.subject || ""}
          </div>
          <div class="card-subtitle mb-2">
            ${mail.from?.emailAddress?.address || ""}
          </div>
          <div class="card-text" style="margin-bottom:8px;">
            ${
              mail.receivedDateTime
                ? new Date(mail.receivedDateTime).toLocaleDateString()
                : ""
            }
          </div>
        </div>
      </div>
    `;
  });
  listMailHtml += `</div>`;
  return listMailHtml;
}

// List nguoi gui unique
export function getUniqueSenders(mailData) {
  if (!mailData || !mailData.value || mailData.value.length === 0) {
    return [];
  }
  const senderSet = new Set();
  mailData.value.forEach((mail) => {
    const sender = mail.from?.emailAddress?.address;
    if (sender) senderSet.add(sender);
  });
  return Array.from(senderSet);
}
