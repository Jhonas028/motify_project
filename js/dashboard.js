import { qs } from "./utils.js";

let clickHandler;

export function initDashboard() {
    console.log("Dashboard INIT");

    const title = qs("h1");

    clickHandler = () => alert("Dashboard clicked");
    title.addEventListener("click", clickHandler);
}

export function destroyDashboard() {
    console.log("Dashboard DESTROY");

    const title = qs("h1");
    if (title && clickHandler) {
        title.removeEventListener("click", clickHandler);
    }
}
