export default class Helpers {
	// Generate a GUID. Matches the RFC, but no real guarantee of uniqueness.
	static generateGuid() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
			c
		) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
	static keyCodes = {
		TAB: 9,
		RETURN: 13,
		ESCAPE: 27,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
	};
}
