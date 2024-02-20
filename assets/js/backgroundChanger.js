function createMovingShape() {
    const shapes = document.querySelectorAll(".moving-shape");  
    if(shapes.length >9) {
        return;
      }
    var shape = document.createElement('div');
    shape.classList.add('moving-shape');
    var width = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
    shape.style.width = width + 'px';
    var right = Math.floor(Math.random() * (window.innerWidth * 0.9 - (-50) + 1)) + (-50);
    shape.style.right = right + 'px';
    var duration = Math.floor(Math.random() * (8 - 2 + 1)) + 2;
    shape.style.animationDuration = duration + 's';
    var randomColor = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    shape.style.backgroundColor = randomColor;
    document.querySelector(".background").appendChild(shape);
    shape.addEventListener('animationend', function() {
        let shapes = document.querySelectorAll(".moving-shape"); 
        console.log(shapes.length);
        shape.remove();
        shapes = document.querySelectorAll(".moving-shape"); 
     
    });
}

createMovingShape();
setInterval(createMovingShape, 4000);
