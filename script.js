"use strict";

// Draw graph
const cyan = "#76B5BC";
const fadedCyan = "#B4E0E5";

async function getData(url) {
    const requestURL = url;
    const request = new Request(requestURL);

    const response = await fetch(request);
    const jsonArr = await response.json();

    populateBars(jsonArr);
}

function populateBars(jsonArr) {
    const maxAmount = jsonArr.reduce(
        (max, obj) =>
            Number(max) < Number(obj.amount) ? Number(obj.amount) : Number(max),
        0
    );

    let height;
    if (window.innerWidth >= 700) {
        height = (ratio) => `${ratio * 150}px`;
    } else {
        height = (ratio) => `${(150 / 375) * ratio * 100}vw`;
    }

    for (const obj of jsonArr) {
        const bar = document.querySelector(`#${obj.day}`);
        const ratio = obj.amount / maxAmount;
        bar.style.height = height(ratio);
        bar.style.transitionDuration = `${ratio * 2}s`;
        bar.dataset.amount = `$${obj.amount}`;
    }

    // Highlight current day with a different color
    const weekDayIndex = (new Date().getDay() - 1 + 7) % 7;
    const currBar = document.querySelectorAll(".bar")[weekDayIndex];
    currBar.style.backgroundColor = cyan;
    currBar.onmouseover = () => (currBar.style.backgroundColor = fadedCyan);
    currBar.onmouseout = () => (currBar.style.backgroundColor = cyan);
}

getData("data.json");

// Scale the design for bigger screens
const scalar = () => {
    const container = document.querySelector(".container");
    if (window.innerWidth >= 700) {
        container.style.transform = `scale(${window.innerWidth / 1440})`;
    } else {
        container.style.transform = `scale(1)`;
    }
};

window.onresize = scalar;

scalar();