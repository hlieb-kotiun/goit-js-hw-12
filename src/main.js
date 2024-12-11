import axios from 'axios';
import { fetchData } from './js/pixaby-api.';
import { createMarkup } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const btn = document.querySelector('.btn');
const pageGallery = document.querySelector('.gallery');
const input = document.querySelector('.text-input');
const loader = document.querySelector('.loader');
const loadMore = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '?key=47394436-b99c7e5d1cf7e77b7cf55ecb6';
const PER_PAGE = 15;

let userSearch = '';
let page = 1;

form.addEventListener('submit', handleSubmit);
pageGallery.addEventListener('click', handleClick);
loadMore.addEventListener('click', pageUpload);

async function handleSubmit(event) {
  event.preventDefault();
  const userRequest = event.target.elements.text.value.trim();
  userSearch = userRequest;
  page = 1;

  if (userRequest === '') {
    return iziToast.warning({
      title: '',
      position: 'topRight',
      message: 'You forgot to fill the field!',
    });
  }
  form.reset();
  pageGallery.innerHTML = '';
  loader.style.display = 'block';
  loadMore.style.display = 'none';

  try {
    const response =
      await fetchData(`https://pixabay.com/api/?key=47394436-b99c7e5d1cf7e77b7cf55ecb6&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}
`);
    if (response.data.total === 0) {
      return iziToast.error({
        title: '',
        position: 'topRight',
        message:
          '"Sorry, there are no images matching your search query. Please try again!"',
      });
    }
    gallery.refresh();
    pageGallery.insertAdjacentHTML(
      'beforeend',
      createMarkup(response.data.hits)
    );

    if (response.data.total > 15) {
      loadMore.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({
      title: '',
      position: 'topRight',
      message: 'Oooops! Somthing went wrong :/',
    });
  } finally {
    loader.style.display = 'none';
  }
}

async function pageUpload() {
  page++;
  loader.style.display = 'block';
  loadMore.disabled = true;

  const galleryItem = document.querySelector('.gallery-item');
  const { height } = galleryItem.getBoundingClientRect();

  try {
    const response = await fetchData(
      `https://pixabay.com/api/?key=47394436-b99c7e5d1cf7e77b7cf55ecb6&q=${userSearch}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`
    );

    pageGallery.insertAdjacentHTML(
      'beforeend',
      createMarkup(response.data.hits)
    );
    gallery.refresh();
    window.scrollBy({
      top: height * 2,
      left: 0,
      behavior: 'smooth',
    });
    if (page >= response.data.totalHits / PER_PAGE) {
      loadMore.style.display = 'none';
      iziToast.warning({
        title: '',
        position: 'bottomCenter',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      title: '',
      position: 'topRight',
      message: 'Oooops! Somthing went wrong :/',
    });
  } finally {
    loader.style.display = 'none';
    loadMore.disabled = false;
  }
}

let gallery = new SimpleLightbox('.gallery-item a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function handleClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  gallery.on('show.simplelightbox');
}
