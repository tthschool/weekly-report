// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
const dropdownButton = document.getElementById("dropdownMenuButton1");
const cardDiv = document.getElementById("card-div");
const mailButton = document.getElementById("readMail");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profile-div");
const listGroup = document.getElementById("list-group");

// function showWelcomeMessage(username, accounts) {
//   // Reconfiguring DOM elements
//   if (cardDiv) {
//     cardDiv.style.display = "initial";
//   }
//   if (signInButton) {
//     signInButton.style.visibility = "hidden";
//   }

//   if (welcomeDiv) {
//     welcomeDiv.innerHTML = `Welcome ${username}`;
//   }
//   dropdownButton.setAttribute(
//     "style",
//     "display:inline !important; visibility:visible"
//   );
//   dropdownButton.innerHTML = username;
//   accounts.forEach((account) => {
//     let item = document.getElementById(account.username);
//     if (!item) {
//       const listItem = document.createElement("li");
//       listItem.setAttribute("onclick", "addAnotherAccount(event)");
//       listItem.setAttribute("id", account.username);
//       listItem.innerHTML = account.username;
//       if (account.username === username) {
//         listItem.setAttribute("class", "list-group-item active");
//       } else {
//         listItem.setAttribute("class", "list-group-item");
//       }
//       listGroup.appendChild(listItem);
//     } else {
//       if (account.username === username) {
//         item.setAttribute("class", "list-group-item active");
//       } else {
//         item.setAttribute("active", "list-group-item");
//       }
//     }
//   });
// }

// function closeModal() {
//   const element = document.getElementById("closeModal");
//   element.click();
// }

// function updateUI(data, endpoint, account) {
//   // console.log("Updating UI with data:", data, endpoint, account);
//   if (endpoint === graphConfig.graphMeEndpoint.uri) {
//     console.log("Updating UI for graphMeEndpoint");
//   } else if (endpoint === graphConfig.graphContactsEndpoint.uri) {
//     if (!data || data.value.length < 1) {
//       alert("Your contacts is empty!");
//     } else {
//       const tabList = document.getElementById("list-tab");
//       tabList.innerHTML = ""; // clear tabList at each readMail call

//       data.value.map((d, i) => {
//         if (i < 10) {
//           const listItem = document.createElement("a");
//           listItem.setAttribute(
//             "class",
//             "list-group-item list-group-item-action"
//           );
//           listItem.setAttribute("id", "list" + i + "list");
//           listItem.setAttribute("data-toggle", "list");
//           listItem.setAttribute("href", "#list" + i);
//           listItem.setAttribute("role", "tab");
//           listItem.setAttribute("aria-controls", i);
//           listItem.innerHTML =
//             "<strong> Name: " +
//             d.displayName +
//             "</strong><br><br>" +
//             "Note: " +
//             d.personalNotes +
//             "...";
//           tabList.appendChild(listItem);
//         }
//       });
//     }
//   } else if (endpoint === graphConfig.graphReadMailEndpoint.uri) {
//     console.log("Updating UI for graphReadMailEndpoint");
//     if (!data || data.value.length < 1) {
//       alert("Your mailbox is empty!");
//     } else {
//       const userCard = document.getElementById("user-card");
//       // if (userCard) {
//       //  userCard.innerHTML = "";
//       // }
//        // clear tabList at each readMail call

//       data.value.map((mail, i) => {
//         if (i < 10) {
//           const listItem = document.createElement("a");
//           listItem.setAttribute(
//             "class",
//             "list-group-item list-group-item-action"
//           );
//           listItem.setAttribute("id", "list" + i + "list");
//           listItem.setAttribute("data-toggle", "list");
//           listItem.setAttribute("href", "#list" + i);
//           listItem.setAttribute("role", "tab");
//           listItem.setAttribute("aria-controls", i);
//           listItem.innerHTML =
//             "<strong> Subject: " +
//             mail.subject +
//             "</strong><br><br>" +
//             "From: " +
//             mail.from.emailAddress.name +
//             "<br><br>" +
//             "To: " +
//             mail.toRecipients[0].emailAddress.name +
//             "...";
//           userCard.appendChild(listItem);
//         }
//       });
//     }
//   }
// }
