const space = document.querySelector('.space');
let shooter = document.querySelector('.shooter');

let info = document.querySelector('.info');
let again = document.querySelector('.again');

again.classList.add('disable');

let moveBy = 30;
let bulletMover = 5;

window.addEventListener('load', ()=>{
  shooter.style.position = 'relative';
  shooter.style.top = 638; //678
  shooter.style.left = 5;
});


window.addEventListener('keydown', (e)=>{
  let left = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'));

  switch(e.key){
    case 'ArrowLeft':
    case 'a':
      parseInt(shooter.style.left) <= 5 ? console.log("You' ve reached the end") : shooter.style.left = parseInt(shooter.style.left) - moveBy + 'px';
      break;
    case 'ArrowRight':
    case 'd':
      parseInt(shooter.style.left) >= 820 ? console.log("You' ve reached the end") : shooter.style.left = parseInt(shooter.style.left) + moveBy + 'px';
      break;
    case 'ArrowUp':
    case 'w':
    case 'Enter':
      let bullet = document.createElement('div');
      bullet.classList.add('bullets');
      space.appendChild(bullet);

      let moveBullet = setInterval(()=>{

        let rocks = document.querySelectorAll('.rocks');

        for(let i = 0; i < rocks.length; i++){
          let rock = rocks[i];
          
          let rockbound = rock.getBoundingClientRect();
          let bulletbound = bullet.getBoundingClientRect();

          if(
            bulletbound.left >= rockbound.left &&
            bulletbound.right <= rockbound.right &&
            bulletbound.top <= rockbound.top &&
            bulletbound.bottom <= rockbound.bottom
          ){

            rock.parentElement.removeChild(rock);
            // bullet.parentElement.removeChild(bullet);

            let count = document.querySelector('.count');
            count.innerHTML = parseInt((count).innerHTML) + 1;
            
          }
        }


        let bulletbottom = parseInt(
          window.getComputedStyle(bullet).getPropertyValue('bottom')
        );


        if(bulletbottom >= 670){
          bullet.parentElement.removeChild(bullet);
        }


        bullet.style.left = 40 + left + 'px';
        bullet.style.bottom = bulletbottom + bulletMover + 'px';
      }, 1);
      break;
    default: 
      
  }
});




let makeRocks = setInterval(()=>{

  let rock = document.createElement('div');
  rock.classList.add('rocks');
  let rockLeft = parseInt(window.getComputedStyle(rock).getPropertyValue('left'));
  rock.style.left = Math.floor(Math.random()*850) + 'px';

  space.appendChild(rock);

}, 1500);

let moveRocks = setInterval(()=>{

  let rocks = document.querySelectorAll('.rocks');

  if(rocks != undefined){
    for(let i = 0; i<rocks.length; i++){
      let rock = rocks[i];
      let rockTop = parseInt(
        window.getComputedStyle(rock).getPropertyValue('top')
      );

      rock.style.top = rockTop + 20 + 'px';

      if(rockTop >= 640){
        clearInterval(makeRocks);
        clearInterval(moveRocks);
        
        rocks.forEach((rock)=>{
          rock.style.display = 'none';
        });

        again.classList.remove('disable');
        info.innerHTML = "GAME OVER";
      }
    }
  }

}, 300); 

again.addEventListener('click', (e)=>{
  window.location.reload();
});

