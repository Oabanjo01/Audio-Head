const formTag = document.getElementById("form");
const loaderTag = document.getElementById("loader");
const loaderInner = document.getElementById("loaderContainer");
const descriptionTag = document.getElementById("description");
const messageTag = document.getElementById("message");

formTag.style.display = "none";
messageTag.style.display = "none";

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  const token = params.token;
  const owner = params.id;
  console.log(token, owner, "params");
  await fetch("/auth/verify-password-reset-token", {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({ owner, token }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const { message } = await res.json();

        loaderTag.style.display = "none";
        loaderInner.style.display = "none";
        messageTag.style.display = "flex";
        descriptionTag.style.display = "flex";

        messageTag.innerText = message;
        descriptionTag.innerText =
          "An error occurred while resetting your password.";
        messageTag.classList = "error";
      } else {
        messageTag.style.display = "none";
        descriptionTag.style.display = "none";
        loaderTag.style.display = "none";
        loaderInner.style.display = "none";

        formTag.style.display = "flex";
      }
    })
    .catch((err) => {
      loaderTag.style.display = "none";
      loaderInner.style.display = "none";
      messageTag.style.display = "flex";
      descriptionTag.style.display = "flex";

      descriptionTag.innerText =
        "An error occurred while resetting your password.";
      messageTag.classList = "error";
    });
});
