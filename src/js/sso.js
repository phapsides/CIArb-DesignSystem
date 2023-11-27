/**
 * This code is specific to Azure B2C SSO.
 * It isn't used anywhere else on the bc site or design system.
 *
 * WARNING: test that it all works as expected when implemented
 *
 */

// insertPasswordCriteria();
setAutocompletePlaceholders();
moveForgetPassword();

/**
 * Move forget password link under input field
 */
function moveForgetPassword() {
	let elem = document.getElementById("forgotPassword");
	if (elem != null) {
		let target = document.getElementById("password");
		target.after(elem);
	}
}

/**
 * Insert hardcoded password criteria.
 */

// function insertPasswordCriteria() {
// 	var insertedContent = `
// 	 <li class="Prose" id="PasswordCriteria">
// 			<dl class="bc-list--dashed">
// 				<dt>Passwords must meet these criteria:</dt>
// 				<dd>Minimum 8 characters long </dd>
// 				<dd>Include at least 1 uppercase letter</dd>
// 				<dd>Include at least 1 number</dd>
// 				<dd>Include at least 1 special character</dd>
// 			</dl>
// 	 </li>
// 	 `;
// 	jQuery("#newPassword").closest(".Password").before(insertedContent);
// 	jQuery("#newPassword").attr("aria-describedby", "PasswordCriteria");
// 	jQuery("#reenterPassword").attr("aria-describedby", "PasswordCriteria");
// }

/**
 * Set `autocomplete` attributes on inputs.
 * This helps browsers and password managers know how to pre-fill emails,
 * passwords, etc. They have a tendency to trip over Azure B2C without it.
 */

function setAutocompletePlaceholders() {
	if (document.getElementById("signInName")) {
		var inp = document.getElementById("signInName");
		inp.setAttribute("autocomplete", "email");
		inp.setAttribute("placeholder", "");
	}

	if (document.getElementById("email")) {
		var inp = document.getElementById("email");
		inp.setAttribute("autocomplete", "email");
		inp.setAttribute("placeholder", "");
	}

	if (document.getElementById("email_ver_input")) {
		var inp = document.getElementById("email_ver_input");
		inp.setAttribute("autocomplete", "one-time-code");
		inp.setAttribute("placeholder", "");
	}

	if (document.getElementById("newPassword")) {
		var inp = document.getElementById("newPassword");
		inp.setAttribute("autocomplete", "new-password");
		inp.setAttribute("placeholder", "");
	}

	if (document.getElementById("reenterPassword")) {
		var inp = document.getElementById("reenterPassword");
		inp.setAttribute("autocomplete", "new-password");
		inp.setAttribute("placeholder", "");
	}

	if (document.getElementById("givenName")) {
		var inp = document.getElementById("givenName");
		inp.setAttribute("autocomplete", "given-name");
		inp.setAttribute("placeholder", "");
	}

	if (document.getElementById("surname")) {
		var inp = document.getElementById("surname");
		inp.setAttribute("autocomplete", "family-name");
		inp.setAttribute("placeholder", "");
	}
}
