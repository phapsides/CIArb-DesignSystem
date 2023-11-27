// This component's JS is heavily based on that produced by the Government Digital Service.
// Hat tip to them and the GOV.UK team.
// https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/components/tabs/tabs.js


export default class Tab {
	constructor($module) {
		this.$module = $module;
		this.$tabs = $module.querySelectorAll(".bc-tab__tab");
		this.$tablist = $module.querySelector(".bc-tab__list");
		this.$tablistItems = $module.querySelectorAll(".bc-tab__item");
		this.panelHiddenClass = "bc-tab__panel--hidden";
		// If we're missing any part, exit now or things will break
		if (!this.$tabs || !this.$tablist || !this.$tablistItems) {
			return;
		}
		this.setup();
	}

	/**
	 * Initialisation methods
	 */

	setup() {
		// Setup a11y roles
		this.$tablist.setAttribute("role", "tablist");
		this.$tablistItems.forEach(($item) => {
			$item.setAttribute("role", "presentation");
		});
		// Tab functionality
		this.$tabs.forEach(($item) => {
			this.setAttributes($item);
			this.hideTab($item);
		});
		// Set active tab
		const $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
		this.showTab($activeTab);
		// Hashchange events
		this.$module.boundOnHashChange = this.onHashChange.bind(this);
		window.addEventListener("hashchange", this.$module.boundOnHashChange, true);
	}
	setAttributes($tab) {
		// Set default tab attributes
		const panelId = this.getHref($tab).slice(1);
		$tab.setAttribute("id", panelId + "-Tab");
		$tab.setAttribute("role", "tab");
		$tab.setAttribute("aria-controls", panelId);
		$tab.setAttribute("aria-selected", "false");
		$tab.setAttribute("tabindex", "-1");
		// Set default panel attributes
		const $panel = this.getPanel($tab);
		$panel.setAttribute("role", "tabpanel");
		$panel.setAttribute("aria-labelledby", $tab.id);
		$panel.classList.add(this.panelHiddenClass);
	}
	unsetAttributes($tab) {
		// Unset tab attributes
		$tab.removeAttribute("id");
		$tab.removeAttribute("role");
		$tab.removeAttribute("aria-controls");
		$tab.removeAttribute("aria-selected");
		$tab.removeAttribute("tabindex");
		// Unset panel attributes
		const $panel = this.getPanel($tab);
		$panel.removeAttribute("role");
		$panel.removeAttribute("aria-labelledby");
		$panel.classList.remove(this.panelHiddenClass);
	}

	/**
	 * Hash/history usage
	 */
	onHashChange(e) {
		const $hashTab = this.getTab(window.location.hash);
		if (!$hashTab) {
			return;
		}
		// Prevent changing hash
		if (this.changingHash) {
			this.changingHash = false;
			return;
		}
		// Set active tba according to URL hash
		const $previousTab = this.getCurrentTab();
		this.hideTab($previousTab);
		this.showTab($hashTab);
		$hashTab.focus();
	}
	createHistoryEntry($tab) {
		let $panel = this.getPanel($tab);
		// This code prevents the page from jumping to the new target hash.
		// 1. Saves the panel ID into memory.
		// 2. Remove the ID from the panel.
		// 3. Change the hash in the URL.
		// 4. Applies the ID from memory back to the panel.
		const id = $panel.id;
		$panel.id = "";
		this.changingHash = true;
		window.location.hash = this.getHref($tab).slice(1);
		$panel.id = id;
	}

	/**
	 * Tab methods
	 */
	getTab(hash) {
		return this.$module.querySelector(`.bc-tab__tab[href="${hash}"]`);
	}
	getCurrentTab() {
		return this.$module.querySelector(".bc-tab__item--current .bc-tab__tab");
	}
	hideTab($tab) {
		this.unhighlightTab($tab);
		this.hidePanel($tab);
	}
	showTab($tab) {
		this.highlightTab($tab);
		this.showPanel($tab);
	}
	unhighlightTab($tab) {
		$tab.setAttribute("aria-selected", "false");
		$tab.parentNode.classList.remove("bc-tab__item--current");
		$tab.setAttribute("tabindex", "-1");
	}
	highlightTab($tab) {
		$tab.setAttribute("aria-selected", "true");
		$tab.parentNode.classList.add("bc-tab__item--current");
		$tab.setAttribute("tabindex", "0");
	}
	activateNextTab() {
		const $currentTab = this.getCurrentTab();
		const $nextTablistItem = $currentTab.parentNode.nextElementSibling;
		let $nextTab;
		if ($nextTablistItem) {
			$nextTab = $nextTablistItem.querySelector(".bc-tab__tab");
		}
		if ($nextTab) {
			this.hideTab($currentTab);
			this.showTab($nextTab);
			$nextTab.focus();
			this.createHistoryEntry($nextTab);
		}
	}
	activatePreviousTab() {
		const $currentTab = this.getCurrentTab();
		const $previousTablistItem = $currentTab.parentNode.previousElementSibling;
		let $previousTab;
		if ($previousTablistItem) {
			$previousTab = $previousTablistItem.querySelector(".bc-tab__tab");
		}
		if ($previousTab) {
			this.hideTab($currentTab);
			this.showTab($previousTab);
			$previousTab.focus();
			this.createHistoryEntry($previousTab);
		}
	}

	/**
	 * Panel methods
	 */
	getPanel($tab) {
		return this.$module.querySelector(this.getHref($tab));
	}
	showPanel($tab) {
		const $panel = this.getPanel($tab);
		$panel.classList.remove(this.panelHiddenClass);
	}
	hidePanel($tab) {
		const $panel = this.getPanel($tab);
		$panel.classList.add(this.panelHiddenClass);
	}

	/**
	 * Mouse/keyboard handlers
	 */
	onTabClick(e) {
		if (!e.target.classList.contains("bc-tab__tab")) {
			return false;
		}
		e.preventDefault();
		const $newTab = e.target;
		const $currentTab = this.getCurrentTab();
		this.hideTab($currentTab);
		this.showTab($newTab);
		this.createHistoryEntry($newTab);
	}
	// onTabKeydown(e) {
	// 	switch (e.which || e.keyCode) {
	// 		case Helper.keyCodes().LEFT:
	// 		case Helper.keyCodes().UP:
	// 			this.activatePreviousTab();
	// 			e.preventDefault();
	// 			break;
	// 		case Helper.keyCodes().RIGHT:
	// 		case Helper.keyCodes().DOWN:
	// 			this.activateNextTab();
	// 			e.preventDefault();
	// 			break;
	// 	}
	// }

	/**
	 * Helpers
	 */
	getHref($tab) {
		const href = $tab.getAttribute("href");
		const hash = href.slice(href.indexOf("#"), href.length);
		return hash;
	}
}
