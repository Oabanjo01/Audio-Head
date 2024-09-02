import { param } from "express/lib/router";

window.addEventListener("DOMContentLoaded", () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  console.log(param);
});
