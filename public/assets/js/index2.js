// Js Paulo

function getVideos() {
  const myvideos = document.querySelectorAll(".ytvideo");
  fetch(
    "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBX-n32HsLTgJtglqHI7_6Qs2btTJhz0dY&channelId=UCY_aA4xy4BG7rJm1goIFqpA&part=snippet&order=viewCount&type=video&maxResults=3",
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        console.log("error");
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      if (typeof data.error?.code !== "undefined") {
        const videos = [
          "https://www.youtube.com/embed/CshA5cGpiN0?si=W3cYWhsh-JraXthf",
          "https://www.youtube.com/embed/xSFLuS3AKdY?si=7czJSEZxyMIhh4qZ",
          "https://www.youtube.com/embed/qLZieDp0hI0?si=VYc2iACMWqVN_WnK",
        ];
        for (let i = 0; i < myvideos.length; i++) {
          myvideos[i].src = videos[i];
        }
      } else {
        const sort = [2, 0, 1];
        for (let i = 0; i < myvideos.length; i++) {
          myvideos[i].src = `https://www.youtube.com/embed/${
            data.items[sort[i]].id.videoId
          }`;
        }
      }
    })
    .catch((error) => {
      console.error("error a: ", error);
    });
}
getVideos();

//ModalDev
function setModalView(overflow, zindex, state) {
  document.body.style.overflow = overflow;
  modalDev.style.zIndex = zindex;
  state == true
    ? modalDev.classList.add("show")
    : modalDev.classList.remove("show");
}
const btnDev = document.getElementById("btn-dev");
const modalDev = document.getElementById("modal-gatitos");
const btnClose = document.getElementById("closeM");
const modalCard = document.getElementById("dev-card");
btnDev.addEventListener("click", function () {
  setModalView("hidden", 100, true);
});
btnClose.addEventListener("click", function () {
  setModalView("auto", -1, false);
});
modalDev.addEventListener("click", function (event) {
  if (!modalCard.contains(event.target)) {
    setModalView("auto", -1, false);
  }
});

//Enviar el mensaje
function formResponse(head, body, loader) {
  const messageHead = document.querySelector("#form-response h6");
  const messageBody = document.querySelector("#form-response p");
  const resMessage = document.getElementById("form-response");
  loader.classList.add("d-none");
  resMessage.classList.remove("d-none");
  messageHead.innerHTML = head;
  messageBody.innerHTML = body;
}
//salir del modal
const resButton = document.querySelector("#form-response button");
resButton.addEventListener("click", () => {
  const resView = document.getElementById("form-loader");
  resView.classList.add("d-none");
});

const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const resView = document.getElementById("form-loader");
  const loader = document.getElementById("img-form-loader");
  resView.classList.remove("d-none");
  loader.classList.remove("d-none");

  const formData = new FormData(contactForm);
  //cambiar ruta para deploy
  fetch("http://localhost/PruebaPHPmailer/send_mail.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        formResponse("Hubo un error", "Por favor inténtelo más tarde", loader);
        console.log("ma");
        console.log(response);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.message) {
        formResponse(
          data.message,
          "Nos contactaremos contigo lo antes posible.",
          loader
        );
        contactForm.reset();
      }
    })
    .catch((error) => {
      formResponse("Hubo un error", "Por favor inténtelo más tarde", loader);
      console.error("Error:", error);
    });
});
// Contact-form end

// /Paulo
