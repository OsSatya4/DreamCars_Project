const track = document.querySelector('.slider-track');
const slides = Array.from(track.children);
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentIndex = 0;
const visibleCount = 3; 

function updateSlider() {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.width = `${slideWidth * slides.length}px`; // slider track szélessége az összes kép szélességére

  let newTranslateX = -slideWidth * visibleCount * currentIndex;

  
  const maxTranslateX = slideWidth * slides.length - slideWidth * visibleCount;
  if (newTranslateX < -maxTranslateX) {
    newTranslateX = 0;
    currentIndex = 0;
  }

  track.style.transform = `translateX(${newTranslateX}px)`;
}

prevBtn.addEventListener('click', () => {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : Math.floor(slides.length / visibleCount) - 1;
  updateSlider();
});

nextBtn.addEventListener('click', () => {
  currentIndex = currentIndex < Math.floor(slides.length / visibleCount) - 1 ? currentIndex + 1 : 0;
  updateSlider();
});


updateSlider();