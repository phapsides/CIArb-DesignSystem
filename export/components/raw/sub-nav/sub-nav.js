export default class Subnav {
	constructor($module) {
		this.$module = $module;

		const $subNavTriggers = document.getElementsByClassName("sub-nav-trigger");

		for (let $i = 0; $i < $subNavTriggers.length; $i++) {
			$subNavTriggers[$i].addEventListener("click", function () {
				toggleSubMenu($subNavTriggers[$i]);
			});
		}

		function toggleSubMenu(elm) {
			if (elm.parentNode.parentNode.getAttribute("aria-active") == "true") {
				elm.parentNode.parentNode.removeAttribute("aria-active");
			} else {
				elm.parentNode.parentNode.setAttribute("aria-active", "true");
			}
		}
	}
}
