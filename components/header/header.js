export default class Header {
	constructor($module) {
		this.$module = $module;

		const navbarMenu = document.getElementById("master-header");
		const burgerMenu = document.getElementById("burger");

		burgerMenu.addEventListener("click", toggleMenu);

		function toggleMenu() {
			navbarMenu.classList.toggle("active");
		}

		function collapseSubMenu() {
			const $coll = document.querySelectorAll("[data-toggle]");
			let $i;

			for ($i = 0; $i < $coll.length; $i++) {
				$coll[$i].addEventListener("click", function () {
					this.parentElement.parentElement.classList.toggle("active");
					const content = this.parentElement.nextElementSibling;
					content.classList.toggle("active");
				});
			}
		}

		// Fixed Resize Screen Function
		window.addEventListener("resize", () => {
			if (this.innerWidth > 1024) {
				// If navbarMenu is Open, then Close It
				if (navbarMenu.classList.contains("active")) {
					toggleMenu();
				}
				// // If menu-item-child is Expanded, then Collapse It
				// if (navbarMenu.querySelector('.menu-item-child.active')) {
				// 	collapseSubMenu();
				// }
			}
		});

		collapseSubMenu();

		const $search_coll = document.querySelectorAll("[data-toggle-search]");
		let $i;
		for ($i = 0; $i < $search_coll.length; $i++) {
			$search_coll[$i].addEventListener("click", function () {
				toggleSearch();
			});
		}

		function toggleSearch() {
			document
				.getElementsByClassName("bc-header")[0]
				.classList.toggle("bc-header__search-open");
			document.getElementsByClassName("bc-header__search_input")[0]
				.offsetParent === null
				? document.getElementsByClassName("bc-header__search_input")[1].focus()
				: document.getElementsByClassName("bc-header__search_input")[0].focus();
		}
	}
}
