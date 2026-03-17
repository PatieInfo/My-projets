// This variable stores the count - it lives in memory
let count = 0;

// This function runs every time the button is clicked
function handleClick() {

  // Add 1 to the count
  count = count + 5;

  // Update the number shown on screen
  document.getElementById("count").textContent = count;

  // Animate the circle - add bump class then remove it
  const display = document.querySelector(".counter-display");
  display.classList.add("bump");
  setTimeout(() => display.classList.remove("bump"), 100);

  // Change the message based on the count
  const message = document.getElementById("message");

  if (count === 1) {
    message.textContent = "Great start!";
  } else if (count === 5) {
    message.textContent = "You're on a roll!";
  } else if (count === 10) {
    message.textContent = "Double digits! 🔥";
  }  else if (count === 20) {
    message.textContent = "Stay hot ♨️";
  } else if (count === 25) {
    message.textContent = "You can't stop! 😂";
  } else if (count === 50) {
    message.textContent = "Okay, that's impressive 👏";
  } else if (count === 100) {
    message.textContent = "100 CLICKS! LEGEND! 🏆";
  } else {
    message.textContent = "Keep going!";
  }
}

// This function resets everything back to zero
function handleReset() {
  count = 0;
  document.getElementById("count").textContent = count;
  document.getElementById("message").textContent = "Start clicking!";
}