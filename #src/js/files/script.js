// BURGER MENU
const iconMenu = document.querySelector('.icon-menu');
const menuHeader = document.querySelector('.menu-header');
const body = document.querySelector('body');


iconMenu.addEventListener("click", function (e) {
	iconMenu.classList.toggle('active');
	menuHeader.classList.toggle('active')
	body.classList.toggle('lock');
});
// BURGER MENU

// HEADER FIX
window.addEventListener('scroll', function () {
	const header = document.querySelector('.header');

	if (window.pageYOffset > 150) {
		header.classList.add('fixed');
	} else {
		header.classList.remove('fixed');
	}
})
// HEADER FIX

// NAVIGATION PAGE
const menuLinks = document.querySelectorAll('.menu-header__link[data-goto]');

if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const goToBlock = document.querySelector(menuLink.dataset.goto);
			const goToBlockValue = goToBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('active')) {
				iconMenu.classList.remove('active');
				menuHeader.classList.remove('active')
				body.classList.remove('lock');
			}
			menuLink.classList.add('active');

			window.scrollTo({
				top: goToBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}
// NAVIGATION PAGE


