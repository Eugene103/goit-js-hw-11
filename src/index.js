import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { serviceSearch } from './js/axios';
import { createMarkup } from './js/createMarkup';



const elements = {
    searchForm: document.querySelector(`#search-form`),
    galleryContainer: document.querySelector(`.gallery`),
}

const galleryLightBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: true,
    enableKeyboard: true
});

elements.searchForm.addEventListener(`submit`, handlerSearch);

let page = 0;
function handlerSearch(evt) {
    evt.preventDefault();
    const { searchQuery } = evt.currentTarget.elements;
    elements.galleryContainer.innerHTML = ` `;
    page = 1;

    Notiflix.Loading.pulse();
    serviceSearch(searchQuery.value, page)
        .then(data => {
            Notiflix.Loading.remove();
            if (data.hits.length === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else {
                Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
                elements.galleryContainer.innerHTML = createMarkup(data.hits);
                galleryLightBox.refresh();
                
                }
        })
    .catch(err => {
      Notiflix.Report.failure(
  'Ooops!',
  'Something went wrong!',
  'Try reloading the page!',
  function cb() {
   document.location.reload();
  },
  {
    width: '360px',
    svgSize: '120px',
  },
);
    }); 
}

function addNewSearch(evt) {
    page = page + 1;
    Notiflix.Loading.pulse();
    serviceSearch(elements.searchForm.searchQuery.value, page)
        .then(data => {
        
    Notiflix.Loading.remove();
            if (data.hits.length === 0) {
                Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`)
            } else {
                elements.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(data.hits))
                galleryLightBox.refresh();
                const { height: cardHeight } = document
                    .querySelector(".gallery")
                    .firstElementChild.getBoundingClientRect();
                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: "smooth",});
            }           
        })
.catch(err => {
      Notiflix.Report.failure(
  'Ooops!',
  'Something went wrong!',
  'Try reloading the page!',
  function cb() {
   document.location.reload();
  },
  {
    width: '360px',
    svgSize: '120px',
  },
);
    });
}

window.addEventListener("scroll", throttle(checkPosition, 250)) 

    function checkPosition(evt){
    var contentHeight = elements.galleryContainer.offsetHeight;
    let y = window.scrollY + window.innerHeight;
    if (y >= contentHeight) {
               addNewSearch();
    }
    
};

function throttle(callee, timeout) {
  let timer = null

  return function perform(...args) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}
