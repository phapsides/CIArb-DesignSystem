export default class Modal {
	constructor($module) {
		this.$module = $module;

		const $coll_open = document.querySelectorAll("[data-modal-open]");
		let $i;

		for ($i = 0; $i < $coll_open.length; $i++) {
			$coll_open[$i].addEventListener("click", function () {
				let modal_id = this.getAttribute("data-modal-open");
				document
					.getElementById("bc-modal-" + modal_id)
					.classList.add("bc-modal--open");
			});
		}

		const $coll_close = document.querySelectorAll("[data-modal-close]");
		let $i2;

		for ($i2 = 0; $i2 < $coll_close.length; $i2++) {
			$coll_close[$i2].addEventListener("click", function () {
				let modal_id = this.getAttribute("data-modal-close");
				document
					.getElementById("bc-modal-" + modal_id)
					.classList.remove("bc-modal--open");
			});
		}
	}
}
