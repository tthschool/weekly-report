import { renderEmailList, getUniqueSenders } from "./Email.js";
import { getMail } from "../authPopup.js";
import CONSTANT from "../utils/constants.js";

let cachedMailData = null;
let uniqueSenders = null;
let profileEmailDiv = null;
let senderDropdown = null;

const divider = document.getElementById("sum-divider");
const regex = CONSTANT.REGEX_MAIL;
const getEmailBtn = document.getElementById("get_email_btn");
const summaryArea = document.getElementById("summary-area");
const mainCard = document.querySelector(".main-card");
const filterArea = document.querySelector(".filter-area");
const summaryDiv = document.getElementById("current-selected-summary");

// ===================== UI SETUP =====================
export function setupUI() {
  profileEmailDiv = document.getElementById("profile_email");
  senderDropdown = document.getElementById("filter-dropdown");

  getEmailBtn.addEventListener("click", async () => {
    summaryDiv.style.display = "none";
    divider.style.display = "none";
    try {
      profileEmailDiv.innerHTML = "";
      getEmailBtn.style.display = "none";
      // GET EMAIL
      let mailData = await getMail();
      uniqueSenders = getUniqueSenders(mailData);

      if (summaryArea) summaryArea.style.display = "block";
      if (mainCard) mainCard.style.display = "block";
      if (filterArea) filterArea.style.display = "flex";

      // Add unique user to dropdown
      if (senderDropdown) {
        uniqueSenders.forEach((sender) => {
          const option = document.createElement("option");
          option.value = sender;
          option.textContent = sender;
          senderDropdown.appendChild(option);
        });
      }

      // Filter and index mail
      mailData.value = mailData.value.filter((mail) =>
        regex.test(mail.subject)
      );
      mailData.value.forEach((mail, idx) => (mail.index = idx));
      cachedMailData = { ...mailData, value: [...mailData.value] };

      updateSummaryUI(cachedMailData, uniqueSenders);
      profileEmailDiv.innerHTML = renderEmailList(cachedMailData);
      attachMailCardEvents(cachedMailData);
    } catch (err) {
      profileEmailDiv.innerHTML = `<div>Error fetching mail: ${err.message}</div>`;
    }
    profileEmailDiv.style.display = "flex";
  });

  // Status group button
  document.querySelectorAll(".sunshine, .cloudy, .rainy").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        filterMail();
        return;
      }
      document
        .querySelectorAll(".sunshine, .cloudy, .rainy")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      filterMail();
    });
  });

  // Dropdown
  if (senderDropdown) {
    senderDropdown.addEventListener("change", function () {
      filterMail();
    });
  }
}

// ===================== DROPDOWN AREA =====================
document
  .getElementById("filter-dropdown")
  .addEventListener("change", function (e) {
    const selected = e.target.value;
    if (selected === "all") {
      // Ẩn và reset các trường khi chọn All
      summaryDiv.style.display = "none";
      divider.style.display = "none";
      document.getElementById("selected-user-name").textContent = "";
      document.getElementById("selected-report-count").textContent = "";
      document.getElementById("sunny-report-count").textContent = "";
      document.getElementById("cloudy-report-count").textContent = "";
      document.getElementById("rainy-report-count").textContent = "";
    } else {
      divider.style.display = "block";
      summaryDiv.style.display = "flex";
      summaryDiv.style.flexDirection = "column";
      const userData = (() => {
        if (!cachedMailData || !cachedMailData.value) return null;
        const sender = uniqueSenders.find((s) => s === selected);
        if (!sender) return null;
        const mails = cachedMailData.value.filter(
          (mail) => mail.from?.emailAddress?.address === sender
        );
        return {
          name: sender,
          submitted: mails.length,
          sunnyReport: mails.filter((mail) =>
            mail.subject?.includes(CONSTANT.MAIL_STATUS.SUNNY)
          ).length,
          cloudyReport: mails.filter((mail) =>
            mail.subject?.includes(CONSTANT.MAIL_STATUS.CLOUDY)
          ).length,
          rainyReport: mails.filter((mail) =>
            mail.subject?.includes(CONSTANT.MAIL_STATUS.RAINY)
          ).length,
        };
      })();
      showSelectedUserSummary(userData);
    }
  });

// ===================== WELCOME MESSAGE =====================
export function showWelcomeMessage(username, accounts) {
  const welcomeDiv = document.getElementById("WelcomeMessage");
  const signInButton = document.getElementById("SignIn");
  const dropdownButton = document.getElementById("dropdownMenuButton1");

  if (signInButton) signInButton.style.visibility = "hidden";
  if (welcomeDiv) welcomeDiv.innerHTML = `Welcome ${username}`;
  dropdownButton.setAttribute(
    "style",
    "display:inline !important; visibility:visible"
  );
  dropdownButton.innerHTML = username;

  accounts.forEach((account) => {
    let item = document.getElementById(account.username);
    if (!item) {
      const listItem = document.createElement("li");
      listItem.setAttribute("id", account.username);
      listItem.innerHTML = account.username;
      listItem.setAttribute(
        "class",
        account.username === username
          ? "list-group-item active"
          : "list-group-item"
      );
    } else {
      item.setAttribute(
        "class",
        account.username === username
          ? "list-group-item active"
          : "list-group-item"
      );
    }
  });
}

// ===================== MODAL =====================
export function closeModal() {
  const element = document.getElementById("closeModal");
  element.click();
}

// ===================== FILTER MAIL =====================
function filterMail() {
  if (!cachedMailData) return;

  let filterText = "";
  const activeBtn = document.querySelector(
    ".sunshine.active, .cloudy.active, .rainy.active"
  );
  if (activeBtn) {
    if (activeBtn.classList.contains("sunshine"))
      filterText = CONSTANT.MAIL_STATUS.SUNNY;
    if (activeBtn.classList.contains("cloudy"))
      filterText = CONSTANT.MAIL_STATUS.CLOUDY;
    if (activeBtn.classList.contains("rainy"))
      filterText = CONSTANT.MAIL_STATUS.RAINY;
  }

  const selectedSender = senderDropdown ? senderDropdown.value : "all";
  const period = document.getElementById("date-range").value;
  let startDate = null,
    endDate = null;
  if (period && period.includes(" - ")) {
    const [start, end] = period.split(" - ");
    startDate = new Date(start.trim());
    endDate = new Date(end.trim());
    endDate.setHours(
      CONSTANT.END_OF_DAY.hours,
      CONSTANT.END_OF_DAY.minutes,
      CONSTANT.END_OF_DAY.seconds,
      CONSTANT.END_OF_DAY.ms
    );
  }

  const filteredMail = {
    ...cachedMailData,
    value: cachedMailData.value.filter((mail) => {
      const matchStatus = filterText
        ? mail.subject && mail.subject.includes(filterText)
        : true;
      const matchSender =
        selectedSender && selectedSender !== "all"
          ? mail.from?.emailAddress?.address === selectedSender
          : true;
      const matchDate =
        startDate && endDate && mail.receivedDateTime
          ? new Date(mail.receivedDateTime) >= startDate &&
            new Date(mail.receivedDateTime) <= endDate
          : true;
      return matchStatus && matchSender && matchDate;
    }),
  };

  profileEmailDiv.innerHTML = renderEmailList(filteredMail);
  attachMailCardEvents(filteredMail);
}

// ===================== MAIL CARD EVENTS =====================
function attachMailCardEvents(mailData) {
  setTimeout(() => {
    document.querySelectorAll(".mail-card").forEach((card, i) => {
      card.addEventListener("click", function () {
        const idx = this.getAttribute("data-index");
        const mail = mailData.value[idx];
        document.getElementById("mail-detail-body").innerHTML = `
          <div><b>Subject:</b> ${mail.subject || ""}</div>
          <div><b>From:</b> ${mail.from?.emailAddress?.address || ""}</div>
          <div><b>Date:</b> ${
            mail.receivedDateTime
              ? new Date(mail.receivedDateTime).toLocaleString()
              : ""
          }</div>
          <hr>
          <div class="mail-body-content">${
            mail.body?.content || "(No content)"
          }</div>
        `;
        const modal = new bootstrap.Modal(
          document.getElementById("mailDetailModal")
        );
        modal.show();
      });
    });
  }, 0);
}

// ===================== DATE TIME PICKER AREA =====================
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const picker = new Litepicker({
    element: document.getElementById("date-range"),
    startDate: lastWeek,
    endDate: today,
    ...CONSTANT.LITEPICKER_CONFIG,
  });

  picker.on("selected", function () {
    filterMail();
  });
  picker.on("cancel", function () {
    document.getElementById("date-range").value = "";
    filterMail();
  });

  // Thêm vào sau khi khởi tạo Litepicker
  picker.on("render", () => {
    const footer = document.querySelector(".litepicker .container__footer");
    if (footer) {
      const btnApply = footer.querySelector(".button-apply");
      const btnCancel = footer.querySelector(".button-cancel");
      if (btnApply && btnCancel && !footer.querySelector(".button-container")) {
        const btnContainer = document.createElement("div");
        btnContainer.className = "button-container";
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnApply);
        footer.appendChild(btnContainer);
      }
    }
  });
});

// ===================== USER SUMMARY AREA =====================
export function updateSummaryUI(data, uniqueSenders) {
  document.getElementById("user-count").textContent = uniqueSenders.length;
  document.getElementById("report-count").textContent = data.value.length;
}

export function showSelectedUserSummary(userData) {
  if (!userData) {
    document.getElementById("current-selected-summary").style.display = "none";
    return;
  }
  document.getElementById("current-selected-summary").style.display = "flex";
  document.getElementById("selected-user-name").textContent = userData.name;
  document.getElementById("selected-report-count").textContent =
    userData.submitted;
  document.getElementById("sunny-report-count").textContent =
    userData.sunnyReport;
  document.getElementById("cloudy-report-count").textContent =
    userData.cloudyReport;
  document.getElementById("rainy-report-count").textContent =
    userData.rainyReport;
}
