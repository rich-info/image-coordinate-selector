const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const imageContainer = document.getElementById("imageContainer");
const coordinatesList = document.getElementById("coordinatesList");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");
const ctx = canvas.getContext("2d");

let img = new Image();
let clickCount = 0;

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result; 
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.hidden = false;

        ctx.drawImage(img, 0, 0);

        clearButton.hidden = false;
        copyButton.hidden = false;
      };
    };
    reader.readAsDataURL(file);
    clearCoordinates();
  } else {
    alert("Please upload a PNG or JPEG image.");
  }
});
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  clickCount++;
  drawXMarker(x, y, clickCount);
  appendCoordinatesToList(x, y, clickCount);
});
function drawXMarker(x, y, clickNumber) {
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 5);
  ctx.lineTo(x + 5, y + 5);
  ctx.moveTo(x + 5, y - 5);
  ctx.lineTo(x - 5, y + 5);
  ctx.stroke();
  ctx.font = "16px Arial";
  ctx.fillText(clickNumber, x + 8, y - 8);
}
function appendCoordinatesToList(x, y, clickNumber) {
  const coordinateItem = document.createElement("div");
  coordinateItem.innerText = `${clickNumber} - X: ${Math.round(
    x
  )}, Y: ${Math.round(y)}`;
  coordinatesList.appendChild(coordinateItem);
}
clearButton.addEventListener("click", function () {
  clearCoordinates();
});
function clearCoordinates() {
  clickCount = 0;
  if (img.src) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }
  coordinatesList.innerHTML = "";
}
copyButton.addEventListener("click", function () {
  const coordinates = [];
  coordinatesList.childNodes.forEach((item) => {
    const text = item.innerText;
    const [x, y] = text.match(/\d+/g);
    coordinates.push(x, y);
  });
  const coordinateString = coordinates.join(",");
  navigator.clipboard
    .writeText(coordinateString)
    .then(() => {
      console.log("Coordinates copied to clipboard!");
    })
    .catch(() => {
      console.error("Failed to copy coordinates.");
    });
});

canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  tooltip.hidden = false;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.innerText = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
});

canvas.addEventListener("mouseleave", function () {
  tooltip.hidden = true;
});
