$(document).ready(function(){
    const menuOpen = document.querySelector('.menu-toggle'); 
    const menuClose = document.querySelector('.close-menu');    
    const mobMenu = document.querySelector('.nav-menu');
    const mobMenuLink = mobMenu.querySelectorAll('.menu-item');
    
    
    if(window.innerWidth < 768){
        for(let item of mobMenuLink){
        item.addEventListener('click', function(){
            mobMenu.classList.remove('active');
            document.body.classList.remove('noscroll');
            menuOpen.style.display = "block";
        })
    }
     menuOpen.addEventListener('click', function(){
        mobMenu.classList.add('active');
        document.body.classList.add('noscroll');
        this.style.display="none";
    })
     menuClose.addEventListener('click', function(){
        mobMenu.classList.remove('active');
         document.body.classList.remove('noscroll');
         menuOpen.style.display = "block";
    })
        }   
    
    window.addEventListener('resize', function(){
        if(window.innerWidth < 768){
        for(let item of mobMenuLink){
        item.addEventListener('click', function(){
            mobMenu.classList.remove('active');
            document.body.classList.remove('noscroll');
            menuOpen.style.display = "block";
        })
    }
     menuOpen.addEventListener('click', function(){
        mobMenu.classList.add('active');
        document.body.classList.add('noscroll');
        this.style.display="none";
    })
     menuClose.addEventListener('click', function(){
        mobMenu.classList.remove('active');
         document.body.classList.remove('noscroll');
         menuOpen.style.display = "block";
    })
        }   
    })

    //Owl-carousel
    $(".img-block").owlCarousel({
        items: 1,
        margin: 20,
        center: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2000,
        loop: true,
        dotsSpeed: 1200,
        autoplaySpeed: 1200,
        responsive : {
    
        0 : {
            items : 1,
            },
        768 : {
            items : 2,
            },
        992 : {
            items : 3,
            center: false
            }
        }
    })
    
    //Animate-Image1
    let bg = document.querySelector('.mail-img');
    if(bg){
        window.addEventListener('mousemove', function (e) {
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;
        bg.style.transform = 'translate(-' + x * 10 + 'px, -' + y * 25 + 'px)';
        });
    };
    
    
    //Animate-Image2
    let bg2 = document.querySelector('.mail-img2');
    if(bg2){
      window.addEventListener('mousemove', function (e) {
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;
        bg2.style.transform = 'translate(' + x * 10 + 'px, -' + y * 25 + 'px)';
        });  
    };
    
    //Gallery-FancyBox
    let gallery = document.querySelector('.gallery-wrapper')
    if(gallery){
    $('[data-fancybox="gallery"]').fancybox({
        hideOnContentClick : true,
        centerOnScroll : false,
        helpers: {
            overlay: {
                locked: false
            }
        }
      })
    }
})