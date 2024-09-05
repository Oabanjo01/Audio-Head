// on success
const formTag = document.getElementById("form");
const loaderTag = document.getElementById("loader");
const messageContainer = document.getElementById("messageContainer");

// pending
const loaderInner = document.getElementById("messageContainer");

// on failure
const descriptionTag = document.getElementById("description");
const messageTag = document.getElementById("message");

// after submission things
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

// notification
const notificationTag = document.getElementById("notification");

formTag.style.display = "none";
notificationTag.style.display = "none";

let token, owner;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  token = params.token;
  owner = params.id;
  console.log(token, owner, "params");
  await fetch("/auth/verify-password-reset-token", {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({ owner, token }),
  })
    .then(async (res) => {
      loaderTag.style.display = "none";
      if (!res.ok) {
        console.log("!res.ok");
        const { message } = await res.json();

        messageContainer.style.display = "flex";

        messageTag.innerText = message;
        descriptionTag.innerText =
          "An error occurred while resetting your password.";
        messageTag.classList = "error";
      } else {
        messageContainer.style.display = "none";

        formTag.style.display = "flex";
      }
    })
    .catch((err) => {
      descriptionTag.innerText =
        "An error occurred while resetting your password.";
      messageTag.classList = "error";
    });
});

const displayNotification = (message, error) => {
  notificationTag.style.display = "block";
  notificationTag.innerText = message;
  notificationTag.classList = error;
};

document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim().value.trim();

  if (!newPassword) {
    displayNotification("Please enter your new password", "error");
  } else if (!confirmPassword) {
    displayNotification("Re enter your new password", error);
  } else {
    await fetch("/auth//reset-password", {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify({ owner, token, newPassword }),
    })
      .then(async (res) => {
        const { message } = await res.json();
        if (!res.ok) {
          displayNotification(message, error);
        } else {
          loaderTag.style.display = "none";
          loaderInner.style.display = "none";
          messageTag.style.display = "flex";
          descriptionTag.style.display = "flex";

          messageTag.innerText = message;
          descriptionTag.innerText =
            "Your password has been reset successfully.";
        }
      })
      .catch((err) => {});
  }
});
