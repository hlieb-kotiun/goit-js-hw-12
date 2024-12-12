export function createMarkup(arr) {
  return arr
    .map(
      item =>
        ` <li class="gallery-item">
      <a href="${item.largeImageURL}"><img class="img" src="${item.webformatURL}" alt="${item.tags}"/></a>
      <div class="card-wrapper"><p class="like text">Likes<span class="content">${item.likes}</span></p>
      <p class="view text">Views<span class="content">${item.views}</span></p>
      <p class="comment text">Comments<span class="content">${item.comments}</span></p>
      <p class="download text">Downloads<span class="content">${item.downloads}</span></p></div>
      
    </li>`
    )
    .join('');
}
