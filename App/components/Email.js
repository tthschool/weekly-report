export function renderEmailList(mailData) {
  if (!mailData || !mailData.value || mailData.value.length === 0) {
    return `<div>No mail data</div>`;
  }

  let html = `<div class="email-list" style="max-height:360px;overflow-y:auto;padding-right:8px;">`;

  mailData.value.forEach((mail, idx) => {
    const isSunny = mail.subject && mail.subject.includes("晴");
    const isCloudy = mail.subject && mail.subject.includes("曇");
    const isRainy = mail.subject && mail.subject.includes("雨");

    const username = mail.from?.emailAddress?.address;
    let colorBackground = "white";
    let textColor = "black";
    if (isSunny) {
      colorBackground = "#ffc107"; // vàng cam
    }
    if (isCloudy) {
      colorBackground = "rgb(153, 153, 247)"; // xám
      textColor = "white";
    }
    if (isRainy) {
      colorBackground = "#dc3545"; // đỏ
      textColor = "white";
    }
    html += `
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
  html += `</div>`;
  return html;
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
