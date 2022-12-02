
const slides = document.querySelectorAll('[data-js="carousel__item"]')
const nextButton = document.querySelector('[data-js="carousel__button--next"]')
const prevButton = document.querySelector('[data-js="carousel__button--prev"]')
var currentSlideIndex = 0;

const segundo_slides = document.querySelectorAll('[data-js="segundo_carousel__item"]')
const segundo_nextButton = document.querySelector('[data-js="segundo_carousel__button--next"]')
const segundo_prevButton = document.querySelector('[data-js="segundo_carousel__button--prev"]')
var segundo_currentSlideIndex = 0;
console.log('slide2',segundo_slides)

nextButton.addEventListener('click', () => {
    if(currentSlideIndex === slides.length - 1){
        currentSlideIndex = 0;
    }else {
        currentSlideIndex++
    }
    
    console.log('oi')

    slides.forEach(slide =>{
    slide.classList.remove('carousel__item--visible')
    })
    slides[currentSlideIndex].classList.add('carousel__item--visible')
})

prevButton.addEventListener('click', () => {
if(currentSlideIndex === 0){
    currentSlideIndex = slides.length - 1
}else{
    currentSlideIndex--
}
    
    slides.forEach(slide => {
        slide.classList.remove('carousel__item--visible')
    })
    slides[currentSlideIndex].classList.add('carousel__item--visible')
})



segundo_nextButton.addEventListener('click', () => {
    if(segundo_currentSlideIndex === segundo_slides.length - 1){
        segundo_currentSlideIndex = 0;
    }else {
        segundo_currentSlideIndex++
    }
    
    console.log('oi')
    
    segundo_slides.forEach(slide =>{
    slide.classList.remove('segundo_carousel__item--visible')
    })
    segundo_slides[segundo_currentSlideIndex].classList.add('segundo_carousel__item--visible')
})

segundo_prevButton.addEventListener('click', () => {
if(segundo_currentSlideIndex === 0){
    segundo_currentSlideIndex = segundo_slides.length - 1
}else{
    segundo_currentSlideIndex--
}
    
    segundo_slides.forEach(slide => {
        slide.classList.remove('segundo_carousel__item--visible')
    })
    segundo_slides[segundo_currentSlideIndex].classList.add('segundo_carousel__item--visible')
})