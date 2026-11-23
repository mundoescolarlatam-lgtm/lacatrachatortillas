(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel video playback
    var playActiveCarouselVideo = function () {
        var video = $('#header-carousel').find('.carousel-item.active video').get(0);
        if (video) {
            video.play().catch(function () {});
        }
    };
    playActiveCarouselVideo();

    $('#header-carousel').on('slide.bs.carousel', function () {
        var video = $(this).find('.carousel-item.active video').get(0);
        if (video) {
            video.pause();
        }
    });

    $('#header-carousel').on('slid.bs.carousel', function () {
        var video = $(this).find('.carousel-item.active video').get(0);
        if (video) {
            video.currentTime = 0;
            video.play().catch(function () {});
        }
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    // =========================================================================
    // Parallax Engine (60fps GPU Accelerated con requestAnimationFrame)
    // =========================================================================
    var initParallax = function () {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        var ticking = false;
        var carouselMedia = document.querySelectorAll('#header-carousel .carousel-item img, #header-carousel .carousel-item video');
        var carouselCaptions = document.querySelectorAll('#header-carousel .carousel-caption .container');
        var parallaxBanners = document.querySelectorAll('.parallax-banner');
        var pageHeaders = document.querySelectorAll('.page-header');

        function updateParallax() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            var winHeight = window.innerHeight;

            // 1. Hero Carousel Parallax (Desplazamiento suave y profundidad en el hero)
            if (scrollY < winHeight && carouselMedia.length > 0) {
                var mediaY = scrollY * 0.38;
                var captionY = scrollY * 0.18;
                var captionOpacity = Math.max(0, 1 - (scrollY / (winHeight * 0.72)));

                carouselMedia.forEach(function (el) {
                    el.style.transform = 'translate3d(0, ' + mediaY + 'px, 0) scale(1.06)';
                });

                carouselCaptions.forEach(function (el) {
                    el.style.transform = 'translate3d(0, ' + captionY + 'px, 0)';
                    el.style.opacity = captionOpacity;
                });
            }

            // 2. Parallax Showcase Banners
            parallaxBanners.forEach(function (banner) {
                var rect = banner.getBoundingClientRect();
                if (rect.top < winHeight && rect.bottom > 0) {
                    var bgEl = banner.querySelector('.parallax-bg');
                    if (bgEl) {
                        var distance = (rect.top - (winHeight / 2)) * 0.28;
                        bgEl.style.transform = 'translate3d(0, ' + distance + 'px, 0) scale(1.12)';
                    }
                }
            });

            // 3. Page Header Parallax en subpáginas
            pageHeaders.forEach(function (header) {
                var rect = header.getBoundingClientRect();
                if (rect.top < winHeight && rect.bottom > 0) {
                    var dist = (rect.top - (winHeight / 2)) * 0.25;
                    header.style.backgroundPositionY = 'calc(35% + ' + (dist * 0.35) + 'px)';
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // Inicializar al cargar
        updateParallax();

        // Actualizar al cambiar de slide en el carrusel
        $('#header-carousel').on('slid.bs.carousel', function () {
            updateParallax();
        });
    };

    initParallax();
    
})(jQuery);

