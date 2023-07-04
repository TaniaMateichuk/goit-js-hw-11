export function createMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><a class = 'gallery-link' href='${largeImageURL}'>
        <img class ="images" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
        <p class="info-item">
            <b>Likes</b>
            ${likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${views}
        </p>
        <p class="info-item">
            <b>Comments</b>
            ${comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>
            ${downloads}
        </p>
        </div>
    
    </div>`;
      }
    )
    .join('');
  const refs = getRefs();

  refs.galleryImage.insertAdjacentHTML('beforeend', markup);
}

export function resetGallery() {
  const refs = getRefs();
  refs.galleryImage.innerHTML = '';
}

function getRefs() {
  return {
    galleryImage: document.querySelector('.gallery'),
  };
}
