const slider = document.querySelector('.about__slider');

let mySwiper;

function mobileSlider() {
	if (window.innerWidth <= 1024 && slider.dataset.mobile == 'false') {
		mySwiper = new Swiper(slider, {
			autoplay: true,
			loop: true,
			speed: 400,
			slidesPerView: 4,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 5,
				},
				375: {
					slidesPerView: 2,
					spaceBetween: 5,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 5,
				},
			},
		});

		slider.dataset.mobile = 'true';
	}

	if (window.innerWidth > 1024) {
		slider.dataset.mobile = 'false';

		if (slider.classList.contains('swiper-container-initialized')) {
			mySwiper.destroy();
		}
	}
}

mobileSlider();

window.addEventListener('resize', () => {
	mobileSlider();
});


let sliderReview = new Swiper('.slider-review', {
	autoplay: true,
	loop: true,
	observer: true,
	observeParents: true,
	slidesPerView: 1,
	speed: 400,
	pagination: {
		el: '.slider-review__dots',
		clickable: true,
	},
});




