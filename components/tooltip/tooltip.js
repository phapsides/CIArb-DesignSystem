import Helpers from "../../src/js/global/_helpers";

export default class Tooltip {
	constructor($module) {
		this.$module = $module;
		this.$toggle = $module.querySelector(".bc-tooltip__toggle");
		this.$tooltip = $module.querySelector(".bc-tooltip__body");
		this.$tooltipClose = this.$tooltip.querySelector(".bc-tooltip__close");
		this.isOpen = false;
		// A11y setup
		this.$toggle.setAttribute("aria-describedby", this.$tooltip.id);
		this.$tooltip.setAttribute("role", "tooltip");
		this.hide();
		// Bind events
		this.$toggle.boundClick = this.onToggleClick.bind(this);
		this.$toggle.boundEscapeKeydown = this.onEscapeKey.bind(this);
		this.$toggle.addEventListener("click", this.$toggle.boundClick, true);
		this.$tooltip.boundClickOutside = this.onClickOutside.bind(this);
		if (this.$tooltipClose) {
			this.$tooltipClose.boundClick = this.onCloseClick.bind(this);
			this.$tooltipClose.addEventListener(
				"click",
				this.$tooltipClose.boundClick,
				true
			);
		}
	}
	show() {
		this.isOpen = true;
		this.$toggle.setAttribute("aria-expanded", "true");
		this.$tooltip.setAttribute("aria-hidden", "false");
		document.addEventListener("click", this.$tooltip.boundClickOutside, true);
		document.addEventListener("keydown", this.$toggle.boundEscapeKeydown, true);
	}
	hide() {
		this.isOpen = false;
		this.$toggle.setAttribute("aria-expanded", "false");
		this.$tooltip.setAttribute("aria-hidden", "true");
		document.removeEventListener(
			"click",
			this.$tooltip.boundClickOutside,
			true
		);
		document.removeEventListener(
			"keydown",
			this.$toggle.boundEscapeKeydown,
			true
		);
	}
	onToggleClick() {
		if (this.isOpen) {
			this.hide();
			return;
		}
		this.show();
	}
	onCloseClick() {
		this.hide();
	}
	onClickOutside(e) {
		// If the click was outside of the current tooltip instance
		if (!this.$module.contains(e.target)) {
			this.hide();
		}
	}
	onEscapeKey(e) {
		const keyCode = e.which || e.keyCode;
		if (keyCode === Helpers.keyCodes.ESCAPE) {
			this.hide();
		}
	}
}
