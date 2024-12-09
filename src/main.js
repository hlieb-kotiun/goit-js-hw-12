import { fetchData } from './js/pixaby-api.';
import { createMarkup } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const btn = document.querySelector('.btn');
const galleryN = document.querySelector('.gallery');
const input = document.querySelector('.text-input');
const loader = document.querySelector('.loader');

form.addEventListener('submit', handletSubmit);
galleryN.addEventListener('click', handlerClick);

function handletSubmit(event) {
  event.preventDefault();

  const userChoice = event.target.elements.text.value.trim();
  if (userChoice === '') {
    return iziToast.warning({
      title: '',
      position: 'topRight',
      message: 'You forgot to fill the field!',
    });
  }
  form.reset();
  galleryN.innerHTML = '';
  loader.style.display = 'block';
  fetchData(
    `https://pixabay.com/api/?key=47394436-b99c7e5d1cf7e77b7cf55ecb6&q=${userChoice}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(data => {
      if (data.total === 0) {
        return iziToast.error({
          title: '',
          position: 'topRight',
          message:
            '"Sorry, there are no images matching your search query. Please try again!"',
        });
      }
      galleryN.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      gallery.refresh();
    })
    .catch(error =>
      iziToast.error({
        title: '',
        position: 'topRight',
        message: 'Oooops! Somthing went wrong :/',
      })
    )
    .finally(() => (loader.style.display = 'none'));
}

let gallery = new SimpleLightbox('.gallery-item a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function handlerClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  gallery.on('show.simplelightbox');
}
