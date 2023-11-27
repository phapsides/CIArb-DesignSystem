export default class Filters {
	constructor($module) {
		this.$module = $module;

		const filterBody = document.getElementById("filters");
		const filterHeader = document.getElementById("filters-title");

		filterHeader.addEventListener("click", toggleFilters);

		function toggleFilters() {
			if (
				parseInt(window.innerWidth || document.documentElement.clientWidth) <
				1024
			) {
				filterBody.classList.toggle("active");
			}
		}

		if (
			parseInt(window.innerWidth || document.documentElement.clientWidth) > 1024
		) {
			filterBody.classList.toggle("active");
		}

		// Fixed Resize Screen Function
		window.addEventListener("resize", () => {
			if (!filterBody.classList.contains("active")) {
				toggleFilters();
			}
		});
	}
}
