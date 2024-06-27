const carousels = document.querySelectorAll('[data-carousel]');//выбираем все карусели на странице по атрибуту

carousels.forEach(carousel => { //выполняем код для КАЖДОЙ карусели
    const buttons = carousel.querySelectorAll('[data-carousel-button]');//внутри текущей карусели выбираем все кнопки по атрибуту

    buttons.forEach(button => {//выполняем код для КАЖДОЙ кнопки
        button.addEventListener('click', () => {
            const offset = button.dataset.carouselButton === 'next' ? 1 : -1;//Если кнопка имеет значение next, то offset будет 1 (переключение вперед), иначе offset будет -1 (переключение назад)
            const slides = carousel.querySelector('[data-slides]');//Находим единственный элемент с атрибутом [data-slides] внутри текущей карусели, который содержит все слайды - список ul
            const activeSlide = slides.querySelector('[data-active]'); //ищем активный слайд только внутри текущей карусели([data-slides]) 

            let newIndex = Array.from(slides.children).indexOf(activeSlide) + offset;

            if (newIndex < 0) { //если новый индекс меньше 0, то устанавливает его на последний слайд
                newIndex = slides.children.length - 1;
            } else if (newIndex >= slides.children.length) { //если новый индекс больше или равен количеству слайдов, то устанавливает его на первый слайд
                newIndex = 0;
            }

            // Установка активного слайда
            activeSlide.removeAttribute('data-active');//Устанавливает атрибут data-active новому активному слайду
            slides.children[newIndex].setAttribute('data-active', '');//Удаляет атрибут data-active у предыдущего активного слайда
        });
    });
});