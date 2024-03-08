import "./style.css";

const messageContainer = document.querySelector(".message-container");
const messageInput = document.querySelector(".message-input");
const sendBtn = document.querySelector(".send-btn");

function createMessage(date, message) {
  const code = `
        <p class="message" data-id="">
          <span class="font-bold text-[#6e6e6e]">${date}</span> ${message}
        </p>
  `;
  const temp = document.createElement("template");
  temp.innerHTML = code.trim();

  return temp.content.firstChild;
}
