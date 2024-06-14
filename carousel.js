document.addEventListener ('DOMContentLoaded', () => { //указывает браузеру выполнить функцию, когда полностью загружен и обработан HTML-документ
    const track = document.querySelector('.carousel-container__track');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const slides = Array.from(track.children);
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;


    /*const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = `translateX(-${targetSlide.style.left})`;
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    /*slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;

        if (prevSlide) {
            currentIndex--;
            moveToSlide(track, currentSlide, prevSlide);
        }
    });

    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;

        if (nextSlide) {
            currentIndex++;
            moveToSlide(track, currentSlide, nextSlide);
        }
    });

    slides[0].classList.add('current-slide');*/

    const moveToSlide = (currentSlide, targetSlide) => {
        track.style.transform = `translateX(-${targetSlide.style.left})`;
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;

        if (prevSlide) {
            currentIndex--;
            moveToSlide(currentSlide, prevSlide);
        }
    });

    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;

        if (nextSlide) {
            currentIndex++;
            moveToSlide(currentSlide, nextSlide);
        }
    });

    slides[0].classList.add('current-slide');
});