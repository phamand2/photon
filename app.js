const auth = '563492ad6f91700001000001bcc7fff5da2a48e59e8a5ae452c09c2a';

let api = axios.create({
  headers: {
    'Authorization': auth
  } 
})

const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const more = document.querySelector('.more');
let page = 1;
let fetchLink;
let currentSearch;
let searchValue;

//Event Listeners
searchInput.addEventListener('input', updateInput)

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
})

more.addEventListener('click', loadMore)

function updateInput(e){
  searchValue = e.target.value;
}

function generatePictures(data){
  data.photos.forEach(({src, photographer}) => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `
    <div class='gallery-info'>
    <p>${photographer}</p>
    <a href=${src.original}>Download</a>
    </div>
    <img src=${src.large}></img>
    `;
    gallery.appendChild(galleryImg)
  })
}


async function curatedPhotos(){
  fetchLink = "https://api.pexels.com/v1/curated?per_page=16&page=1"
  const dataFetch = await api.get(fetchLink)
  const {data} = dataFetch;
  generatePictures(data)
}

async function searchPhotos(query){
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=16&page=1`
  const dataFetch = await api.get(fetchLink)
  const {data} = dataFetch;
  generatePictures(data);
}

function clear(){
  gallery.innerHTML = '';
  searchInput.value = '';
}

async function loadMore(){
  page++;
  if(currentSearch){
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=16&page=${page}`
  } else{
    fetchLink = `https://api.pexels.com/v1/curated?per_page=16&page=${page}`
  }
  const {data} = await api.get(fetchLink)
  generatePictures(data)
}

curatedPhotos();
