import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const submit = document.querySelector('.form button[type="submit"]');

submit.addEventListener('click', (event) => {
  event.preventDefault();

  const delay = Number(document.querySelector('input[name="delay"]').value);
  const success = document.querySelector('input[name="state"]:checked')?.value === "fulfilled";

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(`Fulfilled promise in ${delay}ms`);
      } else {
        reject(`Rejected promise in ${delay}ms`);
      }
    }, delay);
  });

  promise
    .then(message => {
      console.log(`✅ ${message}`);
      iziToast.show({
        message: `✅ ${message}`,
        position: "topRight",
        color: "green"
      });
    })
    .catch(message => {
      console.log(`❌ ${message}`);
      iziToast.show({
        message: `❌ ${message}`,
        position: "topRight",
        color: "red"
      });
    });
});