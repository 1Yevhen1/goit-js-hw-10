import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const input = document.querySelector("#datetime-picker");
const buttonStart = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

// Функція для додавання нуля спереду
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

flatpickr(input, {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  onClose(selectedDates) {
    const selectedTime = selectedDates[0].getTime();
    if (selectedTime <= Date.now()) {
      buttonStart.disabled = true;
      alert("Please choose a date in the future"); // повідомлення
    } else {
      buttonStart.disabled = false;
    }
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Оновлення інтерфейсу
function updateClockface({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

const timer = {
  intervalId: null,
  start() {
    const targetTime = Date.parse(input.value);
    if (this.intervalId) return;

    buttonStart.disabled = true;

    this.intervalId = setInterval(() => {
      const deltaTime = targetTime - Date.now();
      if (deltaTime <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        updateClockface(convertMs(0));
        return;
      }
      updateClockface(convertMs(deltaTime));
    }, 1000);
  },
};

buttonStart.addEventListener("click", () => {
  timer.start();
});