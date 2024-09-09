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

// button loader
const btnLoader = document.querySelector(".btn-loader");

formTag.style.display = "none";

let token, owner;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  token = params.token;
  owner = params.id;
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

const displayNotification = (message) => {
  notificationTag.innerText = message;
  notificationTag.style.display = "flex";
};

const handleSubmit = async (ev) => {
  ev.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!newPassword) {
    return displayNotification("Please enter your new password");
  } else if (confirmPassword !== newPassword) {
    return displayNotification(
      "Your confirmation password should be identical to the pre set password"
    );
  } else {
    await fetch("/auth/reset-password", {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify({ owner, token, newPassword }),
    })
      .then(async (res) => {
        const { message } = await res.json();
        if (!res.ok) {
          return displayNotification(message);
        } else {
          messageTag.innerText = message;
          descriptionTag.innerText =
            "Your password has been reset successfully.";
          btnLoader.style.display = "block";

          notificationTag.style.display = "none";
          notificationTag.innerText = message;
          formTag.style.display = "none";

          messageContainer.style.display = "flex";
        }
      })
      .catch((err) => {})
      .finally(() => {
        btnLoader.style.display = "none";
      });
  }
};

const form = document.getElementById("form");

form.addEventListener("submit", handleSubmit);
