!(function () {
	function getCookie(name) {
		const needle = name + "=";
		const parts = document.cookie.split(";");

		for (let i = 0; i < parts.length; i++) {
			let item = parts[i];
			while (item.charAt(0) === " ") {
				item = item.substring(1, item.length);
			}
			if (item.indexOf(needle) === 0) {
				return item.substring(needle.length, item.length);
			}
		}

		return null;
	}

	function getQueryParam(name) {
		let value;
		location.search
			.substr(1)
			.split("&")
			.some(function (part) {
				const bits = part.split("=");
				if (bits[0] === name) {
					value = bits[1];
					return true;
				}
				return false;
			});

		return value;
	}

	function setCookie(name, value, days) {
		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	function resolveTheme() {
		const cookieTheme = getCookie("theme");
		const queryTheme = getQueryParam("theme");

		if (queryTheme) {
			setCookie("theme", queryTheme, 7);
			return queryTheme;
		}

		return cookieTheme || "modern";
	}

	function ensureStylesheet(href) {
		const existing = document.querySelector('link[rel="stylesheet"][href="' + href + '"]');
		if (existing) {
			return existing;
		}

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = href;
		document.head.appendChild(link);
		return link;
	}

	document.addEventListener("DOMContentLoaded", function () {
		const themeHref = "/css/" + resolveTheme() + ".css";

		// Theme can change dynamically, but custom overrides must stay last.
		ensureStylesheet(themeHref);
		// ensureStylesheet("/css/custom.css");
	});
})();
//# sourceMappingURL=settings.js.map