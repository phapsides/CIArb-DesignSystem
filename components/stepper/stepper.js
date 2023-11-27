export default class Stepper {
	constructor($module) {
		this.$module = $module;
		this.$input = $module.querySelector(".bc-stepper__input");
		this.id = this.$input.id;

		this.value = Number(this.$input.value) || 0;
		this.minValue = Number(this.$input.min) || 0;
		this.maxValue = Number(this.$input.max) || null;

		this.$minusButton = this.createButton(false);
		this.$plusButton = this.createButton(true);

		this.$module.appendChild(this.$minusButton);
		this.$module.appendChild(this.$plusButton);
		this.setValue(this.value);

		this.$input.bindInput = this.onInput.bind(this);
		this.$input.addEventListener("input", this.$input.bindInput);
	}
	createButton(isPlus = false) {
		let innerText = "-";
		let classModifier = "minus";
		let accessibleLabel = "Remove 1";
		if (isPlus) {
			innerText = "+";
			classModifier = "plus";
			accessibleLabel = "Add 1";
		}
		const $button = document.createElement("button");
		$button.type = "button";
		$button.className = `bc-stepper__button bc-stepper__button--${classModifier}`;
		$button.innerHTML = `<span aria-hidden="true">${innerText}</span> <span class="fs-!-sr">${accessibleLabel}</span>`;
		$button.id = `${this.id}-${classModifier}`;
		$button.setAttribute("aria-controls", this.id);
		$button.addEventListener("click", () => {
			this.setValue(isPlus ? this.value + 1 : this.value - 1);
		});
		return $button;
	}
	onInput(e) {
		this.setValue(this.$input.value);
	}
	setValue(newValue) {
		const $minusButton = this.$module.querySelector(
			".bc-stepper__button--minus"
		);
		const $plusButton = this.$module.querySelector(".bc-stepper__button--plus");
		let setValue = newValue;

		$minusButton.disabled = false;
		$plusButton.disabled = false;

		if (newValue <= this.minValue) {
			setValue = this.minValue;
			$minusButton.disabled = true;
		}
		if (this.maxValue && newValue >= this.maxValue) {
			setValue = this.maxValue;
			$plusButton.disabled = true;
		}
		this.value = setValue;
		this.$input.value = this.value;
	}
}
