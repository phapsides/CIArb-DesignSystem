import Swiper from "swiper";
import Helpers from "../../src/js/global/_helpers";

export default class Carousel {
	constructor($module) {
		this.$module = $module;
		const id = Helpers.generateGuid();
		const slc = "bc-carousel__slider";
		this.$slider = $module.querySelector(`.${slc}`);
		this.$slider.setAttribute("id", id);
		const slider = this.$slider;
		const $hero = $module.classList.contains("bc-carousel--hero");
		let $breakpoints = {};
		if (!$hero) {
			$breakpoints = {
				768: {
					slidesPerView: 3,
					slidesPerGroup: 3,
					spaceBetween: 30
				},
				1024: {
					slidesPerView: 3,
					slidesPerGroup: 3,
					spaceBetween: 30
				},
			};
		}
		this.swiper = new Swiper(this.$slider, {
			initialSlide: $hero ? 0 : 0,
			slidesPerView: 1,
			slidesPerGroup: 1,
			// slidesOffsetBefore: 40,
			spaceBetween: 16,
			speed: 666,
			containerModifierClass: `${slc}--`,
			wrapperClass: `${slc}-wrapper`,
			slideClass: `${slc}-slide`,
			slideActiveClass: `${slc}-slide--active`,
			slideVisibleClass: `${slc}-slide--visible`,
			slideNextClass: `${slc}-slide--next`,
			slidePrevClass: `${slc}-slide--prev`,
			slideDuplicateClass: `${slc}-slide--duplicate`,
			slideDuplicateActiveClass: `${slc}-slide--duplicate-active`,
			slideDuplicateNextClass: `${slc}-slide--duplicate-next`,
			slideDuplicatePrevClass: `${slc}-slide--duplicate-prev`,
			navigation: {
				nextEl: `.${slc}-control--next`,
				prevEl: `.${slc}-control--prev`,
				disabledClass: `${slc}-control--disabled`,
				hiddenClass: `${slc}-control--hidden`,
			},
			pagination: {
				el: ".bc-carousel__pagination",
				type: "bullets",
				clickable: true,
			},
			breakpoints: $breakpoints,
			// a11y: {
			// 	enabled: true,
			// 	notificationClass: `${slc}-status`
			// }
		})
			.on("imagesReady", function () {
				setSlideOpacity();
			})
			.on("slideChangeTransitionStart", function () {
				setSlideOpacity();
			})
			.on("resize", function () {
				setSlideOpacity();
			});
		function setSlideOpacity() {
			if (!$hero) {
				let $s = slider.getElementsByClassName(
					"bc-carousel__slider-slide--next"
				)[0].nextElementSibling;
				$s.classList.add("bc-carousel__slider-slide--next");
			}
		}
	}
}
