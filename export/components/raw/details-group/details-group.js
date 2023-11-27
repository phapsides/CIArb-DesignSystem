export default class DetailsGroup {
	constructor($module, settings = {}) {
		this.$container = $module;
		const defaultSettings = {
			forceSingle: false,
		};
		this.settings = Object.assign({}, defaultSettings, settings);
		this.$allModules = $module.querySelectorAll(".bc-details");
		this.create();
	}
	create() {
		this.$allModules.forEach(($module) => {
			if (this.settings.forceSingle) {
				$module.bindToggle = this.onSingleToggle.bind(this);
				$module.addEventListener("toggle", $module.bindToggle);
			}
			const $nextButton = $module.querySelector("[data-details-group-next]");
			if ($nextButton) {
				$nextButton.bindNext = this.onNextButton.bind(this);
				$nextButton.addEventListener("click", $nextButton.bindNext);
			}
		});
	}
	destroy() {
		this.$allModules.forEach(($module) => {
			if (this.settings.forceSingle) {
				$module.removeEventListener("toggle", $module.bindToggle);
			}
			const $nextButton = $module.querySelector("[data-details-group-next]");
			$nextButton.removeEventListener("click", $nextButton.bindNext);
		});
	}
	onSingleToggle(e) {
		if (!e.target.hasAttribute("open")) {
			return;
		}
		const $openModules = Array.from(
			this.$container.querySelectorAll(".bc-details[open]")
		);
		$openModules.forEach(($module) => {
			if ($module === e.target) {
				return;
			}
			$module.removeAttribute("open");
		});
	}
	onNextButton(e) {
		const $parent = e.target.closest(".bc-details");
		const $next = $parent.nextElementSibling;
		$parent.removeAttribute("open");
		if ($next && $next.tagName === "DETAILS") {
			$next.setAttribute("open", "open");
		}
	}
}
