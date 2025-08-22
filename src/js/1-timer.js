import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const buttonStart = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");


buttonStart.disabled = true;


function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  minuteIncrement: 1,
  dateFormat: "Y-m-d H:i",
  onClose(selectedDates) {
    const selectedTime = selectedDates[0]?.getTime();
    if (!selectedTime || selectedTime <= Date.now()) {
      buttonStart.disabled = true;
      iziToast.warning({
        title: 'Помилка',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 2000,
      });
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
    if (!targetTime || this.intervalId) return;

    buttonStart.disabled = true;

    this.intervalId = setInterval(() => {
      const deltaTime = targetTime - Date.now();
      if (deltaTime <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        updateClockface(convertMs(0));
        iziToast.success({
          title: 'Готово',
          message: 'Таймер завершено!',
          position: 'topRight',
          timeout: 2000,
        });
        return;
      }
      updateClockface(convertMs(deltaTime));
    }, 1000);
  },
};

buttonStart.addEventListener("click", () => {
  timer.start();
});