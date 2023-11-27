export default class Fetchify {
	constructor($module) {
		this.$module = $module;
		
        // window.cc_c2a = new clickToAddress({
		// 	accessToken: '75ce1-19d76-1449f-0810c',
		// 	domMode: 'id',
		// 	dom: {
		// 		search:		'address_search',
		// 		town:		'city',
		// 		postcode:	'postcode',
		// 		county:		'state',
		// 		country:	'country',
		// 		line_1:		'addr_line_1',
		// 		line_2:		'addr_line_2'
		// 	},
		// 	onResultSelected: function(object, dom, result){
		// 		var hidden_elements = document.getElementsByClassName('hidden');
		// 		while(hidden_elements.length > 0){
		// 			hidden_elements[0].className = 'bc-fetchify__address-inner';
		// 		}
		// 	},
        //     texts: {
        //         // Placeholder to be displayed in the search box
        //         default_placeholder: 'Start with post/zip code or street',
        //         // Placeholder to be displayed when searching for a country in search box
        //         country_placeholder: 'Type here to search for a country',
        //         // Object containing placeholders specific to a country
        //         placeholder_country_overrides: {
        //             usa: "Enter ZIP code",
        //             gbr: "Enter postcode"
        //         },
        //         // Object containing overrides for default country names
        //         country_name_overrides: {
        //             usa: "America",
        //             gbr: "Great Britain",
        //         },
        //         // Text to be displayed on button to change country in search interface
        //         country_button: 'Change Country',
        //         // Text to be displayed when an error occurs
        //         generic_error: 'An error occurred. Please enter your address manually',
        //         // Text to be displayed when no results are found
        //         no_results: 'No results found'

        //     }
		// });

        // window.cc_c2a.addPhoneVerify({
        //     phone: '#mobilePhone',
        //     country: '#countryCode',
        //     can_correct: false,
        //     allowed_type: 'all',
        //     ignore_nonnumeric_chars: false
        // });
        // window.cc_c2a.addPhoneVerify({
        //     phone: '#phone',
        //     country: '#countryCode-landline',
        //     can_correct: false,
        //     allowed_type: 'all',
        //     ignore_nonnumeric_chars: false
        // });
       
        
        // function manualToggle() {    
        //     const $trigger = document.querySelector('.bc-fetchify__manual-search-toggle');        
            
        //     $trigger.addEventListener("click", function(event) {
        //         const $container = document.querySelector('.bc-fetchify__address-inner');    
        //         const $fetchifySearch = document.querySelector('.bc-fetchify__search');    

        //         event.preventDefault();
        //         $container.classList.remove("hidden");
        //         $fetchifySearch.classList.add("hidden");
        //     });
        // }

        // window.addEventListener("DOMContentLoaded", () => {
		// 	manualToggle();
		// })
        
	}
}
