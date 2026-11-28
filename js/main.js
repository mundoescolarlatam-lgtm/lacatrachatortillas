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

    // Sincronizar espacio superior del banner completo bajo el menú fijo
    var syncFullPageHeaderOffset = function () {
        var fullHeaders = document.querySelectorAll('.page-header-full');
        if (!fullHeaders.length) {
            return;
        }
        var fixedTop = document.querySelector('.fixed-top');
        if (!fixedTop) {
            return;
        }
        var collapse = fixedTop.querySelector('.navbar-collapse');
        if (collapse && collapse.classList.contains('show')) {
            return;
        }
        var headerHeight = fixedTop.offsetHeight;
        if (headerHeight > 0) {
            fullHeaders.forEach(function (el) {
                el.style.paddingTop = headerHeight + 'px';
            });
        }
    };

    syncFullPageHeaderOffset();
    $(window).on('load resize', syncFullPageHeaderOffset);

    // =========================================================================
    // Lightbox Popup para Recetas (recetas.html & en/recetas.html)
    // =========================================================================
    var initRecipeLightbox = function () {
        var modalEl = document.getElementById('recipeLightboxModal');
        if (!modalEl || typeof bootstrap === 'undefined') {
            return;
        }

        var triggers = Array.prototype.slice.call(document.querySelectorAll('.js-recipe-popup'));
        if (!triggers.length) {
            return;
        }

        var modalTitle = modalEl.querySelector('#recipeLightboxTitle');
        var modalIngredient = modalEl.querySelector('#recipeLightboxIngredient');
        var modalImg = modalEl.querySelector('#recipeLightboxImg');
        var prevBtn = modalEl.querySelector('#recipeLightboxPrev');
        var nextBtn = modalEl.querySelector('#recipeLightboxNext');
        var bsModal = new bootstrap.Modal(modalEl);

        // Deduplicate recipes by image src so card image click and button click share the same index
        var recipes = [];
        var srcToIndex = {};
        triggers.forEach(function (el) {
            var src = el.getAttribute('data-recipe-img');
            if (!src) {
                return;
            }
            if (typeof srcToIndex[src] === 'undefined') {
                srcToIndex[src] = recipes.length;
                recipes.push({
                    src: src,
                    title: el.getAttribute('data-recipe-title') || '',
                    ingredient: el.getAttribute('data-recipe-ingredient') || ''
                });
            }
            el.setAttribute('data-recipe-index', String(srcToIndex[src]));
        });

        var currentIndex = 0;

        function renderRecipe(index) {
            if (!recipes.length) {
                return;
            }
            currentIndex = (index + recipes.length) % recipes.length;
            var item = recipes[currentIndex];
            if (modalTitle) {
                modalTitle.textContent = item.title;
            }
            if (modalIngredient) {
                modalIngredient.textContent = item.ingredient;
            }
            if (modalImg) {
                modalImg.src = item.src;
                modalImg.alt = item.title;
            }
        }

        triggers.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                var idx = parseInt(el.getAttribute('data-recipe-index'), 10) || 0;
                renderRecipe(idx);
                bsModal.show();
            });
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var idx = parseInt(el.getAttribute('data-recipe-index'), 10) || 0;
                    renderRecipe(idx);
                    bsModal.show();
                }
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                renderRecipe(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                renderRecipe(currentIndex + 1);
            });
        }

        modalEl.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                renderRecipe(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                renderRecipe(currentIndex + 1);
            }
        });
    };

    initRecipeLightbox();
    
})(jQuery);

