console.log("made by gpuia");

var $xs = 425;
var $sm = 576;
var $md = 768;
var $lg = 992;
var $xl = 1200;
var $xxl = 1400;
var $xxxl = 1600;

var slider, sliderWidth, sliderImages;
var cursor = document.querySelector('.cursor'), cursorSmall = document.querySelector('.cursor-small');
var as = document.querySelectorAll('a');
var btns = document.querySelectorAll('btn');
var creditsWrapper, restartBtn, prevBtn, nextBtn, introTl = gsap.timeline()
    , creditsTl = gsap.timeline(), nextImageTl = gsap.timeline(), prevImageTl = gsap.timeline()
    , nextCaptionTl = gsap.timeline(), prevCaptionTl = gsap.timeline()
    , defaultEase = "power2.outIn", creditsBgDuration = 0.2, creditsDuration = 0.4;
var titleHeight = 42;

//Intro functions

function startIntroAnimations() {
    introTl.to("html", {opacity: 1, duration: 1})
    .to("html", {"--sliderCoverHeight": "0", duration: 1.2, delay: 0.4, ease: defaultEase})
    .to("html", {"--sliderCoverBorderColor": "transparent", duration: 1.1, delay: 0.4, ease: defaultEase}, "<")
    .to(".slider__images", {opacity: 1, duration: 0.8, ease: "power1.outIn"}, "<")
    .to(".captions_list", {opacity: 1, duration: 1.2, delay: 0.2, ease: defaultEase}, "<")
    .fromTo('h1.slider__title', {y: 20, duration: 1}, {/*height: titleHeight, */y: 0, opacity: 1, duration: 0.6}, "<");
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

if(window.innerWidth >= $lg) {
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
}
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
    let oldImage;
    let isPrevSlidePresent = false;

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
        //changeBtnStatus(restartBtn, "disabled");
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
    let imgTranslateX = 60;

    if(direction == "next") {
        if(isNextSlidePresent()) {
            translateValue += sliderWidth;

            nextImageTl.to(slider, {x: `-${translateValue}`, duration: sliderDuration, ease: sliderEase})
            .to(nextGsapSelector(".slider__image"), {x: imgTranslateX, scale: 1.3, duration: imgDuration, ease: imgEase}, "<")
            .to(currentGsapSelector(".slider__image"), {x: -imgTranslateX, scale: 1.2, duration: imgDuration, ease: imgEase}, "<");
            
            changeActiveSlide(activeSlide, "next");
            //changeBtnStatus(restartBtn, "active");
        }
    } else if(direction == "prev") {
        if(isPrevSlidePresent()) {
            translateValue -= sliderWidth;
            
            prevImageTl.to(slider, {x: `-${translateValue}`, duration: sliderDuration, ease: sliderEase})            
            .to(prevGsapSelector(".slider__image"), {x: -imgTranslateX, scale: 1.3, duration: imgDuration, ease: imgEase}, "<")
            .to(currentGsapSelector(".slider__image"), {x: imgTranslateX, scale: 1.2, duration: imgDuration, ease: imgEase}, "<");

            changeActiveSlide(activeSlide, "prev");
        }
    }
}


async function moveCaption(direction) {

    let activeCaption = await getActiveCaption();
    let nextCaption = await getNextCaption();
    let prevCaption = await getPrevCaption();
    

    let nextGsapSelector = gsap.utils.selector(nextCaption);
    let prevGsapSelector = gsap.utils.selector(prevCaption);
    let currentGsapSelector = gsap.utils.selector(activeCaption);

    let captionOutEase = "power2.inOut";
    let captionOutDuration = 0.4;
    let captionInEase = "power2.inOut";
    let captionInDuration = 0.6;

    if(direction == "next") {
        if(isNextCaptionPresent()) {
            console.log("TEXT ANIMATION NEXXXT");

            nextCaptionTl.to(currentGsapSelector(".caption__text"), {opacity: 0, duration: captionOutDuration, ease: captionOutEase})
            .to(currentGsapSelector(".caption__text--two"), {opacity: 0, duration: captionOutDuration, ease: captionOutEase}, "<")
            .from(nextGsapSelector(".caption__text"), {y: 20, duration: captionInDuration, delay: 0.2, ease: captionInEase})
            .to(nextGsapSelector(".caption__text"), {y: 0, opacity: 1, duration: captionInDuration, ease: captionInEase}, "<")
            .from(nextGsapSelector(".caption__text--two"), {y: 20, duration: captionInDuration, delay: 0.2, ease: captionInEase}, "<")
            .to(nextGsapSelector(".caption__text--two"), {y: 0, opacity: 1, duration: captionInDuration, ease: captionInEase}, "<");
            
            changeActiveCaption(activeCaption, "next");
        }
    } else if(direction == "prev") {
        if(isPrevSlidePresent()) {

            console.log("TEXT ANIMATION PREV");

            prevCaptionTl.to(currentGsapSelector(".caption__text"), {opacity: 0, duration: captionOutDuration, ease: captionOutEase})
            .to(currentGsapSelector(".caption__text--two"), {opacity: 0, duration: captionOutDuration, ease: captionOutEase}, "<")
            .from(prevGsapSelector(".caption__text"), {y: 20, duration: captionInDuration, delay: 0.2, ease: captionInEase})
            .to(prevGsapSelector(".caption__text"), {y: 0, opacity: 1, duration: captionInDuration, ease: captionInEase}, "<")
            .from(prevGsapSelector(".caption__text--two"), {y: 20, duration: captionInDuration, delay: 0.2, ease: captionInEase}, "<")
            .to(prevGsapSelector(".caption__text--two"), {y: 0, opacity: 1, duration: captionInDuration, ease: captionInEase}, "<");

            changeActiveCaption(activeCaption, "prev");
        }
    }
}




async function getActiveCaption() {
    let currentActiveCaption;

    Array.from(captions).forEach((caption) => {
        if(caption.dataset.active == "active") {
            currentActiveCaption = caption;
        }
    });
    
    return currentActiveCaption;
}
async function getNextCaption() {
    let currentNextCaption;
    let foundActiveCaption = false;

    Array.from(captions).forEach((caption) => {
        if(caption.dataset.active == "active") {
            foundActiveCaption = true;            
        } else if(foundActiveCaption) {
            currentNextCaption = caption;
            foundActiveCaption = false;
        }
    });
    
    return currentNextCaption;
}
async function getPrevCaption() {
    let currentPrevCaption, oldcaption;

    Array.from(captions).forEach((caption) => {
        if(caption.dataset.active == "active") {
            currentPrevCaption = oldcaption;
        }
        oldcaption = caption;
    });
    
    return currentPrevCaption;
}

function isNextCaptionPresent() {
    let isNextCaptionPresent = false;
    let foundActiveCaption = false;

    let i = 0;

    Array.from(captions).forEach((caption) => {
        i++;
        if(caption.dataset.active == "active") {
            foundActiveCaption = true;
        } else if(foundActiveCaption) {
            isNextCaptionPresent = true;
        }
    });

    if(isNextCaptionPresent) {
        //console.log("isNextCaptionPresent - NEXT PRESENT");
        changeBtnStatus(nextBtn, "active");
        return true;
    } else {
        //console.log("isNextCaptionPresent - THE END");
        changeBtnStatus(nextBtn, "disabled");
        return false;
    }
}

async function isPrevCaptionPresent() {
    let oldCaption;
    let isPrevCaptionPresent = false;

    Array.from(captions).forEach((caption) => {
        if(caption.dataset.active == "active" && oldCaption) {
            isPrevCaptionPresent = true;
        } 
        oldCaption = caption;
    });
    
    if(isPrevCaptionPresent) {
        //console.log("isPrevCaptionPresent - PREV PRESENT");
        changeBtnStatus(prevBtn, "active");
        return true;
    } else {
        //console.log("isPrevCaptionPresent - THE START");
        changeBtnStatus(prevBtn, "disabled");
        //changeBtnStatus(restartBtn, "disabled");
        return false;
    }
}
function checkCaptionsAvailability() {
    isNextCaptionPresent();
    isPrevCaptionPresent();
}
async function changeActiveCaption(activeCaption, slidePosition) {
    if(slidePosition == "prev") {
        let prevCaption = await getPrevCaption();
        activeCaption.dataset.active = "";
        prevCaption.dataset.active = "active";
    } else if(slidePosition == "next") {
        let nextCaption = await getNextCaption();
        activeCaption.dataset.active = "";
        nextCaption.dataset.active = "active";
    }
    checkCaptionsAvailability();
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

function changeBtnStatus(btn, status) {
    if(status == "active") {
        btn.classList.remove("disabled");
    } else if(status == "disabled")
    btn.classList.add("disabled");
}


window.onresize = (event) => {
    sliderWidth = slider.getBoundingClientRect().width;
    console.log(`RESIZE - sliderWidth = ${sliderWidth}`);
}
window.onload = (event) => {

    creditsWrapper = document.getElementById("credits_bg");
    
    slider = document.getElementById("sliderEl");
    sliderImages = document.getElementsByClassName("slider__image_container");
    sliderWidth = slider.getBoundingClientRect().width;
    console.log(`onload - sliderWidth = ${sliderWidth}`);
    
    captions = document.getElementsByClassName("caption");

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
    
    /*restartBtn.addEventListener("click", function(e){
        if(!this.classList.contains("disabled")) {
            restartSlider();
        }
    });*/
    prevBtn.addEventListener("click", function(e){
        if(!this.classList.contains("disabled")) {
            moveSlide("prev");
            moveCaption("prev");
        }
    });
    nextBtn.addEventListener("click", function(e){
        if(!this.classList.contains("disabled")) {
            moveSlide("next");
            moveCaption("next");
        }
    });

};