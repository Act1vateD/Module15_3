const wsUri = "wss://echo-ws-service.herokuapp.com";

function pageLoaded() {
  const infoOutput = document.querySelector(".info_output");
  const chatOutput = document.querySelector(".chat_output");
  const input = document.querySelector("input");
  const sendBtn = document.querySelector(".btn_send"); 
  const geoBtn = document.querySelector(".btn_geo");

  let socket = new WebSocket(wsUri);

  function scroll () {
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }
  
  socket.onopen = () => {
    infoOutput.innerText = "Подключение к серверу успешно";
  }
  
  socket.onmessage = (event) => {
    writeToChat(event.data, true);
  }
  
  socket.onerror = () => {
    infoOutput.innerText = "Нет соединения с сервером";
  }
  
  sendBtn.addEventListener("click", sendMessage);
  
  function sendMessage() {
    if (!input.value) return;
    socket.send(input.value);
    writeToChat(input.value, false);
    input.value === "";
    input.value = '';
    setTimeout(scroll, 300);
  }
  
  function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${isRecieved? "recieved" : "sent"}">${message}</div>`;
    chatOutput.innerHTML += messageHTML;
  }


  
  geoBtn.addEventListener("click", getLocation);
  
  function getLocation() {
    let notSupport = "Ваш браузер не поддерживает функцию определения местоположения";
    if ("geolocation" in navigator) {
      let locationOptions = {
        enableHighAccuracy: true
      };
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
    } else {
      chatOutput.innerHTML += `<div class="recieved">${notSupport}</div>`;
      setTimeout(scroll, 300);
    }
  }
  
  function locationSuccess(data) {

    let link = `https://www.openstreetmap.org/#map=18/${data.coords.latitude}/${data.coords.longitude}`;
    let mLink = `<a href="${link}" target="_blank">Вы находитесь здесь</a>`;
    chatOutput.innerHTML += `<div class="recieved">${mLink}</div>`;
    setTimeout(scroll, 300);
  } 
  
  function locationError() {
    let geoError = "При получении местоположения произошла ошибка";
    chatOutput.innerHTML += `<div class="recieved">${geoError}</div>`;
    setTimeout(scroll, 300);
  }
}

document.addEventListener("DOMContentLoaded", pageLoaded);