const imagesWrapper = document.querySelector(".gallery ul");
const themeSwitch = document.querySelector(".theme-switch"),
  togglebtn = document.querySelector(".toggle"),
  sun = document.querySelector(".bx-sun"),
  loadMoreBtn = document.querySelector(".load-more"),
  search = document.querySelector("#search"),
  lightbox = document.querySelector(".lightbox"),
  download = document.querySelector(".download"),
  moon = document.querySelector(".bx-moon");

themeSwitch.addEventListener("click", changeTheme);

function changeTheme() {
  togglebtn.classList.toggle("dark");
  document.body.classList.toggle("dark-mode");
  if (togglebtn.classList.contains("dark")) {
    sun.style.display = "none";
    moon.style.display = "block";
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
  }
}

const apiKey = "Xg72mXpUWzNrAeI5j5q6p8bnNfNhFXjHlmtz8313WS6mFF5pPBQJuyCD ";

const perpage = 20;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image"));
};

const showlightbox = (name, img) => {
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("p").textContent = name;
  download.setAttribute("data-img", img);
  lightbox.classList.add("show");
  document.body.style.overflow = "auto";
};

const closelightbox = () => {
  lightbox.classList.remove("show");
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (image) => `
            <li class="card" onclick="showlightbox('${image.photographer}', '${image.src.large2x}')">
          <img src="${image.src.large2x}" alt="" />
          <div class="details">
            <div class="photographer">
              <i class="bx bx-camera"></i>
              <p>${image.photographer}</p>
            </div>
            <button class="download" onClick="downloadImg('${image.src.large2x}')"; event.stopPropagation();>
              <i class="bx bx-download"></i>
            </button>
          </div>
        </li>
  `
    )
    .join("");
};

const getImages = (apiURL) => {
  loadMoreBtn.innerText = "loading";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "load more";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perpage}
`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perpage}
`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perpage}
`);
  }
};

loadMoreBtn.addEventListener("click", loadMoreImages);
search.addEventListener("keyup", loadSearchImages);
download.addEventListener("click", (e) => downloadImg(e.target.dataset.img));

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perpage}
`);
