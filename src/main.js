import "./input.css";
import { createCountdownController, createDomRefs } from "./countdown.js";

const dDayRefs = createDomRefs();
const countdown = createCountdownController(dDayRefs);

dDayRefs.startButton.addEventListener("click", () => {
  countdown.startCountdown();
});

dDayRefs.resetButton.addEventListener("click", () => {
  countdown.resetCountdown();
});

countdown.init();
