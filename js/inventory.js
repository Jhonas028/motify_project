import { qsa } from "./utils.js";

let rowHandlers = [];

export function initInventory() {
    console.log("Inventory INIT");

    const rows = qsa("tbody tr");

    rows.forEach(row => {
        const handler = () => row.classList.toggle("bg-gray-100");
        row.addEventListener("click", handler);
        rowHandlers.push({ row, handler });
    });
}

export function destroyInventory() {
    console.log("Inventory DESTROY");

    rowHandlers.forEach(({ row, handler }) => {
        row.removeEventListener("click", handler);
    });

    rowHandlers = [];
}
