console.log("made by gpuia");

var slider, sliderWidth, sliderImages;
var cursor = document.querySelector('.cursor'), cursorSmall = document.querySelector('.cursor-small');
var as = document.querySelectorAll('a');
var btns = document.querySelectorAll('btn');
var creditsWrapper, restartBtn, prevBtn, nextBtn, introTl = gsap.timeline(), creditsTl = gsap.timeline(), nenxtTl = gsap.timeline(), prevTl = gsap.timeline()
    defaultEase = "power2.outIn", creditsBgDuration = 0.2, creditsDuration = 0.4;
var titleHeight = 42;

//Intro functions

function startIntroAnimations() {
    introTl.fromTo('h1.slider__title', {x: 200, duration: 1}, {/*height: titleHeight, */x: 0, opacity: 1, duration: 1})
    .to("html", {"--sliderCoverHeight": "0", duration: 1.2, delay: 0.4, ease: defaultEase});
}

//Credits functions
function openCredits() {
    creditsTl.to('#credits_bg', {display: "flex", opacity: 1, duration: creditsBgDuration, ease: defaultEase})
    .fromTo('#credits_bg .credits', {y: 20, duration: creditsDuration, ease: defaultEase}, {y: 0, opacity: 1, ease: defaultEase});
}
function closeCredits() {
    creditsTl.to('#credits_bg .credits', {y: 20, opacity: 0, duration: creditsDuration, ease: defaultEase})
    .to('#credits_bg', {display: "none", opacity: 0, duration: creditsBgDuration, delay: 0.3, ease: defaultEase}, "<");
}


//Custom cursor functions
document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursorSmall.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
});
//Click
document.addEventListener('mousedown', function(){
  cursor.classList.add('click');
});

document.addEventListener('mouseup', function(){
  cursor.classList.remove('click')
});

//Hover effect
as.forEach(item => {
    item.addEventListener('mouseover', () => {
        cursor.classList.add('hover');
        cursorSmall.classList.add('hover');
    });
    item.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorSmall.classList.remove('hover');
    });
})
btns.forEach(item => {
    item.addEventListener('mouseover', () => {
        if(!item.classList.contains("disabled")) {
            cursor.classList.add('hover');
            cursorSmall.classList.add('hover');
        }
    });
    item.addEventListener('mouseleave', () => {
        if(!item.classList.contains("disabled")) {
            cursor.classList.remove('hover');
            cursorSmall.classList.remove('hover');
        }
    });
})

//Slider functions
async function getActiveSlide() {
    let currentActiveSlide;

    Array.from(sliderImages).forEach((image) => {
        if(image.dataset.active == "active") {
            currentActiveSlide = image;
        }
    });
    
    return currentActiveSlide;
}

function changeBtnStatus(btn, status) {
    if(status == "active") {
        btn.classList.remove("disabled");
    } else if(status == "disabled")
    btn.classList.add("disabled");
}

async function getNextSlide() {
    let currentNextSlide;
    let foundActiveSlide = false;

    Array.from(sliderImages).forEach((image) => {
        if(image.dataset.active == "active") {
            foundActiveSlide = true;            
        } else if(foundActiveSlide) {
            currentNextSlide = image;
            foundActiveSlide = false;
        }
    });
    
    return currentNextSlide;
}
async function getPrevSlide() {
    let currentPrevSlide, oldImage;

    Array.from(sliderImages).forEach((image) => {
        if(image.dataset.active == "active") {
            currentPrevSlide = oldImage;
        }
        oldImage = image;
    });
    
    return currentPrevSlide;
}

function isNextSlidePresent() {
    let isNextSlidePresent = false;
    let foundActiveSlide = false;
    let isPreviousSlideActive = false;

    let i = 0;

    Array.from(sliderImages).forEach((image) => {
        i++;
        if(image.dataset.active == "active") {
            foundActiveSlide = true;
        } else if(foundActiveSlide) {
            isNextSlidePresent = true;
        }
    });

    if(isNextSlidePresent) {
        //console.log("isNextSlidePresent - NEXT PRESENT");
        changeBtnStatus(nextBtn, "active");
        return true;
    } else {
        //console.log("isNextSlidePresent - THE END");
        changeBtnStatus(nextBtn, "disabled");
        return false;
    }
}

async function isPrevSlidePresent() {
    let currentPrevSlide, oldImage;
    let isPrevSlidePresent = false;
    let foundActiveSlide = false;

    Array.from(sliderImages).forEach((image) => {
        if(image.dataset.active == "active" && oldImage) {
            isPrevSlidePresent = true;
        } 
        oldImage = image;
    });
    
    if(isPrevSlidePresent) {
        //console.log("isPrevSlidePresent - PREV PRESENT");
        changeBtnStatus(prevBtn, "active");
        return true;
    } else {
        //console.log("isPrevSlidePresent - THE START");
        changeBtnStatus(prevBtn, "disabled");
        changeBtnStatus(restartBtn, "disabled");
        return false;
    }
}

function checkSlidesAvailability() {
    isNextSlidePresent();
    isPrevSlidePresent();
}

async function changeActiveSlide(activeSlide, slidePosition) {
    if(slidePosition == "prev") {
        let prevSlide = await getPrevSlide();
        activeSlide.dataset.active = "";
        prevSlide.dataset.active = "active";
    } else if(slidePosition == "next") {
        let nextSlide = await getNextSlide();
        activeSlide.dataset.active = "";
        nextSlide.dataset.active = "active";
    }
    checkSlidesAvailability();
}

async function moveSlide(direction) {
    let activeSlide = await getActiveSlide();  
    let nextSlide = await getNextSlide();  
    let prevSlide = await getPrevSlide();  


    let nextGsapSelector = gsap.utils.selector(nextSlide);
    let prevGsapSelector = gsap.utils.selector(prevSlide);
    let currentGsapSelector = gsap.utils.selector(activeSlide);

    let sliderEase = "power2.inOut";
    let sliderDuration = 1.2;
    let imgEase = "power2.inOut";
    let imgDuration = 1.2;
    let imgTranslateX = 50;

    if(direction == "next") {
        if(isNextSlidePresent()) {
            translateValue += sliderWidth;

            nenxtTl.to(slider, {x: `-${translateValue}`, duration: sliderDuration, ease: sliderEase})
            .to(nextGsapSelector(".slider__image"), {x: imgTranslateX, scale: 1.3, duration: imgDuration, ease: imgEase}, "<")
            .to(currentGsapSelector(".slider__image"), {x: -imgTranslateX, scale: 1.2, duration: imgDuration, ease: imgEase}, "<");
            
            changeActiveSlide(activeSlide, "next");
            changeBtnStatus(restartBtn, "active");
        }
    } else if(direction == "prev") {
        if(isPrevSlidePresent()) {
            translateValue -= sliderWidth;
            
            prevTl.to(slider, {x: `-${translateValue}`, duration: sliderDuration, ease: sliderEase})            
            .to(prevGsapSelector(".slider__image"), {x: -imgTranslateX, scale: 1.3, duration: imgDuration, ease: imgEase}, "<")
            .to(currentGsapSelector(".slider__image"), {x: imgTranslateX, scale: 1.2, duration: imgDuration, ease: imgEase}, "<");

            changeActiveSlide(activeSlide, "prev");
        }
    }
}

function restartSlider() {
    slider.style.transform = `translate3d(0px, 0, 0)`;
    Array.from(sliderImages).forEach((image) => {
        image.dataset.active = "";
    });
    sliderImages[0].dataset.active = "active";
    translateValue = 0;
    changeBtnStatus(prevBtn, "disabled");
    changeBtnStatus(nextBtn, "active");
    changeBtnStatus(restartBtn, "disabled");
}

window.onresize = (event) => {
    sliderWidth = slider.getBoundingClientRect().width;
    console.log(`RESIZE - sliderWidth = ${sliderWidth}`);
}
window.onload = (event) => {

    creditsWrapper = document.getElementById("credits_bg");
    
    slider = document.getElementById("sliderEl");
    sliderImages = document.getElementsByClassName("slider__image_container")
    sliderWidth = slider.getBoundingClientRect().width;
    console.log(`onload - sliderWidth = ${sliderWidth}`);

    translateValue = 0;

    restartBtn = document.getElementById("restartBtn");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");

    startIntroAnimations();

    creditsWrapper.addEventListener("click", function(e){
        if (e.target === this) {
            closeCredits();
        }
    });
    
    restartBtn.addEventListener("click", function(e){
        if(!this.classList.contains("disabled")) {
            restartSlider();
        }
    });
    prevBtn.addEventListener("click", function(e){
        if(!this.classList.contains("disabled")) {
            moveSlide("prev");
        }
    });
    nextBtn.addEventListener("click", function(e){
        if(!this.classList.contains("disabled")) {
            moveSlide("next");
        }
    });

};