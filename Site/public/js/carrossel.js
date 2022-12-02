
const slides = document.querySelectorAll('[data-js="carousel__item"]')
const nextButton = document.querySelector('[data-js="carousel__button--next"]')
const prevButton = document.querySelector('[data-js="carousel__button--prev"]')
var currentSlideIndex = 0;

const segundo_slides = document.querySelectorAll('[data-js="segundo_carousel__item"]')
const segundo_nextButton = document.querySelector('[data-js="segundo_carousel__button--next"]')
const segundo_prevButton = document.querySelector('[data-js="segundo_carousel__button--prev"]')
var segundo_currentSlideIndex = 0;

const terceiro_slides = document.querySelectorAll('[data-js="terceiro_carousel__item"]')
const terceiro_nextButton = document.querySelector('[data-js="terceiro_carousel__button--next"]')
const terceiro_prevButton = document.querySelector('[data-js="terceiro_carousel__button--prev"]')
var terceiro_currentSlideIndex = 0;



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

terceiro_nextButton.addEventListener('click', () => {
    if(terceiro_currentSlideIndex === terceiro_slides.length - 1){
        terceiro_currentSlideIndex = 0;
    }else {
        terceiro_currentSlideIndex++
    }
    
    console.log('oi')

    terceiro_slides.forEach(slide =>{
    slide.classList.remove('terceiro_carousel__item--visible')
    })
    terceiro_slides[terceiro_currentSlideIndex].classList.add('terceiro_carousel__item--visible')
})

terceiro_prevButton.addEventListener('click', () => {
if(terceiro_currentSlideIndex === 0){
    terceiro_currentSlideIndex = terceiro_slides.length - 1
}else{
    terceiro_currentSlideIndex--
}
    
terceiro_slides.forEach(slide => {
        slide.classList.remove('terceiro_carousel__item--visible')
    })
    terceiro_slides[terceiro_currentSlideIndex].classList.add('terceiro_carousel__item--visible')
})