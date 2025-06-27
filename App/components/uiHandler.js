import { renderEmailList, getUniqueSenders } from "./Email.js";
import { graphConfig } from "../authConfig.js";
import { getMail } from "../authPopup.js";

// Đặt các biến này ở ngoài cùng file
let cachedMailData = null;
let profileEmailDiv = null;
let senderDropdown = null;

export function setupUI() {
  const regex = /\[週報：\s*(晴|曇|雨)\s*\/\s*[1-3]\]/; // right
  const getEmailBtn = document.getElementById("get_email_btn");
  const summaryArea = document.getElementById("summary-area");
  const mainCard = document.querySelector(".main-card");
  const filterArea = document.querySelector(".filter-area");

  // Gán lại các biến này khi DOM đã sẵn sàng
  profileEmailDiv = document.getElementById("profile_email");
  senderDropdown = document.getElementById("filter-dropdown");

  getEmailBtn.addEventListener("click", async () => {
    try {
      profileEmailDiv.innerHTML = "";
      getEmailBtn.style.display = "none";
      // GET EMAIL
      let mailData = await getMail();
      const uniqueSenders = getUniqueSenders(mailData);

      if (summaryArea) {
        summaryArea.style.display = "block";
      }
      if (mainCard) {
        mainCard.style.display = "block";
      }
      if (filterArea) {
        filterArea.style.display = "flex";
      }

      // Set unique user in dropdown
      if (senderDropdown) {
        uniqueSenders.forEach((sender) => {
          const option = document.createElement("option");
          option.value = sender;
          option.textContent = sender;
          senderDropdown.appendChild(option);
        });
      }
      // Lọc kết quả ở phía client
      mailData.value = mailData.value.filter((mail) =>
        regex.test(mail.subject)
      );

      // Gán index gốc cho từng mail (dựa trên vị trí trong mảng gốc)
      mailData.value.forEach((mail, idx) => {
        mail.index = idx;
      });

      cachedMailData = {
        ...mailData,
        value: [...mailData.value], // giữ nguyên cấu trúc
      };
      profileEmailDiv.innerHTML = renderEmailList(cachedMailData);
      attachMailCardEvents(cachedMailData);
    } catch (err) {
      profileEmailDiv.innerHTML = `<div>Error fetching mail: ${err.message}</div>`;
    }

    profileEmailDiv.style.display = "flex";
  });

  // Group button
  document.querySelectorAll(".sunshine, .cloudy, .rainy").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Nếu nút đang active được click lại
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        filterMail();
        return;
      }
      // Bỏ active ở tất cả nút, set active cho nút vừa click
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

export function showWelcomeMessage(username, accounts) {
  const welcomeDiv = document.getElementById("WelcomeMessage");
  const signInButton = document.getElementById("SignIn");
  const dropdownButton = document.getElementById("dropdownMenuButton1");
  const listGroup = document.getElementById("list-group");

  if (signInButton) {
    signInButton.style.visibility = "hidden";
  }

  if (welcomeDiv) {
    welcomeDiv.innerHTML = `Welcome ${username}`;
  }
  dropdownButton.setAttribute(
    "style",
    "display:inline !important; visibility:visible"
  );
  dropdownButton.innerHTML = username;
  accounts.forEach((account) => {
    let item = document.getElementById(account.username);
    if (!item) {
      const listItem = document.createElement("li");
      listItem.setAttribute("onclick", "addAnotherAccount(event)");
      listItem.setAttribute("id", account.username);
      listItem.innerHTML = account.username;
      if (account.username === username) {
        listItem.setAttribute("class", "list-group-item active");
      } else {
        listItem.setAttribute("class", "list-group-item");
      }
      listGroup.appendChild(listItem);
    } else {
      if (account.username === username) {
        item.setAttribute("class", "list-group-item active");
      } else {
        item.setAttribute("active", "list-group-item");
      }
    }
  });
}

export function closeModal() {
  const element = document.getElementById("closeModal");
  element.click();
}

export function updateUI(data, endpoint, account) {
  if (endpoint === graphConfig.graphMeEndpoint.uri) {
  } else if (endpoint === graphConfig.graphContactsEndpoint.uri) {
    if (!data || data.value.length < 1) {
      alert("Your contacts is empty!");
    } else {
      const tabList = document.getElementById("list-tab");
      tabList.innerHTML = ""; // clear tabList at each readMail call

      data.value.map((d, i) => {
        if (i < 10) {
          const listItem = document.createElement("a");
          listItem.setAttribute(
            "class",
            "list-group-item list-group-item-action"
          );
          listItem.setAttribute("id", "list" + i + "list");
          listItem.setAttribute("data-toggle", "list");
          listItem.setAttribute("href", "#list" + i);
          listItem.setAttribute("role", "tab");
          listItem.setAttribute("aria-controls", i);
          listItem.innerHTML =
            "<strong> Name: " +
            d.displayName +
            "</strong><br><br>" +
            "Note: " +
            d.personalNotes +
            "...";
          tabList.appendChild(listItem);
        }
      });
    }
  } else if (endpoint === graphConfig.graphReadMailEndpoint.uri) {
    if (!data || data.value.length < 1) {
      alert("Your mailbox is empty!");
    } else {
      const userCard = document.getElementById("user-card");
      // if (userCard) {
      //  userCard.innerHTML = "";
      // }
      // clear tabList at each readMail call

      data.value.map((mail, i) => {
        if (i < 10) {
          const listItem = document.createElement("a");
          listItem.setAttribute(
            "class",
            "list-group-item list-group-item-action"
          );
          listItem.setAttribute("id", "list" + i + "list");
          listItem.setAttribute("data-toggle", "list");
          listItem.setAttribute("href", "#list" + i);
          listItem.setAttribute("role", "tab");
          listItem.setAttribute("aria-controls", i);
          listItem.innerHTML =
            "<strong> Subject: " +
            mail.subject +
            "</strong><br><br>" +
            "From: " +
            mail.from.emailAddress.name +
            "<br><br>" +
            "To: " +
            mail.toRecipients[0].emailAddress.name +
            "...";
          userCard.appendChild(listItem);
        }
      });
    }
  }
}

// Hàm filterMail dùng được các biến toàn cục
function filterMail() {
  if (!cachedMailData) return;

  // Lấy trạng thái đang active
  let filterText = "";
  const activeBtn = document.querySelector(
    ".sunshine.active, .cloudy.active, .rainy.active"
  );
  if (activeBtn) {
    if (activeBtn.classList.contains("sunshine")) filterText = "晴";
    if (activeBtn.classList.contains("cloudy")) filterText = "曇";
    if (activeBtn.classList.contains("rainy")) filterText = "雨";
  }

  // Lấy người gửi đang chọn
  const selectedSender = senderDropdown ? senderDropdown.value : "all";

  // Lọc mail theo cả hai điều kiện
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
      return matchStatus && matchSender;
    }),
  };

  profileEmailDiv.innerHTML = renderEmailList(filteredMail);
  attachMailCardEvents(filteredMail); // <-- Thêm dòng này
}

function attachMailCardEvents(mailData) {
  setTimeout(() => {
    document.querySelectorAll(".mail-card").forEach((card, i) => {
      card.addEventListener("click", function () {
        // Lấy mail đúng theo vị trí trong mảng filter hiện tại
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
          <div><b>Body:</b></div>
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

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const picker = new Litepicker({
    element: document.getElementById("daterange"),
    singleMode: false,
    format: "YYYY/MM/DD",
    numberOfMonths: 1,
    numberOfColumns: 1,
    autoApply: false,
    showTooltip: true,
    startDate: lastWeek,
    endDate: new Date(),
    tooltipText: {
      one: "Selected Day",
      other: "Selected Days",
    },
    dropdowns: {
      minYear: 2020,
      maxYear: 2030,
      months: true,
      years: true,
    },
  });
});
