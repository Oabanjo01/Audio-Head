const messageTag = document.getElementById("message");
const descriptionTag = document.getElementById("description");
const loaderTag = document.getElementById("loader");

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  // This works too, just wanted to learn about proxies
  // const urlParams = new URLSearchParams(window.location.search);
  // const someParam = urlParams.get("token");

  const token = params.token;
  const owner = params.id;
  await fetch("/auth/verify-token", {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({ owner, token }),
  })
    .then(async (res) => {
      console.log("getting here why?");
      if (!res.ok) {
        const { message } = await res.json();
        if (res.status === 412) {
          messageTag.innerText = message;
          descriptionTag.innerHTML =
            "This email address has been verified, do go on with logging in.";
          loaderTag.style.display = "none";
        } else {
          messageTag.innerText = message;
          descriptionTag.innerHTML =
            "An error occurred while verifying your email address.";
          messageTag.classList = "error";
          loaderTag.style.display = "none";
        }
      } else {
        const { message } = await res.json();
        messageTag.innerText = message;
        descriptionTag.innerHTML = "Your account has been verified, yay!";
        loaderTag.style.display = "none";
      }
    })
    .catch((err) => {
      console.log("An error occurred", err);
    });
});

// A bit on Proxies
// const books = {
//   "Deep work": "Cal Newport",
//   "Atomic Habits": "James Clear",
// };

// const proxyBooksObj = new Proxy(books, {
//   get: (target, key) => {
//     if (key === "Atomic Habits") {
//       return Reflect.get(target, key);
//     }
//   },
// });
