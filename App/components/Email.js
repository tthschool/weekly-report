export function renderEmailList(mailData) {
  if (!mailData || !mailData.value || mailData.value.length === 0) {
    return `<div>No mail data</div>`;
  }

  let html = `<div class="email-list" style="max-height:500px;overflow-y:auto;padding-right:8px;">`;

  mailData.value.forEach((mail) => {
    // Ví dụ: nếu subject chứa từ khóa đặc biệt thì đổi màu nền
    const isSpecial = mail.subject && mail.subject.includes("週報");
    html += `
      <div class="card mb-3" style="background:${isSpecial ? 'red' : 'white'};color:${isSpecial ? 'white' : 'black'};">
        <div class="card-body">
          <div class="card-title" style="font-size:1.2rem;font-weight:bold;">
            ${mail.subject || ""}
          </div>
          <div class="card-subtitle mb-2 text-muted">
            ${mail.from?.emailAddress?.address || ""}
          </div>
          <div class="card-text" style="margin-bottom:8px;">
            ${(mail.receivedDateTime ? new Date(mail.receivedDateTime).toLocaleDateString() : "")}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}