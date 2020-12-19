// Movement Animation to happen

const card = document.querySelector('.card');
const container = document.querySelector('.container');
const innerWidth = window.innerWidth / 2;
const innerHeight = window.innerHeight / 2;

// Items
const title = document.querySelector('.title');
const sneaker = document.querySelector('.sneaker img');
const purchase = document.querySelector('.purchase button');
const description= document.querySelector('.info h3');
const sizes = document.querySelector('.sizes');


// Moving Animation Event

container.addEventListener('mousemove', (e) => {
    const xAxis =  (innerWidth - e.pageX) / 10;
    const yAxis = (innerHeight - e.pageY) / 10;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`
});

// Animate In
container.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
    // Popout
    title.style.transform = 'translateZ(150px)';
    sneaker.style.transform = 'translateZ(200px) rotateZ(-45deg)';
    description.style.transform = 'translateZ(125px)';
    sizes.style.transform = 'translateZ(100px)';
    purchase.style.transform = 'translateZ(75px)';
})

// Animate Out

container.addEventListener('mouseleave', () => {
    card.style.transition = 'all 0.5s ease';
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    //Popback
    title.style.transform = 'translateZ(0)';
    sneaker.style.transform = 'translateZ(0px) rotateZ(0deg)';
    description.style.transform = 'translateZ(0)';
    sizes.style.transform = 'translateZ(0)';
    purchase.style.transform = 'translateZ(0)';
})