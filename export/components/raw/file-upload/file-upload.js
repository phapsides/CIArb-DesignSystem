import Helpers from "../../src/js/global/_helpers";

export default class FileUpload {
	constructor($module) {
		this.$module = $module;
		this.$input = $module.querySelector('input[type="file"]');
		this.$fileList = $module.querySelector(".bc-file-upload__list");
		// Don't run if there's no input
		if (!this.$input) {
			return;
		}
		// Don't run this again if already ran
		if ($module.classList.contains("is-enhanced")) {
			return;
		}
		// Add classes/IDs
		$module.classList.add("is-enhanced");
		const id = Helpers.generateGuid();
		const inputId = this.$input.id || `FileUpload-${id}`;
		const fileListId = this.$fileList.id || `FileUpload-${id}-FileList`;
		this.$input.id = inputId;
		this.$fileList.id = fileListId;
		// A11y setup
		this.$fileList.setAttribute("role", "region");
		this.$fileList.setAttribute("aria-live", "polite");
		this.$fileList.setAttribute("aria-atomic", "true");
		this.$fileList.setAttribute("aria-relevant", "additions removals");
		this.$fileList.setAttribute("aria-controlledby", inputId);
		this.$input.setAttribute("aria-controls", fileListId);
		// Do stuff
		this.setup();
	}
	setup() {
		this.$input.bindChange = this.onChange.bind(this);
		this.$input.bindDragOver = this.onDragOver.bind(this);
		this.$input.bindDragOut = this.onDragOut.bind(this);
		this.$input.addEventListener("change", this.$input.bindChange);
		this.$input.addEventListener("dragenter", this.$input.bindDragOver);
		this.$input.addEventListener("dragleave", this.$input.bindDragOut);
		this.$input.addEventListener("drop", this.$input.bindDragOut);
	}
	onChange(e) {
		this.clearList();
		const files = [...e.target.files];
		files.forEach((file) => {
			this.addListItem(file.name, file.size);
		});
	}
	onDragOver(e) {
		// Called for all events where dragging can be said to be active
		this.$module.classList.add("is-over");
	}
	onDragOut(e) {
		// Called for all events where dragging can be said to be inactive
		this.$module.classList.remove("is-over");
	}
	clearList() {
		this.$fileList.textContent = "";
	}
	addListItem(filename, filesize) {
		// Containing <div>
		const $div = document.createElement("div");
		$div.classList = "bc-file-upload__list-item";
		// Filename
		const $filename = document.createElement("dt");
		$filename.classList = "bc-heading--subtitle bc-file-upload__filename";
		$filename.innerText = filename;
		$div.appendChild($filename);
		// File size
		const $filesize = document.createElement("dd");
		$filesize.classList = "bc-file-upload__size";
		$filesize.innerText = this.formatFileSize(filesize);
		$div.appendChild($filesize);
		// Append to file list
		this.$fileList.appendChild($div);
	}
	formatFileSize(sizeInBytes) {
		let size = sizeInBytes;
		let suffix = "B";
		if (sizeInBytes >= 1000000000) {
			size = parseFloat(sizeInBytes / 1000000000).toFixed(3);
			suffix = "GB";
		} else if (sizeInBytes >= 1000000) {
			size = parseFloat(sizeInBytes / 1000000).toFixed(2);
			suffix = "MB";
		} else if (sizeInBytes >= 1000) {
			size = parseFloat(sizeInBytes / 1000).toFixed(1);
			suffix = "KB";
		}
		return `${size} ${suffix}`;
	}
}
