import { clearInputs, fillInputs, getTargetDateInput, parseTargetDate } from "./date.js";
import { COUNTDOWN_MESSAGES } from "./messages.js";
import { clearSavedDate, getSavedDate, saveDate } from "./storage.js";

export function createDomRefs() {
  const dDayContainer = document.querySelector("#d-day-container");
  const dDayMessage = document.querySelector("#d-day-message");
  const targetYearInput = document.querySelector("#target-year-input");
  const targetMonthInput = document.querySelector("#target-month-input");
  const targetDateInput = document.querySelector("#target-date-input");
  const startButton = document.querySelector("#start-button");
  const resetButton = document.querySelector("#reset-button");
  const daySpan = document.querySelector("#days");
  const hourSpan = document.querySelector("#hours");
  const minSpan = document.querySelector("#min");
  const secSpan = document.querySelector("#sec");

  return {
    dDayContainer,
    dDayMessage,
    targetYearInput,
    targetMonthInput,
    targetDateInput,
    startButton,
    resetButton,
    daySpan,
    hourSpan,
    minSpan,
    secSpan,
  };
}

function setMessage(dDayMessage, message) {
  const heading = document.createElement("h3");
  heading.textContent = message;
  dDayMessage.replaceChildren(heading);
  dDayMessage.style.display = "flex";
}

function hideMessage(dDayMessage) {
  dDayMessage.style.display = "none";
}

function showCountdown(dDayContainer) {
  dDayContainer.style.display = "flex";
}

function hideCountdown(dDayContainer) {
  dDayContainer.style.display = "none";
}

function renderCountdown(daySpan, hourSpan, minSpan, secSpan, remainingSeconds) {
  const remainingTime = {
    days: Math.floor(remainingSeconds / 3600 / 24),
    hours: Math.floor(remainingSeconds / 3600) % 24,
    min: Math.floor(remainingSeconds / 60) % 60,
    sec: Math.floor(remainingSeconds) % 60,
  };

  daySpan.textContent = String(remainingTime.days).padStart(2, "0");
  hourSpan.textContent = String(remainingTime.hours).padStart(2, "0");
  minSpan.textContent = String(remainingTime.min).padStart(2, "0");
  secSpan.textContent = String(remainingTime.sec).padStart(2, "0");
}

export function createCountdownController({
  dDayContainer,
  dDayMessage,
  targetYearInput,
  targetMonthInput,
  targetDateInput,
  daySpan,
  hourSpan,
  minSpan,
  secSpan,
}) {
  const intervalIds = [];
  const targetDateInputs = {
    targetYearInput,
    targetMonthInput,
    targetDateInput,
  };

  function clearCountdownIntervals() {
    while (intervalIds.length > 0) {
      clearInterval(intervalIds.pop());
    }
  }

  function updateCountdown(targetDateInputValue) {
    const targetDate = parseTargetDate(targetDateInputValue);

    if (!targetDate) {
      clearSavedDate();
      hideCountdown(dDayContainer);
      setMessage(dDayMessage, COUNTDOWN_MESSAGES.invalidDate);
      return false;
    }

    const remainingSeconds = (targetDate - new Date()) / 1000;

    if (remainingSeconds <= 0) {
      clearSavedDate();
      hideCountdown(dDayContainer);
      setMessage(dDayMessage, COUNTDOWN_MESSAGES.expired);
      return false;
    }

    renderCountdown(daySpan, hourSpan, minSpan, secSpan, remainingSeconds);
    showCountdown(dDayContainer);
    hideMessage(dDayMessage);
    return true;
  }

  function startCountdown(targetDateInputValue = getTargetDateInput(targetDateInputs)) {
    if (!targetDateInputValue) {
      hideCountdown(dDayContainer);
      setMessage(dDayMessage, COUNTDOWN_MESSAGES.emptyDate);
      return;
    }

    fillInputs(targetDateInputs, targetDateInputValue);
    clearCountdownIntervals();

    if (!updateCountdown(targetDateInputValue)) {
      return;
    }

    saveDate(targetDateInputValue);

    const intervalId = setInterval(() => {
      if (!updateCountdown(targetDateInputValue)) {
        clearCountdownIntervals();
      }
    }, 1000);

    intervalIds.push(intervalId);
  }

  function resetCountdown() {
    clearCountdownIntervals();
    clearSavedDate();
    clearInputs(targetDateInputs);
    hideCountdown(dDayContainer);
    setMessage(dDayMessage, COUNTDOWN_MESSAGES.emptyDate);
  }

  function init() {
    const savedDate = getSavedDate();

    if (savedDate) {
      startCountdown(savedDate);
      return;
    }

    hideCountdown(dDayContainer);
    setMessage(dDayMessage, COUNTDOWN_MESSAGES.emptyDate);
  }

  return {
    init,
    startCountdown,
    resetCountdown,
  };
}
