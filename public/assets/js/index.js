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
        alert("error");
      }
      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < myvideos.length; i++) {
        // console.log(myvideos[i]);
        myvideos[
          i
        ].src = `https://www.youtube.com/embed/${data.items[i].id.videoId}`;
      }
      //   data.items.forEach((video) => {
      //     console.log(video.id.videoId);
      //   });
      //   console.log(data.items);
    })
    .catch((error) => {
      console.error("error a: ", error);
    });
}
getVideos();

// /Paulo
