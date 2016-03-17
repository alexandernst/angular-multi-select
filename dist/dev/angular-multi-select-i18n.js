'use strict';

var angular_multi_select = angular.module('angular-multi-select');

angular_multi_select.provider('angularMultiSelectI18n', function () {
	var lang = "en";
	var langs = {
		'en': {
			CHECK_ALL: 'Check all',
			CHECK_NONE: 'Uncheck all',
			RESET: 'Reset',
			SEARCH: 'Search...',
			CLEAR: 'Clear'
		}
	};

	function getTranslation(lang) {
		return langs[lang];
	}

	function createTranslation(lang, texts) {
		langs[lang] = texts;
	}

	function setLang(newLang) {
		lang = newLang;
	}

	function instantiate$18n() {
		function translate(text) {
			return langs[lang][text] || langs.en[text];
		}

		return {
			translate: translate
		};
	}

	return {
		getTranslation: getTranslation,
		createTranslation: createTranslation,
		setLang: setLang,

		$get: instantiate$18n
	};
});
