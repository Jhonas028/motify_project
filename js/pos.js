let intervalId;

export function initPOS() {
    console.log("POS INIT");

    intervalId = setInterval(() => {
        console.log("POS running...");
    }, 1000);
}

export function destroyPOS() {
    console.log("POS DESTROY");

    clearInterval(intervalId);
}
