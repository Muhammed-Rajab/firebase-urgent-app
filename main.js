import "./style.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

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

function formatDate(timestamp) {
  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(timestamp);
}

// ! FIREBASE RELATED STUFF STARTS HERE
const firebaseConfig = {
  apiKey: "AIzaSyBsMTbXMKRA5vDRJfZ3wnVlqKwnLE_m49Q",
  authDomain: "fir-urgent-chat.firebaseapp.com",
  projectId: "fir-urgent-chat",
  storageBucket: "fir-urgent-chat.appspot.com",
  messagingSenderId: "838616831614",
  appId: "1:838616831614:web:4fa8a244138dd3e3b7aa2f",
  measurementId: "G-JLLV4EBTYS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const msgCollection = collection(db, "messages");

// ! SHOW OLD MESSAGES
// const querySnapshot = await getDocs(msgCollection);
// querySnapshot.forEach((doc) => {
//   const timestamp = doc.data().timestamp;
//   const message = doc.data().message;
//   messageContainer.appendChild(createMessage(formatDate(timestamp), message));
// });

// ! ADD NEW MESSAGE
sendBtn.addEventListener("click", async (e) => {
  const msg = messageInput.value;
  if (msg.trim() === "") return;
  await addDoc(msgCollection, {
    timestamp: Date.now(),
    message: msg,
  });
  console.log("message was send");
  messageInput.innerHTML = "";
  messageInput.value = "";
});

// ! GET LIVE MESSAGES
const unsubscribe = onSnapshot(
  query(msgCollection, orderBy("timestamp")),
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const timestamp = change.doc.data().timestamp;
        const message = change.doc.data().message;
        messageContainer.appendChild(
          createMessage(formatDate(timestamp), message)
        );
        console.log("message received");
      }
    });
  }
);
