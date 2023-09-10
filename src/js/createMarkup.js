function createMarkup(arr) {
    return arr.map(({ comments, downloads, largeImageURL, likes, webformatURL, views, tags }) => `<a href="${largeImageURL}" class="infinity">
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> 
      <span class="alt">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="alt">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="alt">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="alt">${downloads}</span>
    </p>
  </div>
</div></a>`).join('')

};
export { createMarkup };