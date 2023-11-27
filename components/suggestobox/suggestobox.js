import Helpers from "../../src/js/global/_helpers";

export default class Suggestobox {
	constructor($module) {
		this.$module = $module;
		this.options = this.parseSuggestionList();
		this.filteredOptions = [];
		this.activeIndex = -1;
		this.keyCodes = Helpers.keyCodes;
		// Parts
		this.$input = this.$module.querySelector(".bc-suggestobox__input");
		this.$listbox = this.$module.querySelector(".bc-suggestobox__listbox");
		this.$value = this.$module.querySelector('[type="hidden"]');
		this.$clear = this.$module.querySelector(".bc-suggestobox__clear");
		// Initialisation
		this.populateListbox();
		this.bindControls();
	}
	bindControls() {
		// Allow user to click anywhere outside of combobox to close listbox
		document.addEventListener("click", (e) => {
			if (e.target === this.$input || this.$module.contains(e.target)) {
				return;
			}
			this.closeListbox();
		});
		this.$input.addEventListener("keyup", (e) => {
			let key = e.which || e.keyCode;
			switch (key) {
				case this.keyCodes.UP:
				case this.keyCodes.DOWN:
				case this.keyCodes.ESCAPE:
				case this.keyCodes.RETURN:
					e.preventDefault();
					return;
				default:
					// Clear stored ID as the user has changed the input, we cannot assume what is now in the input is synonymous with the ID'd company
					this.$value.value = "";
					const query = this.$input.value;
					if (query.length) {
						this.populateListbox(query);
						this.openListbox();
					} else {
						this.closeListbox();
					}
					return;
			}
		});
		this.$input.addEventListener("keydown", (e) => {
			let key = e.which || e.keyCode;
			// If user presses escape key, clear their input
			if (key === this.keyCodes.ESCAPE) {
				this.closeListbox();
				setTimeout(() => {
					this.$input.value = "";
					this.$value.value = "";
				}, 1);
				return;
			}
			// If user presses up/down arrow, open listbox
			if (key === this.keyCodes.UP || key === this.keyCodes.DOWN) {
				this.openListbox();
			}
			switch (key) {
				case this.keyCodes.UP:
					if (this.activeIndex <= 0) {
						this.activeIndex = this.filteredOptions.length - 1;
					} else {
						this.activeIndex--;
					}
					this.highlightActiveIndex();
					return;
				case this.keyCodes.DOWN:
					if (
						this.activeIndex === -1 ||
						this.activeIndex >= this.filteredOptions.length - 1
					) {
						this.activeIndex = 0;
					} else {
						this.activeIndex++;
					}
					this.highlightActiveIndex();
					return;
				case this.keyCodes.RETURN:
					e.preventDefault();
					this.setValueByIndex(this.activeIndex);
					return;
				case this.keyCodes.TAB:
					// We cannot use the blur event to recognise if a keyboard
					// user has moved away from the input (as clicking an
					// option in the listbox would also cause blur to fire), so
					// we're tracking the user tabbing away instead. Not
					// bulletproof, but works well enough for W3C examples to do it.
					this.closeListbox();
					return;
			}
		});
		this.$input.addEventListener("focus", (e) => {
			const query = this.$input.value;
			if (query.length) {
				this.populateListbox(query);
				this.openListbox();
			} else {
				this.closeListbox();
			}
		});
		this.$clear.addEventListener("click", (e) => {
			this.setValue("");
		});
	}
	parseSuggestionList() {
		let options = JSON.parse(this.$module.querySelector("template").innerHTML);
		options.sort((a, b) => {
			return a.text.localeCompare(b.text);
		});
		return options;
	}
	populateListbox(filterString = false) {
		this.filteredOptions = this.options;
		// If a filter string is set, remove non-matching options from the array
		if (filterString) {
			this.filteredOptions = this.options.filter((item) => {
				return item.text.toLowerCase().includes(filterString.toLowerCase());
			});
		}
		// Remove all items
		this.$listbox.innerHTML = "";
		// If there are no results, back out now
		if (!this.filteredOptions.length) {
			// let li = document.createElement("li");
			// li.innerText = "No results found.";
			// li.classList.add("bc-suggestobox__listbox-item", "bc-suggestobox__listbox-item--no-results");
			// this.$listbox.appendChild(li);
			return;
		}
		// Add back remaining items
		this.filteredOptions.forEach((item, index) => {
			let li = document.createElement("li");
			li.innerText = item.text;
			li.classList.add("bc-suggestobox__listbox-item");
			li.addEventListener("click", (e) => {
				this.activeIndex = index;
				this.setValue(item.text, item.value);
				this.closeListbox();
			});
			this.$listbox.appendChild(li);
		});
	}
	openListbox() {
		this.$listbox.removeAttribute("hidden");
		this.$module.setAttribute("aria-expanded", "true");
	}
	closeListbox() {
		this.activeIndex = -1;
		this.$listbox.setAttribute("hidden", "hidden");
		this.$module.setAttribute("aria-expanded", "false");
	}
	setValue(text, value = false) {
		let currentInputValue = this.$input.value;
		this.$input.value = text;
		this.$input.setSelectionRange(currentInputValue.length, text.length);
		this.$value.value = value;
		value
			? this.$clear.classList.add("bc-suggestobox__clear--active")
			: this.$clear.classList.remove("bc-suggestobox__clear--active");
	}
	setValueByIndex(index) {
		if (index === -1) {
			return;
		}
		this.$listbox.children[index].click();
	}
	highlightActiveIndex() {
		const focusedClassName = "bc-suggestobox__listbox-item--focused";
		// Remove highlight class on existing elements
		const highlightedItems = this.$listbox.getElementsByClassName(
			focusedClassName
		);
		if (highlightedItems) {
			for (let item of highlightedItems) {
				item.classList.remove(focusedClassName);
			}
		}
		// Add to the element we want it on
		this.$listbox.children[this.activeIndex].classList.add(focusedClassName);
	}
}
