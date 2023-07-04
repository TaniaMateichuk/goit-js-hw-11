import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup, resetGallery } from './js/createMarkup';
import ImageFetchApi from './js/api';

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const formEl = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onSubmitForm);
loadMoreBtnEl.addEventListener('click', onLoadMore);

const imageFetchApi = new ImageFetchApi();
let data = 0;

async function onSubmitForm(e) {
  e.preventDefault();

  imageFetchApi.query = e.target.elements.searchQuery.value;
  resetGallery();

  imageFetchApi.resetPage();
  loadMoreBtnEl.classList.remove('is-hidden');

  if (imageFetchApi.query === '') {
    resetGallery();
    loadMoreBtnEl.classList.remove('is-hidden');
    imageFetchApi.resetPage();
    Notify.info('Please enter your information in the search bar.');
    return;
  }
  if (loadMoreBtnEl.classList.contains('is-hidden')) {
    loadMoreBtnEl.classList.toggle('is-hidden');
  }

  try {
    const { totalHits, hits } = await imageFetchApi.getImage();

    if (hits.length !== 0) {
      createMarkup(hits);
      loadMoreBtnEl.classList.add('is-hidden');
      data += hits.length;
      Notify.success(`Hooray! We found ${totalHits} images.`);
      lightbox.refresh();
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (totalHits < 40) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  imageFetchApi.incrementPage();

  try {
    const { totalHits, hits } = await imageFetchApi.getImage();
    createMarkup(hits);
    lightbox.refresh();

    data += hits.length;

    if (data >= totalHits) {
      loadMoreBtnEl.classList.remove('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
  }
}
