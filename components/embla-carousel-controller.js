// import Autoplay from 'https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js'


// {
//     // or start, center,end, number
//     align: 'center',
//     // or 'y'
//     axis: 'x',
//     // parent container
//     containerSelector: '*',
//     // choose between keeping redundant snap points or trimming them
//     // 'trimSnaps' or 'keepSnaps'
//     containScroll: '',
//     // the number of slides to show per page
//     slidesToScroll: 1,
//     // contains slides to the carousel viewport to prevent excessive scrolling at the beginning or the end
//     containScroll: false,
//     // enable draggable
//     draggable: true,
//     dragFree: false,
//     // auto spacing
//     autoSpacing: false,
//     // auto resize
//     autoResize: false,
//     // infinite loop
//     loop: true,
//     // animation speed
//     speed: 10,
//     // start index
//     // 0 = slide 1
//     startIndex: 0,
//     // default CSS classes
//     selectedClass: 'is-selected',
//     draggableClass: 'is-draggable',
//     draggingClass: 'is-dragging',
//     // or using dir="rtl" on the top container
//     direction: 'rtl',
//     // allow the carousel to skip scroll snaps if it's dragged vigorously. 
//     // Note that this option will be ignored if the dragFree option is set to true.
//     skipSnaps: false,
//     // choose a fraction representing the percentage portion of a slide that needs to be visible in order to be considered in view. 
//     // For example, 0.5 equals 50%.
//     inViewThreshold: 0,
// }
const Autoplay = EmblaCarouselAutoplay;
const emblaNode = document.getElementById('embla');
const autoplayOptions = {
    delay: 4000,
    stopOnInteraction: false,
}

const autoplay = Autoplay(autoplayOptions)


let emblaOptions = { 
    axis: 'x',
    loop: true,
    slidesToScroll: 1,
    stopOnLastSnap: false, 
    inViewThreshold: 0,
}

// var emblaPlugins = [EmblaCarouselAutoplay()]
var embla = EmblaCarousel(emblaNode, emblaOptions, [autoplay])


const viewportNode = emblaNode.querySelector('.embla__viewport')
const prevButtonNode = emblaNode.querySelector('#embla__prev')
const nextButtonNode = emblaNode.querySelector('#embla__next')


prevButtonNode.addEventListener('click', embla.scrollPrev, false)
nextButtonNode.addEventListener('click', embla.scrollNext, false)

// const options = { 
//     delay: 4000,
//     stopOnInteraction: true,
//     stopOnMouseEnter: false,
//     stopOnLastSnap: false, 
// }
// const rootNode = (emblaRoot) => emblaRoot.parentElement
// const autoplay = Autoplay(options, rootNode)



// autoplay.play()
