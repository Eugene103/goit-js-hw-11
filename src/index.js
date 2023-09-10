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
  enableKeyboard: true,
  disableScroll: true
});
function scrollDown() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}
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
              infinityScroll.observe(elements.galleryContainer.lastChild);
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
const infinityScroll = new IntersectionObserver(onScroll, { rootMargin: '100px' });

  function onScroll(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        infinityScroll.unobserve(elements.galleryContainer.lastChild)
            page = page + 1;
          Notiflix.Loading.pulse();
          serviceSearch(elements.searchForm.searchQuery.value, page)
            .then(data => {
              console.log(data)
                      Notiflix.Loading.remove();
            if (data.hits.length <= 40) {
              scrollDown();
              Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`)
            } else {
              elements.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(data.hits))
              galleryLightBox.refresh();
              scrollDown();
              infinityScroll.observe(elements.galleryContainer.lastChild);
          }    
              if (page > data.totalHits / 40) {
        
            infinityScroll.unobserve(elements.galleryContainer.lastChild);
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
    });
}

// function addNewSearch(evt) {
//     page = page + 1;
//     Notiflix.Loading.pulse();
//     serviceSearch(elements.searchForm.searchQuery.value, page)
//         .then(data => {
        
//     Notiflix.Loading.remove();
//             if (data.hits.length === 0) {
//                 Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`)
//             } else {
//                 elements.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(data.hits))
//                 galleryLightBox.refresh();
//                 const { height: cardHeight } = document
//                     .querySelector(".gallery")
//                     .firstElementChild.getBoundingClientRect();
//                 window.scrollBy({
//                     top: cardHeight * 2,
//                     behavior: "smooth",});
//             }           
//         })
// .catch(err => {
//       Notiflix.Report.failure(
//   'Ooops!',
//   'Something went wrong!',
//   'Try reloading the page!',
//   function cb() {
//    document.location.reload();
//   },
//   {
//     width: '360px',
//     svgSize: '120px',
//   },
// );
//     });
// }