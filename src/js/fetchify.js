/*!
 * Fetchify JavaScript Library
 *
 * @author      ClearCourse Business Services Ltd t/a Fetchify
 * @link        https://fetchify.com
 * @copyright   Copyright (c) 2021, ClearCourse Business Services Ltd
 * @version     1.10.0
 */
clickToAddress.prototype.search = function (searchText, id, sequence) {
  "use strict";
  var that = this;
  if (searchText.trim() === "") {
    return;
  }
  this.setProgressBar(0);
  var parameters = {
    key: this.key,
    query: searchText,
    id: id,
    country: this.activeCountry,
    fingerprint: this.fingerprint,
    integration: this.tag,
    js_version: this.jsVersion,
    sequence: sequence,
    type: 0,
  };
  if (sequence == -1) {
    parameters.type = 2;
  }
  if (typeof this.accessTokenOverride[this.activeCountry] != "undefined") {
    parameters.key = this.accessTokenOverride[this.activeCountry];
  }
  if (this.coords != {}) {
    parameters.coords = {};
    parameters.coords.lat = this.coords.latitude;
    parameters.coords.lng = this.coords.longitude;
  }
  if (typeof this.getCfg("beforeFind") === "function") {
    try {
      this.getCfg("beforeFind")(this, this.activeDom, parameters);
    } catch (e) {
      this.error("JS507");
    }
  }
  try {
    var data = this.cacheRetrieve(parameters);
    that.setProgressBar(1);
    that.clear();
    that.hideErrors();
    that.searchResults = data;
    that.showResults();
    if (!that.focused) {
      that.activeInput.focus();
    }
    that.searchStatus.lastResponseId = sequence || 0;
    that.cacheStore(parameters, data, sequence);
    return;
  } catch (err) {
    if (["cc/cr/01", "cc/cr/02"].indexOf(err) == -1) {
      throw err;
    }
  }
  var url = this.baseURL + "find";
  this.apiRequest("find", parameters, function (data) {
    if (that.searchStatus.lastResponseId <= sequence) {
      that.setProgressBar(1);
      that.clear();
      that.hideErrors();
      that.searchResults = data;
      that.showResults();
      if (!that.focused) {
        that.activeInput.focus();
      }
      that.searchStatus.lastResponseId = sequence || 0;
      that.cacheStore(parameters, data, sequence);
    }
  });
};
clickToAddress.prototype.getAddressDetails = function (id) {
  "use strict";
  var that = this;
  if (that.lookup_in_progress) {
    return;
  }
  that.lookup_in_progress = true;
  var parameters = {
    id: id,
    country: this.activeCountry,
    key: this.key,
    fingerprint: this.fingerprint,
    js_version: this.jsVersion,
    integration: this.tag,
    type: 1,
  };
  if (typeof this.accessTokenOverride[this.activeCountry] != "undefined") {
    parameters.key = this.accessTokenOverride[this.activeCountry];
  }
  if (this.coords != {}) {
    parameters.coords = this.coords;
  }
  try {
    var data = this.cacheRetrieve(parameters);
    that.fillData(data.result);
    that.hideErrors();
    that.cleanHistory();
    that.cacheStore(parameters, data);
    that.lookup_in_progress = false;
    return;
  } catch (err) {
    if (["cc/cr/01", "cc/cr/02"].indexOf(err) == -1) {
      that.lookup_in_progress = false;
      throw err;
    }
  }
  var url = this.baseURL + "retrieve";
  this.apiRequest("retrieve", parameters, function (data) {
    try {
      that.fillData(data.result);
      that.hideErrors();
      that.cleanHistory();
      that.cacheStore(parameters, data);
      that.lookup_in_progress = false;
    } catch (e) {
      that.lookup_in_progress = false;
      that.error("JS503", e);
    }
  });
};
clickToAddress.prototype.getAvailableCountries = function (success_function) {
  "use strict";
  var that = this;
  var parameters = {
    key: this.key,
    fingerprint: this.fingerprint,
    js_version: this.jsVersion,
    integration: this.tag,
    language: this.countryLanguage,
  };
  this.apiRequest("countries", parameters, function (data) {
    try {
      that.serviceReady = 1;
      that.validCountries = data.countries;
      that.ipLocation = data.ip_location;
      that.hideErrors();
      try {
        success_function();
      } catch (e) {
        that.error("JS515", e);
      }
    } catch (e) {
      that.error("JS505", e);
    }
  });
};
clickToAddress.prototype.phoneValidateCall = function (
  phone_number,
  country_code,
  get_network_information,
  success_function
) {
  "use strict";
  var that = this;
  var parameters = {
    key: this.key,
    phone_number: phone_number,
    get_network: get_network_information,
  };
  if (country_code != null) {
    parameters.country = country_code;
  }
  var cachedResult = this.getValidateResultFromCache(
    "phoneValidateCache",
    JSON.stringify(parameters)
  );
  if (cachedResult !== null) {
    success_function(cachedResult);
    return;
  }
  this.apiRequest2("phone/1.0/validate", parameters, function (data) {
    try {
      that.addValidateResultToCache(
        "phoneValidateCache",
        JSON.stringify(parameters),
        data
      );
      success_function(data);
    } catch (e) {
      that.error("JS516", e);
    }
  });
};
clickToAddress.prototype.emailValidateCall = function (
  email_address,
  success_function
) {
  "use strict";
  var that = this;
  var parameters = { key: this.key, email: email_address };
  var cachedResult = this.getValidateResultFromCache(
    "emailValidateCache",
    JSON.stringify(parameters)
  );
  if (cachedResult !== null) {
    success_function(cachedResult);
    return;
  }
  this.apiRequest2("email/1.0/validate", parameters, function (data) {
    try {
      that.addValidateResultToCache(
        "emailCache",
        JSON.stringify(parameters),
        data
      );
      success_function(data);
    } catch (e) {
      that.error("JS517", e);
    }
  });
};
clickToAddress.prototype.bankValidateCall = function (
  sort_code,
  account_number,
  success_function
) {
  "use strict";
  var that = this;
  var parameters = { key: this.key, sortCode: sort_code };
  if (account_number !== "") {
    parameters["accountNumber"] = account_number;
  }
  var cachedResult = this.getValidateResultFromCache(
    "bankValidateCache",
    JSON.stringify(parameters)
  );
  if (cachedResult !== null) {
    success_function(cachedResult);
    return;
  }
  this.apiRequest2("bank/1.1/validate", parameters, function (data) {
    try {
      that.addValidateResultToCache(
        "bankValidateCache",
        JSON.stringify(parameters),
        data
      );
      success_function(data);
    } catch (e) {
      that.error("JS518", e);
    }
  });
};
clickToAddress.prototype.handleApiError = function (ajax) {
  "use strict";
  if ([401, 402].indexOf(ajax.status) != -1) {
    this.serviceReady = -1;
    this.error("API401");
    return;
  }
  var data = {};
  try {
    data = JSON.parse(ajax.responseText);
  } catch (e) {
    data = {};
  }
  if (
    typeof data.error != "undefined" &&
    typeof data.error.status == "string"
  ) {
    this.error(
      "API500",
      "API error: [" + data.error.status + "]" + data.error.message
    );
  } else {
    this.error("API500");
  }
};
clickToAddress.prototype.apiRequest = function (action, parameters, callback) {
  var url = this.baseURL + action;
  var keys = Object.keys(this.customParameters);
  for (var i = 0; i < keys.length; i++) {
    parameters[keys[i]] = this.customParameters[keys[i]];
  }
  if (
    action === "find" &&
    (this.excludeAreas.length > 0 || this.excludePoBox)
  ) {
    if (typeof parameters["extra"] === "undefined") {
      parameters["extra"] = {};
    }
    if (this.excludeAreas.length > 0) {
      parameters["extra"]["exclude_areas"] = this.excludeAreas;
    }
    if (this.excludePoBox) {
      parameters["extra"]["exclude_pobox"] = this.excludePoBox;
    }
  }
  if (action === "retrieve" && this.useCeremonialCounties) {
    if (typeof parameters["extra"] === "undefined") {
      parameters["extra"] = {};
    }
    parameters["extra"]["gbr_ceremonial_counties"] = true;
  }
  if (typeof this.getCfg("requestFunction") === "function") {
    try {
      if (
        this.getCfg("requestFunction")(
          this,
          this.activeDom,
          action,
          parameters,
          callback
        )
      ) {
        return;
      }
    } catch (e) {
      this.error("JS512");
    }
  }
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");
  var that = this;
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status == 401) {
        that.error("API401");
        return;
      }
      if (this.status >= 200 && this.status < 400) {
        try {
          var data = JSON.parse(this.responseText);
          callback(data);
        } catch (e) {
          that.error("JS506", e);
        }
      } else {
        that.handleApiError(this);
      }
    }
  };
  request.send(JSON.stringify(parameters));
  var xmlHttpTimeout = setTimeout(function () {
    if (request !== null && request.readyState !== 4) {
      request.abort();
      that.error("JS501");
    }
  }, 1e4);
  request = null;
};
clickToAddress.prototype.apiRequest2 = function (action, parameters, callback) {
  var url = "https://api.craftyclicks.co.uk/" + action;
  var keys = Object.keys(this.customParameters);
  for (var i = 0; i < keys.length; i++) {
    parameters[keys[i]] = this.customParameters[keys[i]];
  }
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");
  var that = this;
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status == 401) {
        return;
      }
      if (this.status >= 200 && this.status < 400) {
        try {
          var data = JSON.parse(this.responseText);
          callback(data);
        } catch (e) {
          that.error("JS506", e);
        }
      } else {
        that.handleApiError(this);
      }
    }
  };
  request.send(JSON.stringify(parameters));
  var xmlHttpTimeout = setTimeout(function () {
    if (request !== null && request.readyState !== 4) {
      request.abort();
      that.error("JS501");
      callback("error");
    }
  }, 2e3);
  request = null;
};
clickToAddress.prototype.cacheRetrieve = function (search) {
  "use strict";
  if (search.type == 0 || search.type == 2) {
    if (typeof this.cache.finds[search.country] == "undefined") {
      throw "cc/cr/01";
    }
    for (var i = 0; i < this.cache.finds[search.country].length; i++) {
      if (
        this.cache.finds[search.country][i].query == search.query &&
        this.cache.finds[search.country][i].id == search.id
      ) {
        return this.cache.finds[search.country][i].response;
      }
    }
    throw "cc/cr/02";
  }
  if (search.type == 1) {
    if (typeof this.cache.retrieves[search.country] == "undefined") {
      throw "cc/cr/01";
    }
    for (var i = 0; i < this.cache.retrieves[search.country].length; i++) {
      if (this.cache.retrieves[search.country][i].id == search.id) {
        return this.cache.retrieves[search.country][i].response;
      }
    }
    throw "cc/cr/02";
  }
  throw "cc/cr/03";
};
clickToAddress.prototype.cacheStore = function (search, obj, sequence) {
  "use strict";
  var sequence = sequence || 0;
  if (search.type === 0) {
    if (typeof this.cache.finds[search.country] == "undefined") {
      this.cache.finds[search.country] = [];
    }
    var splice_pos = Math.abs(
      this.tools.binaryIndexOf(this.cache.finds[search.country], sequence)
    );
    this.cache.finds[search.country].splice(splice_pos, 0, {
      query: search.query,
      id: search.id,
      response: obj,
      sequence: sequence,
    });
    if (this.cache.finds[search.country].length > 100) {
      this.cache.finds[search.country].shift();
    }
    this.setHistoryStep();
    return;
  }
  if (search.type == 1) {
    if (typeof this.cache.retrieves[search.country] == "undefined") {
      this.cache.retrieves[search.country] = [];
    }
    for (var i = 0; i < this.cache.retrieves[search.country].length; i++) {
      if (this.cache.retrieves[search.country][i].id == search.id) {
        return;
      }
    }
    this.cache.retrieves[search.country].push({ id: search.id, response: obj });
    return;
  }
  if (search.type == 2) {
    return;
  }
};
clickToAddress.prototype.history = function (dir) {
  "use strict";
  if (!this.historyTools) return;
  if (this.cachePos <= -1) {
    this.cachePos = 0;
  }
  var searchParams = {};
  var cacheLength =
    Object.keys(this.cache.finds[this.activeCountry]).length - 1;
  if (dir === 0) {
    this.cachePos++;
    searchParams =
      this.cache.finds[this.activeCountry][cacheLength - this.cachePos];
  } else {
    this.cachePos--;
    searchParams =
      this.cache.finds[this.activeCountry][cacheLength - this.cachePos];
  }
  this.setHistoryStep();
  this.activeInput.value = searchParams.query;
  this.search(searchParams.query, searchParams.id, -1);
};
clickToAddress.prototype.setHistoryActions = function () {
  "use strict";
  if (!this.historyTools) return;
  var that = this;
  var backBtn = this.searchObj.getElementsByClassName("cc-back")[0];
  var forwardBtn = this.searchObj.getElementsByClassName("cc-forward")[0];
  this.tools.ccEvent(backBtn, "click", function () {
    if (backBtn.className == "cc-back") {
      that.history(0);
    }
  });
  this.tools.ccEvent(forwardBtn, "click", function () {
    if (forwardBtn.className == "cc-forward") {
      that.history(1);
    }
  });
};
clickToAddress.prototype.setHistoryStep = function () {
  "use strict";
  if (!this.historyTools) return;
  var backBtn = this.searchObj.getElementsByClassName("cc-back")[0];
  var forwardBtn = this.searchObj.getElementsByClassName("cc-forward")[0];
  var elemWidth =
    this.activeInput != "init"
      ? this.activeInput.getBoundingClientRect().width
      : 0;
  backBtn.className = "cc-back";
  forwardBtn.className = "cc-forward";
  var logo_visible = 0;
  if (
    typeof this.cache.finds[this.activeCountry] == "undefined" ||
    this.cachePos >=
      Object.keys(this.cache.finds[this.activeCountry]).length - 1 ||
    Object.keys(this.cache.finds[this.activeCountry]).length <= 1
  ) {
    backBtn.className = "cc-back cc-disabled";
    logo_visible++;
  }
  if (
    typeof this.cache.finds[this.activeCountry] == "undefined" ||
    this.cachePos <= 0 ||
    Object.keys(this.cache.finds[this.activeCountry]).length <= 1
  ) {
    forwardBtn.className = "cc-forward cc-disabled";
    logo_visible++;
  }
  var logo = this.searchObj.getElementsByClassName("c2a_logo");
  if (logo.length) {
    if (logo_visible == 2 && elemWidth >= this.minFieldWidthLogo) {
      this.tools.removeClass(logo[0], "hidden");
      this.tools.removeClass(logo[0], "tools_in_use");
    } else {
      this.tools.addClass(logo[0], "hidden");
      this.tools.addClass(logo[0], "tools_in_use");
    }
  }
};
clickToAddress.prototype.hideHistory = function () {
  "use strict";
  if (!this.historyTools) return;
  var backBtn = this.searchObj.getElementsByClassName("cc-back")[0];
  var forwardBtn = this.searchObj.getElementsByClassName("cc-forward")[0];
  backBtn.className = "cc-back cc-disabled";
  forwardBtn.className = "cc-forward cc-disabled";
};
clickToAddress.prototype.cleanHistory = function () {
  "use strict";
  if (
    this.cachePos <= 0 ||
    typeof this.cache.finds[this.activeCountry] == "undefined"
  ) {
    return;
  }
  var removeAt =
    Object.keys(this.cache.finds[this.activeCountry]).length - this.cachePos;
  this.cache.finds[this.activeCountry].splice(removeAt, this.cachePos);
  this.cachePos = -1;
  var keys_length = Object.keys(this.cache.finds[this.activeCountry]).length;
  if (keys_length > 0) {
    this.activeId = this.cache.finds[this.activeCountry][keys_length - 1].id;
  } else {
    this.activeId = "";
  }
  this.setHistoryStep();
};
clickToAddress.prototype.getValidateResultFromCache = function (
  sessionStorageKey,
  cacheKey
) {
  var stringifiedCache = window.sessionStorage.getItem(sessionStorageKey);
  if (stringifiedCache !== null) {
    var cache = JSON.parse(stringifiedCache);
    if (cache[cacheKey] !== undefined) {
      return cache[cacheKey];
    }
  }
  return null;
};
clickToAddress.prototype.addValidateResultToCache = function (
  sessionStorageKey,
  cacheKey,
  value
) {
  var stringifiedCache = window.sessionStorage.getItem(sessionStorageKey);
  var cache = {};
  if (stringifiedCache !== null) {
    cache = JSON.parse(stringifiedCache);
  }
  cache[cacheKey] = value;
  window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(cache));
};
clickToAddress.prototype.error = function (code, message) {
  "use strict";
  var errors = {
    JS500: { default_message: "Unknown Server Error", level: 0 },
    JS501: { default_message: "API server seems unreachable", level: 0 },
    JS502: {
      default_message: "API search request resulted in a JS error.",
      level: 0,
    },
    JS503: {
      default_message: "API address retrieve request resulted in a JS error.",
      level: 0,
    },
    JS504: {
      default_message:
        "onResultSelected callback function resulted in a JS error.",
      level: 0,
    },
    JS505: {
      default_message:
        "API countrylist retrieve request resulted in a JS error.",
      level: 0,
    },
    JS506: { default_message: "JSON parsing error", level: 0 },
    JS507: {
      default_message: "beforeFind callback function resulted in a JS error.",
      level: 0,
    },
    JS508: {
      default_message:
        "beforePopulate callback function resulted in a JS error.",
      level: 0,
    },
    JS509: {
      default_message:
        "beforeCorrect callback function resulted in a JS error.",
      level: 0,
    },
    JS510: {
      default_message:
        "afterPopulate callback function resulted in a JS error.",
      level: 0,
    },
    JS511: {
      default_message: "onResult callback function resulted in a JS error.",
      level: 0,
    },
    JS512: {
      default_message:
        "requestFunction callback function resulted in a JS error.",
      level: 0,
    },
    JS515: {
      default_message:
        "Country list retrieve callback function resulted in an error.",
      level: 0,
    },
    JS516: {
      default_message:
        "Phone validation callback function resulted in an error.",
      level: 0,
    },
    JS517: {
      default_message:
        "Email validation callback function resulted in an error.",
      level: 0,
    },
    JS518: {
      default_message:
        "Bank validation callback function resulted in an error.",
      level: 0,
    },
    JS401: {
      default_message: 'Invalid value for countryMatchWith. Fallback to "text"',
      level: 0,
    },
    API401: {
      default_message:
        "Please review your account; access token restricted from accessing the service.",
      level: 1,
    },
    API500: { default_message: "API error occured", level: 1 },
  };
  console.warn("CraftyClicks Debug Error Message");
  var c = "[" + code + "]";
  if (typeof message == "undefined" || !this.debug) {
    if (typeof errors[code] !== "undefined") {
      console.warn(c + errors[code].default_message);
    } else {
      console.warn(c);
    }
  } else {
    if (typeof message.stack != "undefined") {
      console.warn(c + message.stack);
    } else {
      console.warn(c + message);
    }
  }
  if (errors[code].level == 1) {
    this.info("error");
  }
  if (typeof this.onError == "function") {
    this.onError(code, message);
  }
};
clickToAddress.prototype.hideErrors = function () {
  "use strict";
  if (this.serviceReady != -1) {
    this.errorObj.innerHTML = "";
    this.errorObj.className = "c2a_error c2a_error_hidden";
  }
};
clickToAddress.prototype.start_debug = function () {
  "use strict";
  var that = this;
  var css = document.createElement("style");
  css.type = "text/css";
  var styles =
    "#cc_c2a_debug { " +
    [
      "position: fixed;",
      "right: 0px;",
      "background-color: white;",
      "top: 50px;",
      "border: 1px solid black;",
      "border-top-left-radius: 5px;",
      "border-bottom-left-radius: 5px;",
      "padding: 5px;",
      "text-align: center;",
      "border-right: none;",
    ].join(" ") +
    " }";
  styles +=
    " #cc_c2a_debug > div{" +
    [
      "border-radius: 5px;",
      "padding: 5px;",
      "border: 1px solid black;",
      "margin-bottom: 5px;",
    ].join(" ") +
    "}";
  styles +=
    " #cc_c2a_debug .c2a_toggle.c2a_toggle_on{ background-color: #87D37C; color: white; }";
  styles += " #cc_c2a_debug .c2a_toggle{ cursor: pointer; }";
  this.tools.__$styleInject(styles);
  var cc_debug = document.createElement("DIV");
  cc_debug.id = "cc_c2a_debug";
  var html = [
    '<div><img style="width: 40px;" src="https://craftyclicks.co.uk/wp-content/themes/craftyclicks_wp_theme/assets/images/product/prod_gl.png"/></div>',
    '<div id="toggl_transl" class="c2a_toggle">Toggle Transl</div>',
  ].join("");
  cc_debug.innerHTML = html;
  document.body.appendChild(cc_debug);
  var btn1 = document.getElementById("toggl_transl");
  this.tools.ccEvent(btn1, "click", function () {
    that.transliterate = !that.transliterate;
    if (that.transliterate) {
      btn1.className = "c2a_toggle c2a_toggle_on";
      that.addTransl();
    } else {
      btn1.className = "c2a_toggle";
    }
  });
};
clickToAddress.prototype.info = function (state, count) {
  "use strict";
  var infoBar = this.searchObj.getElementsByClassName("infoBar")[0];
  switch (state) {
    case "pre-trial":
      infoBar.className += " infoActive infoTrial";
      infoBar.innerHTML =
        '<h5>Access token is needed!</h5><p>To get a trial token, sign up for a <a href="https://account.craftyclicks.co.uk/login/signup">free trial</a>.</p><p>Then find the placeholder accessToken xxxxx-xxxxx-xxxxx-xxxxx in your HTML and replace it with a your own token.</p>';
      break;
    case "no-results":
      infoBar.className += " infoActive infoWarning";
      infoBar.innerHTML = this.texts.no_results;
      break;
    case "error":
      infoBar.className += " infoActive infoWarning";
      infoBar.innerHTML = this.texts.generic_error;
      break;
    default:
      infoBar.className = "infoBar";
      infoBar.innerHTML = "";
      break;
  }
};
clickToAddress.prototype.setFingerPrint = function () {
  "use strict";
  var low = 1e15;
  var high = 1e16;
  var value = Math.floor(Math.random() * (high - low + 1) + low);
  this.fingerprint = value.toString(16);
};
clickToAddress.prototype.getFingerPrint = function () {
  "use strict";
  return this.fingerprint;
};
function clickToAddress(config) {
  "use strict";
  var that = this;
  if (document.getElementById("cc_c2a") !== null) {
    throw "Already initiated";
  }
  if (typeof that == "undefined" || typeof that.preset == "undefined") {
    throw 'Incorrect way to initialize this code. use "new ClickToAddress(config);"';
  }
  that.preset(config);
  that.gfxModeTools = c2a_gfx_modes["mode" + that.gfxMode];
  that.gfxModeTools.addHtml(that);
  that.searchObj = document.getElementById("cc_c2a");
  that.resultList = that.searchObj.getElementsByClassName("c2a_results")[0];
  that.errorObj = that.searchObj.getElementsByClassName("c2a_error")[0];
  that.getAvailableCountries(function () {
    that.serviceReady = 1;
    that.setCountryChange();
    var isValidCountry = function (country, validCountries) {
      for (var i = 0; i < validCountries.length; i++) {
        if (
          country.toLowerCase() === validCountries[i].code ||
          country.toLowerCase() === validCountries[i].short_code
        ) {
          return true;
        }
      }
      return false;
    };
    var country = null;
    if (that.validCountries.length) {
      country = that.validCountries[0].code;
      if (isValidCountry(that.defaultCountry, that.validCountries)) {
        country = that.defaultCountry;
      }
      if (
        that.getIpLocation &&
        that.ipLocation !== "" &&
        isValidCountry(that.ipLocation, that.validCountries)
      ) {
        country = that.ipLocation;
      }
    } else {
      throw "Incorrect country configuration.";
    }
    that.selectCountry(country);
  });
  if (that.searchObj.getElementsByClassName("cc-history").length) {
    that.setHistoryActions();
  }
  this.tools.ccEvent(that.searchObj, "mouseover", function () {
    that.hover = true;
  });
  this.tools.ccEvent(that.searchObj, "mouseout", function () {
    that.hover = false;
  });
  this.tools.ccEvent(document, "click", function () {
    that.hide();
  });
  this.tools.ccEvent(window, "scroll", function () {
    if (that.visible && that.focused) {
      setTimeout(function () {
        that.gfxModeTools.reposition(that, that.activeInput);
      }, 100);
    }
  });
  this.tools.ccEvent(window, "resize", function () {
    if (that.visible) {
      setTimeout(function () {
        that.gfxModeTools.reposition(that, that.activeInput);
      }, 100);
    }
  });
  this.tools.ccEvent(that.resultList, "scroll", function () {
    var scrollTop = parseInt(this.scrollTop);
    var innerHeight = parseInt(
      window.getComputedStyle(this, null).getPropertyValue("height")
    );
    if (
      that.searchStatus.inCountryMode != 1 &&
      parseInt(this.scrollHeight) !== 0 &&
      scrollTop + innerHeight >= parseInt(this.scrollHeight) * 0.8
    ) {
      that.showResultsExtra();
    }
  });
  that.getStyleSheet();
  that.tools.__$styleInject(
    "#cc_c2a ul.c2a_results li.cc-hidden{ display: none; }"
  );
  if (that.transliterate) {
    that.addTransl();
  }
  if (that.debug) {
    that.start_debug();
  }
  if (that.key == "xxxxx-xxxxx-xxxxx-xxxxx") {
    that.info("pre-trial");
  }
  if (typeof config.dom != "undefined") {
    that.attach(config.dom);
  }
}
clickToAddress.prototype.fillData = function (addressDataResult) {
  "use strict";
  var addressData = null;
  if (this.transliterate && typeof this.transl === "function") {
    var resultKeys = Object.keys(addressDataResult);
    addressData = {};
    for (var k = 0; k < resultKeys.length; k++) {
      if (resultKeys[k] === "extra") {
        addressData[resultKeys[k]] = addressDataResult[resultKeys[k]];
      } else {
        addressData[resultKeys[k]] = this.transl(
          addressDataResult[resultKeys[k]]
        );
      }
    }
  } else {
    addressData = addressDataResult;
  }
  if (typeof this.getCfg("beforePopulate") === "function") {
    try {
      this.getCfg("beforePopulate")(this, this.activeDom, addressData);
    } catch (e) {
      this.error("JS508");
    }
  }
  if (typeof this.activeDom.country != "undefined") {
    var options = this.activeDom.country.getElementsByTagName("option");
    if (options.length) {
      var target_val = "";
      for (var i = 0; i < options.length && target_val === ""; i++) {
        if (
          options[i].innerHTML ==
          this.validCountries[this.activeCountryId].country_name
        ) {
          target_val = options[i].value;
          break;
        }
        if (options[i].value == this.activeCountry) {
          target_val = options[i].value;
          break;
        }
      }
      this.activeDom.country.value = target_val;
    } else {
      this.activeDom.country.value =
        this.validCountries[this.activeCountryId].country_name;
    }
  }
  if (typeof this.activeDom.line_1 != "undefined") {
    var line_3 = [];
    if (addressData.line_1 === "" && addressData.company_name !== "") {
      addressData.line_1 = addressData.company_name;
    }
    this.activeDom.line_1.value = addressData.line_1;
    if (typeof this.activeDom.line_2 != "undefined") {
      this.activeDom.line_2.value = addressData.line_2;
    } else {
      if (addressData.line_2 !== "") {
        line_3.push(addressData.line_2);
      }
    }
    if (addressData.company_name !== "") {
      if (typeof this.activeDom.company != "undefined") {
        this.activeDom.company.value = addressData.company_name;
        this.lastSearchCompanyValue = addressData.company_name;
      } else {
        this.activeDom.line_1.value =
          addressData.company_name + ", " + this.activeDom.line_1.value;
      }
    } else {
      if (typeof this.activeDom.company != "undefined") {
        if (
          this.lastSearchCompanyValue !== "" &&
          this.activeDom.company.value == this.lastSearchCompanyValue
        ) {
          this.activeDom.company.value = "";
        }
        this.lastSearchCompanyValue = "";
      }
    }
    if (typeof this.activeDom.postcode != "undefined") {
      this.activeDom.postcode.value = addressData.postal_code;
    } else {
      line_3.push(addressData.postal_code);
    }
    if (typeof this.activeDom.town != "undefined") {
      if (addressData.locality !== "") {
        this.activeDom.town.value = addressData.locality;
      } else {
        this.activeDom.town.value = addressData.dependent_locality;
      }
    } else {
      if (addressData.locality !== "") {
        line_3.push(addressData.locality);
      } else {
        line_3.push(addressData.dependent_locality);
      }
    }
    if (addressData.post_office_reference_1 !== "") {
      if (typeof this.activeDom.post_office_reference_1 != "undefined") {
        this.activeDom.post_office_reference_1.value =
          addressData.post_office_reference_1;
      }
    }
    if (
      addressData.extra !== undefined &&
      addressData.extra.geolocation !== undefined
    ) {
      if (addressData.extra.geolocation.latitude !== undefined) {
        if (typeof this.activeDom.latitude !== "undefined") {
          this.activeDom.latitude.value =
            addressData.extra.geolocation.latitude;
        }
      }
      if (addressData.extra.geolocation.longitude !== undefined) {
        if (typeof this.activeDom.longitude !== "undefined") {
          this.activeDom.longitude.value =
            addressData.extra.geolocation.longitude;
        }
      }
    }
    if (addressData.province_code !== "" || addressData.province_name !== "") {
      var province_set = {
        preferred: addressData.province,
        code: addressData.province_code,
        name: addressData.province_name,
      };
      if (typeof this.getCfg("onSetCounty") == "function") {
        this.getCfg("onSetCounty")(this, this.activeDom, province_set);
      } else if (typeof this.activeDom.county != "undefined") {
        this.setCounty(this.activeDom.county, province_set);
      }
    }
    if (line_3.length) {
      if (typeof this.activeDom.line_2 != "undefined") {
        this.activeDom.line_2.value += ", " + line_3.join(", ");
      } else {
        this.activeDom.line_1.value += ", " + line_3.join(", ");
      }
    }
    if (this.getCfg("limitToMaxLength").enabled) {
      var fields = ["line_1", "line_2", "company"];
      for (var i = 0; i < fields.length; i++) {
        if (
          typeof this.activeDom[fields[i]] != "undefined" &&
          this.activeDom[fields[i]].getAttribute("maxlength") !== null &&
          !isNaN(this.activeDom[fields[i]].getAttribute("maxlength"))
        ) {
          var maxLength = this.activeDom[fields[i]].getAttribute("maxlength");
          var valueLength = this.activeDom[fields[i]].value.length;
          if (maxLength < 1) {
            if (fields[i] === "company") {
              this.lastSearchCompanyValue = "";
            }
            this.activeDom[fields[i]].value = "";
          } else if (maxLength < valueLength) {
            var tempValue = this.activeDom[fields[i]].value.substring(
              0,
              maxLength
            );
            if (this.getCfg("limitToMaxLength").useEllipsis) {
              tempValue = tempValue.slice(0, -1).trim() + "â€¦";
            }
            if (fields[i] === "company") {
              this.lastSearchCompanyValue = tempValue;
            }
            this.activeDom[fields[i]].value = tempValue;
          }
        }
      }
    }
  }
  if (typeof this.getCfg("onResultSelected") == "function") {
    try {
      addressData.country = this.validCountries[this.activeCountryId];
      this.getCfg("onResultSelected")(this, this.activeDom, addressData);
    } catch (e) {
      this.error("JS504");
    }
  }
  this.hide(true);
};
clickToAddress.prototype.setCounty = function (element, province) {
  "use strict";
  if (element.tagName == "SELECT") {
    var target_val = province.code;
    if (target_val === "") {
      target_val = province.name;
    }
    var options = element.getElementsByTagName("option");
    if (options.length) {
      var found = 0;
      var province_name = this.tools.removeDiacritics(province.name);
      var province_code = this.tools.removeDiacritics(province.code);
      for (var i = 0; i < options.length; i++) {
        var option_content = this.tools.removeDiacritics(options[i].innerHTML);
        var option_value = this.tools.removeDiacritics(options[i].value);
        if (
          (option_content !== "" &&
            (option_content == province_name ||
              option_content == province_code)) ||
          (option_value !== "" &&
            (option_value == province_name || option_value == province_code))
        ) {
          target_val = options[i].value;
          found++;
          break;
        }
      }
      if (!found) {
        var province_text = province.name;
        if (province_text === "") {
          province_text = province.code;
        }
        var provinceMatchText = this.tools.removeDiacritics(province_text);
        var matches = { rank: 0, ids: [] };
        for (var i = 0; i < options.length; i++) {
          var option_text = this.tools.removeDiacritics(options[i].innerHTML);
          var highestRank = 0;
          var rankTable = [];
          for (var j = 0; j < provinceMatchText.length; j++) {
            rankTable[j] = [];
            for (var k = 0; k < option_text.length; k++) {
              if (provinceMatchText[j] == option_text[k]) {
                if (j > 0 && k > 0) {
                  rankTable[j][k] = rankTable[j - 1][k - 1] + 1;
                } else {
                  rankTable[j][k] = 1;
                }
                if (rankTable[j][k] > highestRank) {
                  highestRank = rankTable[j][k];
                }
              } else {
                rankTable[j][k] = 0;
              }
            }
          }
          if (matches.rank < highestRank) {
            matches.rank = highestRank;
            matches.ids = [];
          }
          if (matches.rank == highestRank) {
            matches.ids.push(i);
          }
        }
        if (matches.ids.length > 1) {
          var characterDifferences = function (a, b) {
            var aTable = {};
            var bTable = {};
            for (var i = 0; i < a.length; i++) {
              if (typeof aTable[a[i]] == "undefined") aTable[a[i]] = 1;
              else {
                aTable[a[i]]++;
              }
            }
            for (var i = 0; i < b.length; i++) {
              if (typeof bTable[b[i]] == "undefined") bTable[b[i]] = 1;
              else {
                bTable[b[i]]++;
              }
            }
            var totalScore = 0;
            var aKeys = Object.keys(aTable);
            for (var i = 0; i < aKeys.length; i++) {
              if (typeof bTable[aKeys[i]] == "undefined") {
                totalScore += aTable[aKeys[i]];
              } else {
                totalScore += Math.abs(aTable[aKeys[i]] - bTable[aKeys[i]]);
                delete bTable[aKeys];
              }
            }
            var bKeys = Object.keys(bTable);
            for (var i = 0; i < bKeys.length; i++) {
              totalScore += bTable[bKeys[i]];
            }
            return totalScore;
          };
          var charMatch = { id: 0, rank: 1e3 };
          for (var i = 0; i < matches.ids.length; i++) {
            var r = characterDifferences(
              this.tools.removeDiacritics(options[matches.ids[i]].innerHTML),
              provinceMatchText
            );
            if (r < charMatch.rank) {
              charMatch.rank = r;
              charMatch.id = i;
            }
          }
          target_val = options[matches.ids[charMatch.id]].value;
        } else {
          target_val = options[matches.ids[0]].value;
        }
      }
      element.value = target_val;
    }
  } else {
    var province_for_input = province.preferred;
    if (province_for_input === "") {
      province_for_input = province.name;
    }
    if (province_for_input === "") {
      province_for_input = province.code;
    }
    element.value = province_for_input;
  }
};
clickToAddress.prototype.showResults = function () {
  "use strict";
  var _cs = this;
  _cs.scrollPosition = 0;
  _cs.resetSelector();
  _cs.info("clear");
  _cs.resultList.innerHTML = "";
  for (var i = 0; i < _cs.searchResults.results.length; i++) {
    var row = _cs.searchResults.results[i];
    if (typeof row.count == "undefined" || typeof row.id == "undefined") {
      throw "server error";
    }
    var labels = [];
    var hover_label = row.labels.join(", ");
    for (var j = 0; j < row.labels.length; j++) {
      if (_cs.transliterate && typeof _cs.transl === "function") {
        labels.push(_cs.transl(row.labels[j]));
      } else {
        labels.push(row.labels[j]);
      }
    }
    var content = "<div>";
    if (typeof labels[0] == "string" && labels[0] !== "") {
      content += "<span>" + labels[0] + "</span> ";
    }
    if (typeof labels[1] == "string" && labels[1] !== "") {
      content += '<span class="light">' + labels[1] + "</span>";
    }
    if (typeof row.count == "number" && row.count > 1) {
      content +=
        '<span class="light">' +
        _cs.texts.more.replace("{{value}}", row.count) +
        "</span>";
    }
    content += "</div>";
    var new_elem = document.createElement("LI");
    new_elem.innerHTML = content;
    _cs.tools.ccData(new_elem, "id", row.id.toString());
    _cs.tools.ccData(new_elem, "count", row.count.toString());
    new_elem.setAttribute("title", hover_label);
    if (row.count != 1) {
      _cs.tools.addClass(new_elem, "cc-filter");
    }
    if (i >= _cs.scrollLimit) {
      _cs.tools.addClass(new_elem, "cc-hidden");
    }
    _cs.resultList.appendChild(new_elem);
  }
  _cs.resultList.scrollTop = 0;
  var listElements = _cs.resultList.getElementsByTagName("li");
  for (var i = 0; i < listElements.length; i++) {
    _cs.tools.ccEvent(listElements[i], "click", function () {
      _cs.select(this);
    });
  }
  if (_cs.searchResults.results.length === 0) {
    _cs.info("no-results");
    _cs.hasContent = false;
  } else {
    _cs.hasContent = true;
  }
};
clickToAddress.prototype.showResultsExtra = function () {
  "use strict";
  var _cs = this;
  var listElements = _cs.resultList.querySelectorAll(".cc-hidden");
  for (var i = 0; i < _cs.scrollLimit && i < listElements.length; i++) {
    _cs.tools.removeClass(listElements[i], "cc-hidden");
  }
};
clickToAddress.prototype.select = function (li) {
  "use strict";
  this.resetSelector();
  this.cleanHistory();
  li.id = this.tools.ccData(li, "id");
  li.count = this.tools.ccData(li, "count");
  if (li.count === "1") {
    this.getAddressDetails(li.id);
    this.loseFocus();
    return;
  }
  if (li.count !== "1") {
    this.sequence++;
    this.searchStatus.lastSearchId = this.sequence;
    var current_sequence = this.sequence;
    this.search(this.activeInput.value, li.id, current_sequence);
    this.getFocus();
    this.activeId = li.id;
    return;
  }
  if (li.className != "deadend") {
    this.sequence++;
    this.searchStatus.lastSearchId = this.sequence;
    this.search(this.activeInput.value);
    this.getFocus();
    return;
  }
};
clickToAddress.prototype.getGeo = function () {
  "use strict";
  var that = this;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      that.coords = position.coords;
      that.showGeo();
    });
  }
};
clickToAddress.prototype.changeCountry = function (filter) {
  "use strict";
  this.hideHistory();
  this.resetSelector();
  var newHtml = "";
  var limit = this.validCountries.length;
  for (var i = 0; i < limit; i++) {
    newHtml += "<li></li>";
  }
  this.resultList.innerHTML = newHtml;
  var listElements = this.resultList.getElementsByTagName("li");
  this.resultList.scrollTop = 0;
  var country_name_override_keys = Object.keys(
    this.texts.country_name_overrides
  );
  var that = this;
  var skip = 0;
  for (var i = 0; i < listElements.length; i++) {
    var row = this.validCountries[i + skip];
    var content = "";
    if (typeof filter !== "undefined" && filter !== "") {
      var matchFound = false;
      for (var j = 0; !matchFound && j < Object.keys(row).length; j++) {
        var rowElem = row[Object.keys(row)[j]];
        if (typeof rowElem == "object" && Array.isArray(rowElem)) {
          for (var k = 0; !matchFound && k < rowElem.length; k++) {
            var text = rowElem[k].toString().toLowerCase();
            if (text.indexOf(filter.toLowerCase()) === 0) {
              matchFound = true;
            }
          }
        } else {
          var text = rowElem.toString().toLowerCase();
          if (text.indexOf(filter.toLowerCase()) === 0) {
            matchFound = true;
          }
        }
      }
      if (matchFound) {
        var country_name = row.country_name;
        if (
          country_name_override_keys.indexOf(
            row.iso_3166_1_alpha_3.toLowerCase()
          ) != -1
        ) {
          country_name =
            this.texts.country_name_overrides[
              row.iso_3166_1_alpha_3.toLowerCase()
            ];
        }
        content =
          '<span class="cc-flag cc-flag-' +
          row.short_code +
          '"></span>' +
          "<span>" +
          country_name +
          "</span>";
      } else {
        listElements[i].parentNode.removeChild(listElements[i]);
        i--;
        skip++;
      }
    } else {
      var country_name = row.country_name;
      if (
        country_name_override_keys.indexOf(
          row.iso_3166_1_alpha_3.toLowerCase()
        ) != -1
      ) {
        country_name =
          this.texts.country_name_overrides[
            row.iso_3166_1_alpha_3.toLowerCase()
          ];
      }
      content =
        '<span class="cc-flag cc-flag-' +
        row.short_code +
        '"></span>' +
        "<span>" +
        country_name +
        "</span>";
    }
    if (content != "") {
      listElements[i].innerHTML = content;
      listElements[i].setAttribute("countryCode", row.code);
      that.hasContent = true;
      this.tools.ccEvent(listElements[i], "click", function () {
        that.selectCountry(this.getAttribute("countryCode"));
      });
    }
  }
  this.searchStatus.inCountryMode = 1;
  this.getFocus();
};
clickToAddress.prototype.selectCountry = function (countryCode, skipSearch) {
  "use strict";
  var skipSearch = skipSearch || false;
  var that = this;
  this.clear();
  var selectedCountry = {};
  this.activeCountryId = 0;
  for (var i = 0; i < this.validCountries.length; i++) {
    if (
      countryCode.toLowerCase() === this.validCountries[i].code ||
      countryCode.toLowerCase() === this.validCountries[i].short_code
    ) {
      this.activeCountryId = i;
      break;
    }
  }
  selectedCountry = this.validCountries[this.activeCountryId];
  if (this.countrySelectorOption !== "hidden") {
    var countryObj = this.searchObj.getElementsByClassName("country_img")[0];
    countryObj.setAttribute(
      "class",
      "country_img cc-flag cc-flag-" + selectedCountry.short_code
    );
    if (this.countrySelectorOption == "disabled") {
      this.searchObj
        .getElementsByClassName("country_btn")[0]
        .getElementsByTagName("span")[0].innerHTML =
        selectedCountry.country_name;
    }
  }
  this.activeCountry = countryCode;
  that.searchStatus.inCountryMode = 0;
  this.getFocus();
  if (
    !skipSearch &&
    typeof this.activeInput.value != "undefined" &&
    typeof this.lastSearch != ""
  ) {
    for (var i = 0; i < this.domLib.length; i++) {
      if (
        this.domLib[i].lastSearch !== undefined &&
        this.activeInput === this.domLib[i].search
      ) {
        this.activeInput.value = this.domLib[i].lastSearch;
      }
    }
    this.activeId = "";
    this.sequence++;
    this.searchStatus.lastSearchId = this.sequence;
    var current_sequence = this.sequence;
    setTimeout(function () {
      if (that.searchStatus.lastSearchId <= current_sequence) {
        if (that.activeInput.value !== "") {
          that.search(that.activeInput.value, that.activeId, current_sequence);
          that.cleanHistory();
        } else {
          that.clear();
        }
      }
    }, 200);
    this.gfxModeTools.reposition(this, this.activeInput);
  }
  this.setHistoryStep();
  this.setPlaceholder(0);
};
clickToAddress.prototype.setCountryChange = function () {
  "use strict";
  var finalValidCountries = [];
  if (this.enabledCountries.length !== 0) {
    for (var iEC = 0; iEC < this.enabledCountries.length; iEC++) {
      var enabledCountryTestString = this.enabledCountries[iEC];
      var exactMatch = null;
      var partialMatch = [];
      for (var iVC = 0; iVC < this.validCountries.length; iVC++) {
        if (finalValidCountries.indexOf(iVC) !== -1) {
          continue;
        }
        var row = this.validCountries[iVC];
        switch (this.countryMatchWith) {
          case "iso_3":
            if (enabledCountryTestString == row.iso_3166_1_alpha_3) {
              exactMatch = iVC;
            }
            break;
          case "iso_2":
            if (enabledCountryTestString == row.iso_3166_1_alpha_2) {
              exactMatch = iVC;
            }
            break;
          case "code":
            var testArray = [
              row.code.toUpperCase(),
              row.short_code.toUpperCase(),
            ];
            if (testArray.indexOf(enabledCountryTestString) !== -1) {
              exactMatch = iVC;
            }
            break;
          default:
            this.error("JS401");
          case "text":
            for (var j = 0; !exactMatch && j < Object.keys(row).length; j++) {
              var rowElem = row[Object.keys(row)[j]];
              if (typeof rowElem == "string" || typeof rowElem == "number") {
                var text = rowElem.toString().toUpperCase();
                if (text.indexOf(enabledCountryTestString) === 0) {
                  if (text == enabledCountryTestString) {
                    exactMatch = iVC;
                  } else if (partialMatch.indexOf(iVC) == -1) {
                    partialMatch.push(iVC);
                  }
                }
              } else {
                for (var l = 0; l < rowElem.length; l++) {
                  var text = rowElem[l].toString().toUpperCase();
                  if (text.indexOf(enabledCountryTestString) === 0) {
                    if (text == enabledCountryTestString) {
                      exactMatch = iVC;
                    } else if (partialMatch.indexOf(iVC) == -1) {
                      partialMatch.push(iVC);
                    }
                  }
                }
              }
            }
            break;
        }
      }
      if (exactMatch !== null) {
        finalValidCountries.push(exactMatch);
      } else if (partialMatch.length > 0) {
        for (var iPM = 0; iPM < partialMatch.length; iPM++) {
          finalValidCountries.push(partialMatch[iPM]);
        }
      }
      exactMatch = null;
      partialMatch = [];
    }
    var offset = 0;
    for (var iVC = 0; iVC < this.validCountries.length; iVC++) {
      if (finalValidCountries.indexOf(iVC + offset) == -1) {
        this.validCountries.splice(iVC, 1);
        offset++;
        iVC--;
      }
    }
  }
  if (this.validCountries.length === 0) {
    throw "No valid countries left in the country list!";
  }
  if (this.countrySelectorOption == "enabled") {
    var countryObj = this.searchObj.getElementsByClassName("country_btn")[0];
    var that = this;
    this.tools.ccEvent(countryObj, "click", function () {
      if (that.searchStatus.inCountryMode === 0) {
        that.setPlaceholder(1);
        that.changeCountry();
        that.activeInput.value = "";
        that.hasContent = true;
        that.info();
      } else {
        that.setPlaceholder(0);
        that.searchStatus.inCountryMode = 0;
        that.hide(true);
        that.getFocus();
        that.hover = true;
      }
    });
  }
};
if (typeof c2a_gfx_modes == "undefined") {
  var c2a_gfx_modes = {};
}
c2a_gfx_modes["mode1"] = {
  addHtml: function (that) {
    var cc_dropdown = document.createElement("DIV");
    cc_dropdown.className =
      "c2a_mode" +
      that.gfxMode +
      " c2a_" +
      that.style.ambient +
      " c2a_accent_" +
      that.style.accent;
    cc_dropdown.id = "cc_c2a";
    var historyBar =
      '<div class="cc-history"><div class="cc-back cc-disabled"></div>';
    historyBar += '<div class="cc-forward cc-disabled"></div></div>';
    var mainbar = "";
    if (that.countrySelectorOption != "hidden" || that.historyTools) {
      mainbar += '<div class="mainbar">';
      if (that.countrySelectorOption != "hidden") {
        var btnClass = "country_btn";
        if (that.countrySelectorOption == "enabled") {
          btnClass += " country_btn_active";
        }
        mainbar +=
          '<div class="' +
          btnClass +
          '"><div class="country_img"></div><span>' +
          that.texts.country_button +
          "</span></div>";
      }
      if (that.historyTools) {
        mainbar += historyBar;
      }
      if (that.showLogo) {
        mainbar += '<div class="c2a_logo" title="Provided by Fetchify"></div>';
      }
      mainbar += "</div>";
    }
    var progressBar = '<div class="progressBar"></div>';
    var infoBar = '<div class="infoBar"></div>';
    var footerHtml = progressBar + mainbar + infoBar;
    var footerClass = "c2a_footer",
      title = "";
    var html =
      '<div class="c2a_error"></div><ul class="c2a_results"></ul>' +
      '<div class="' +
      footerClass +
      '">' +
      footerHtml +
      "</div>";
    cc_dropdown.innerHTML = html;
    document.body.appendChild(cc_dropdown);
  },
  reposition: function (that, target) {
    var elemRect = target.getBoundingClientRect();
    var doc = document.documentElement;
    var docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var docLeft =
      (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var topOffset = elemRect.top + docTop + (target.offsetHeight - 1);
    var leftOffset = elemRect.left + docLeft + 3;
    var htmlBox = window.getComputedStyle(
      document.getElementsByTagName("html")[0]
    );
    leftOffset +=
      parseInt(htmlBox.getPropertyValue("margin-left")) +
      parseInt(htmlBox.getPropertyValue("padding-left"));
    that.searchObj.style.left = leftOffset + "px";
    that.searchObj.style.top = topOffset + "px";
    that.searchObj.style.width = target.offsetWidth - 6 + "px";
    var logo = that.searchObj.getElementsByClassName("c2a_logo");
    if (logo.length) {
      if (elemRect.width < that.minFieldWidthLogo) {
        that.tools.addClass(logo[0], "hidden");
      } else {
        if (!that.tools.hasClass(logo[0], "tools_in_use")) {
          that.tools.removeClass(logo[0], "hidden");
        }
      }
    }
    var activeClass = "c2a_active_s";
    target.cc_current_target = 1;
    var activeElements = document.getElementsByClassName(activeClass);
    for (var i = 0; i < activeElements.length; i++) {
      if (typeof activeElements[i].cc_current_target == "undefined") {
        activeElements[i].className = activeElements[i].className.replace(
          " " + activeClass,
          ""
        );
      }
    }
    delete target.cc_current_target;
    if (target.className.indexOf(activeClass) == -1) {
      target.className += " " + activeClass;
    }
  },
};
if (typeof c2a_gfx_modes == "undefined") {
  var c2a_gfx_modes = {};
}
c2a_gfx_modes["mode2"] = {
  addHtml: function (that) {
    var cc_dropdown = document.createElement("DIV");
    cc_dropdown.className =
      "c2a_mode" +
      that.gfxMode +
      " c2a_" +
      that.style.ambient +
      " c2a_accent_" +
      that.style.accent;
    cc_dropdown.id = "cc_c2a";
    var mainbar = "";
    if (that.countrySelectorOption != "hidden" || that.historyTools) {
      mainbar += '<div class="mainbar">';
      if (that.countrySelectorOption != "hidden") {
        var btnClass = "country_btn";
        if (that.countrySelectorOption == "enabled") {
          btnClass += " country_btn_active";
        }
        mainbar +=
          '<div class="' +
          btnClass +
          '"><div class="country_img"></div><span>' +
          that.texts.country_button +
          "</span></div>";
      }
      if (that.historyTools) {
        mainbar +=
          '<div class="cc-history"><div class="cc-back disabled"></div>';
        mainbar += '<div class="cc-forward disabled"></div></div>';
      }
      if (that.showLogo) {
        mainbar += '<div class="c2a_logo" title="Provided by Fetchify"></div>';
      }
      mainbar += "</div>";
    }
    var progressBar = '<div class="progressBar"></div>';
    var infoBar = '<div class="infoBar"></div>';
    var footerClass = "c2a_footer";
    var footerHtml = progressBar + infoBar;
    var html =
      mainbar +
      '<div class="c2a_error"></div><ul class="c2a_results"></ul>' +
      '<div class="' +
      footerClass +
      '">' +
      footerHtml +
      "</div>";
    cc_dropdown.innerHTML = html;
    document.body.appendChild(cc_dropdown);
  },
  reposition: function (that, target) {
    var elemRect = target.getBoundingClientRect();
    var doc = document.documentElement;
    var docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var docLeft =
      (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var mainBarHeight = 0;
    if (that.searchObj.getElementsByClassName("mainbar").length) {
      mainBarHeight =
        that.searchObj.getElementsByClassName("mainbar")[0].clientHeight;
    }
    var topOffset = elemRect.top + docTop - (mainBarHeight + 6);
    var leftOffset = elemRect.left + docLeft;
    var htmlBox = window.getComputedStyle(
      document.getElementsByTagName("html")[0]
    );
    leftOffset +=
      parseInt(htmlBox.getPropertyValue("margin-left")) +
      parseInt(htmlBox.getPropertyValue("padding-left"));
    that.searchObj.style.left = leftOffset - 5 + "px";
    that.searchObj.style.top = topOffset + "px";
    that.searchObj.style.width = target.offsetWidth + 10 + "px";
    if (that.searchObj.getElementsByClassName("c2a_results").length) {
      that.searchObj.getElementsByClassName("c2a_results")[0].style.marginTop =
        target.offsetHeight + 6 + "px";
    }
    var logo = that.searchObj.getElementsByClassName("c2a_logo");
    if (logo.length) {
      if (elemRect.width < that.minFieldWidthLogo) {
        that.tools.addClass(logo[0], "hidden");
      } else {
        if (!that.tools.hasClass(logo[0], "tools_in_use")) {
          that.tools.removeClass(logo[0], "hidden");
        }
      }
    }
    var activeClass = "c2a_active";
    target.cc_current_target = 1;
    var activeElements = document.getElementsByClassName(activeClass);
    for (var i = 0; i < activeElements.length; i++) {
      if (typeof activeElements[i].cc_current_target == "undefined") {
        activeElements[i].className = activeElements[i].className.replace(
          " " + activeClass,
          ""
        );
      }
    }
    delete target.cc_current_target;
    if (target.className.indexOf(activeClass) == -1) {
      target.className += " " + activeClass;
    }
  },
};
if (typeof c2a_gfx_modes == "undefined") {
  var c2a_gfx_modes = {};
}
c2a_gfx_modes["mode3"] = {
  addHtml: function (that) {
    var cc_dropdown = document.createElement("DIV");
    cc_dropdown.className =
      "c2a_mode" +
      that.gfxMode +
      " c2a_" +
      that.style.ambient +
      " c2a_accent_" +
      that.style.accent;
    cc_dropdown.id = "cc_c2a";
    var historyBar =
      '<div class="cc-history"><div class="cc-back cc-disabled"></div>';
    historyBar += '<div class="cc-forward cc-disabled"></div></div>';
    var mainbar = "";
    if (that.countrySelectorOption != "hidden" || that.historyTools) {
      mainbar += '<div class="mainbar">';
      if (that.countrySelectorOption != "hidden") {
        var btnClass = "country_btn";
        if (that.countrySelectorOption == "enabled") {
          btnClass += " country_btn_active";
        }
        mainbar +=
          '<div class="' +
          btnClass +
          '"><div class="country_img"></div><span>' +
          that.texts.country_button +
          "</span></div>";
      }
      if (that.historyTools) {
        mainbar += historyBar;
      }
      if (that.showLogo) {
        mainbar += '<div class="c2a_logo" title="Provided by Fetchify"></div>';
      }
      mainbar += "</div>";
    }
    var progressBar = '<div class="progressBar"></div>';
    var infoBar = '<div class="infoBar"></div>';
    var footerHtml = progressBar + mainbar + infoBar;
    var footerClass = "c2a_footer";
    var html =
      '<div class="c2a_error"></div><ul class="c2a_results"></ul>' +
      '<div class="' +
      footerClass +
      '">' +
      footerHtml +
      "</div>";
    cc_dropdown.innerHTML = html;
    document.body.appendChild(cc_dropdown);
  },
  reposition: function (that, target) {
    var elemRect = target.getBoundingClientRect();
    var doc = document.documentElement;
    var docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var docLeft =
      (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var topOffset = elemRect.top + docTop + (target.offsetHeight + 3);
    var leftOffset = elemRect.left + docLeft;
    var htmlBox = window.getComputedStyle(
      document.getElementsByTagName("html")[0]
    );
    leftOffset +=
      parseInt(htmlBox.getPropertyValue("margin-left")) +
      parseInt(htmlBox.getPropertyValue("padding-left"));
    that.searchObj.style.left = leftOffset + "px";
    that.searchObj.style.top = topOffset + "px";
    that.searchObj.style.width = target.offsetWidth + "px";
    var logo = that.searchObj.getElementsByClassName("c2a_logo");
    if (logo.length) {
      if (elemRect.width < that.minFieldWidthLogo) {
        that.tools.addClass(logo[0], "hidden");
      } else {
        if (!that.tools.hasClass(logo[0], "tools_in_use")) {
          that.tools.removeClass(logo[0], "hidden");
        }
      }
    }
    var activeClass = "c2a_active_s";
    target.cc_current_target = 1;
    var activeElements = document.getElementsByClassName(activeClass);
    for (var i = 0; i < activeElements.length; i++) {
      if (typeof activeElements[i].cc_current_target == "undefined") {
        activeElements[i].className = activeElements[i].className.replace(
          " " + activeClass,
          ""
        );
      }
    }
    delete target.cc_current_target;
    if (target.className.indexOf(activeClass) == -1) {
      target.className += " " + activeClass;
    }
  },
};
clickToAddress.prototype.addPhoneVerify = function (config) {
  var ct = this;
  var unique_tag = ct.getUniqueTag();
  var validated_config = {
    country: config.country,
    callback: config.callback ? config.callback : null,
    offset: config.offset ? config.offset : null,
    phone_field: config.phone,
    unique_tag: unique_tag,
    allowed_type: ct.valExist(config, "allowed_type")
      ? config.allowed_type
      : "all",
    get_network_information: ct.valExist(config, "get_network_information")
      ? config.get_network_information
      : false,
    can_correct: ct.valExist(config, "can_correct") ? config.can_correct : true,
    international_convert: ct.valExist(config, "international_convert")
      ? config.international_convert
      : false,
    trim_spaces: ct.valExist(config, "trim_spaces")
      ? config.trim_spaces
      : false,
    ignore_nonnumeric_chars: ct.valExist(config, "ignore_nonnumeric_chars")
      ? config.ignore_nonnumeric_chars
      : false,
    beforeCorrect: config.beforeCorrect ? config.beforeCorrect : null,
    onResult: config.onResult ? config.onResult : null,
    afterPopulate: config.afterPopulate ? config.afterPopulate : null,
  };
  var phone_field = ct.getMixedElem(validated_config.phone_field);
  if (
    ["all", "mobile", "landline"].indexOf(validated_config.allowed_type) == -1
  ) {
    validated_config.allowed_type = "all";
  }
  if (validated_config.allowed_type != "all") {
    validated_config.get_network_information = true;
  }
  ct.verifyHtml(unique_tag);
  var validation_timeout = null;
  var last_phone_validation = null;
  var phone_verify_action_timeout = function (timeout) {
    ct.validate_phone_sequence++;
    var current_sequence = ct.validate_phone_sequence;
    last_phone_validation = phone_field.value;
    if (validation_timeout !== null) {
      clearTimeout(validation_timeout);
    }
    validation_timeout = setTimeout(function () {
      if (current_sequence === ct.validate_phone_sequence) {
        ct.phoneVerifyAction(validated_config);
      }
    }, timeout);
  };
  ct.tools.ccEvent(phone_field, "keyup", function (e) {
    var noActionKeys = [
      9, 27, 37, 38, 39, 40, 33, 34, 35, 36, 42, 44, 45, 16, 17, 18, 19, 20,
    ];
    if (noActionKeys.indexOf(e.keyCode) != -1) {
      return;
    }
    if (last_phone_validation != phone_field.value) {
      phone_verify_action_timeout(1e3);
    }
  });
  ct.tools.ccEvent(phone_field, "blur", function () {
    if (last_phone_validation != phone_field.value) {
      if (validation_timeout !== null) {
        clearTimeout(validation_timeout);
      }
      ct.phoneVerifyAction(validated_config);
    }
  });
  var extra_check_interval = setInterval(function () {
    if (
      phone_field.value !== "" &&
      last_phone_validation !== phone_field.value
    ) {
      phone_verify_action_timeout(500);
    }
  }, 500);
  var field_constant_repos = setInterval(function () {
    ct.verifyReposition(phone_field, validated_config.offset, unique_tag);
  }, 100);
  var destroy_interval = setInterval(function () {
    if (document.body.contains(phone_field) == false) {
      ct.verifyDestroy(unique_tag);
      clearTimeout(validation_timeout);
      clearInterval(extra_check_interval);
      clearInterval(field_constant_repos);
      clearInterval(destroy_interval);
    }
  }, 250);
};
clickToAddress.prototype.phoneVerifyAction = function (config) {
  var ct = this;
  var country_code = ct.getMixedElem(config.country, true).value;
  var phone_number = ct.getMixedElem(config.phone_field).value;
  var phone_field = ct.getMixedElem(config.phone_field);
  var error_object = null;
  var ignore_nonnumeric_chars = function (phonenumber) {
    if (config.ignore_nonnumeric_chars === true) {
      return phonenumber
        .replace(/(^\+)/, "")
        .replace(/\(([^(]+)\)/, "$1")
        .replace(/([0-9])[.-]([0-9])/g, "$1$2");
    }
    return phonenumber;
  };
  var regex_check = /^\+?[0-9 ]{4,}$/;
  if (
    phone_number === "" ||
    !ignore_nonnumeric_chars(phone_number).match(regex_check)
  ) {
    ct.verifyReposition(phone_field, config.offset, config.unique_tag);
    ct.validateCssSwap("fail", config.unique_tag);
    error_object = ct.validation_error(1001);
    if (config.callback) {
      config.callback(false, error_object);
    }
    return;
  }
  var trim_phone_number = function (phonenumber) {
    return phonenumber.replace(/ /g, "");
  };
  ct.validateCssSwap("action", config.unique_tag);
  ct.phoneValidateCall(
    ignore_nonnumeric_chars(phone_number),
    country_code,
    config.get_network_information,
    function (result) {
      if (phone_number !== phone_field.value) {
        return;
      }
      if (result == "error") {
        ct.validateCssSwap(false, config.unique_tag);
        error_object = ct.validation_error(500);
        if (config.callback) {
          config.callback(false, error_object);
        }
        return;
      }
      if (result.result) {
        if (typeof config.onResult === "function") {
          try {
            config.onResult(phone_field, result);
          } catch (e) {
            this.cc_c2a.error("JS511");
          }
        }
        if (
          !config.can_correct &&
          [
            ignore_nonnumeric_chars(trim_phone_number(result.phone_number)),
            ignore_nonnumeric_chars(trim_phone_number(result.national_format)),
          ].indexOf(
            ignore_nonnumeric_chars(trim_phone_number(phone_field.value))
          ) == -1
        ) {
          ct.validateCssSwap("fail", config.unique_tag);
          error_object = ct.validation_error(1001);
          if (config.callback) {
            config.callback(false, error_object);
          }
          return;
        }
        if (
          config.allowed_type == "all" ||
          typeof result.carrier == "undefined" ||
          config.allowed_type == result.carrier.type
        ) {
          ct.validateCssSwap("ok", config.unique_tag);
          if (config.can_correct) {
            if (typeof config.beforeCorrect === "function") {
              try {
                config.beforeCorrect(phone_field, result);
              } catch (e) {
                this.cc_c2a.error("JS509");
              }
            }
            if (
              phone_number.indexOf("+") !== -1 ||
              config.international_convert === true
            ) {
              phone_field.value = result.phone_number;
            } else {
              phone_field.value = result.national_format;
            }
            if (config.trim_spaces) {
              phone_field.value = trim_phone_number(phone_field.value);
            }
          }
          if (config.callback) {
            config.callback(result);
          }
          if (typeof config.afterPopulate === "function") {
            try {
              config.afterPopulate(phone_field, phone_field.value);
            } catch (e) {
              this.cc_c2a.error("JS510");
            }
          }
        } else {
          ct.validateCssSwap("fail", config.unique_tag);
          error_object = ct.validation_error(
            config.allowed_type == "mobile" ? 1002 : 1003
          );
          if (config.callback) {
            config.callback(result, error_object);
          }
        }
      } else {
        ct.validateCssSwap("fail", config.unique_tag);
        error_object = ct.validation_error(1001);
        if (config.callback) {
          config.callback(false, error_object);
        }
      }
      last_phone_validation = phone_field.value;
    }
  );
  ct.verifyReposition(phone_field, config.offset, config.unique_tag);
};
clickToAddress.prototype.addEmailVerify = function (config) {
  var ct = this;
  var unique_tag = ct.getUniqueTag();
  var validated_config = {
    callback: config.callback ? config.callback : null,
    offset: config.offset ? config.offset : null,
    email_field: config.email,
    allow_high_risk: config.allow_high_risk ? config.allow_high_risk : false,
    unique_tag: unique_tag,
  };
  var email_field = ct.getMixedElem(validated_config.email_field);
  ct.verifyHtml(unique_tag);
  var validation_timeout = null;
  var last_email_validation = null;
  var email_verify_action_timeout = function (timeout) {
    ct.validate_email_sequence++;
    var current_sequence = ct.validate_email_sequence;
    last_email_validation = email_field.value;
    if (validation_timeout !== null) {
      clearTimeout(validation_timeout);
    }
    validation_timeout = setTimeout(function () {
      if (current_sequence === ct.validate_email_sequence) {
        ct.emailVerifyAction(validated_config);
      }
    }, timeout);
  };
  ct.tools.ccEvent(email_field, "keyup", function (e) {
    var noActionKeys = [
      9, 27, 37, 38, 39, 40, 33, 34, 35, 36, 42, 44, 45, 16, 17, 18, 19, 20,
    ];
    if (noActionKeys.indexOf(e.keyCode) != -1) {
      return;
    }
    if (last_email_validation != email_field.value) {
      email_verify_action_timeout(500);
    }
  });
  ct.tools.ccEvent(email_field, "blur", function () {
    if (last_email_validation != email_field.value) {
      if (validation_timeout !== null) {
        clearTimeout(validation_timeout);
      }
      ct.emailVerifyAction(validated_config);
    }
  });
  var extra_check_interval = setInterval(function () {
    if (
      email_field.value !== "" &&
      last_email_validation !== email_field.value
    ) {
      email_verify_action_timeout(250);
    }
  }, 250);
  var field_constant_repos = setInterval(function () {
    ct.verifyReposition(email_field, validated_config.offset, unique_tag);
  }, 100);
  var destroy_interval = setInterval(function () {
    if (document.body.contains(email_field) == false) {
      ct.verifyDestroy(unique_tag);
      clearTimeout(validation_timeout);
      clearInterval(extra_check_interval);
      clearInterval(field_constant_repos);
      clearInterval(destroy_interval);
    }
  }, 250);
};
clickToAddress.prototype.emailVerifyAction = function (config) {
  var ct = this;
  var email_field = ct.getMixedElem(config.email_field);
  var error_object = null;
  var email_address = email_field.value;
  var regex_check = /^[^@]+@[^@]+\..+$/;
  if (email_address == "" || !email_address.match(regex_check)) {
    ct.verifyReposition(email_field, config.offset, config.unique_tag);
    ct.validateCssSwap("fail", config.unique_tag);
    error_object = ct.validation_error(2001);
    if (config.callback) {
      config.callback(false, error_object);
    }
    return;
  }
  ct.validateCssSwap("action", config.unique_tag);
  ct.emailValidateCall(email_address, function (result) {
    if (email_address !== email_field.value) {
      return;
    }
    if (result == "error") {
      ct.validateCssSwap(false, config.unique_tag);
      error_object = ct.validation_error(500);
      if (config.callback) {
        config.callback(false, error_object);
      }
      return;
    }
    if (result.result) {
      if (!config.allow_high_risk && result.risk == "high") {
        ct.validateCssSwap("fail", config.unique_tag);
        error_object = ct.validation_error(2001);
        if (config.callback) {
          config.callback(result, error_object);
        }
      } else {
        ct.validateCssSwap("ok", config.unique_tag);
        email_field.value = result.email;
        if (config.callback) {
          config.callback(result);
        }
      }
    } else {
      ct.validateCssSwap("fail", config.unique_tag);
      error_object = ct.validation_error(2001);
      if (config.callback) {
        config.callback(false, error_object);
      }
    }
    last_email_validation = email_field.value;
  });
  ct.verifyReposition(email_field, config.offset, config.unique_tag);
};
clickToAddress.prototype.addBankVerify = function (config) {
  var ct = this;
  var sort_code_unique_tag = ct.getUniqueTag();
  var account_number_unique_tag = ct.getUniqueTag();
  var validated_config = {
    sort_code: {
      callback: config.sort_code_callback ? config.sort_code_callback : null,
      offset: config.sort_code_offset ? config.sort_code_offset : null,
      field: config.sort_code,
      unique_tag: sort_code_unique_tag,
    },
    account_number: {
      callback: config.account_number_callback
        ? config.account_number_callback
        : null,
      offset: config.account_number_offset
        ? config.account_number_offset
        : null,
      field: config.account_number,
      unique_tag: account_number_unique_tag,
    },
  };
  var sort_code_field = ct.getMixedElem(validated_config.sort_code.field);
  var account_number_field = ct.getMixedElem(
    validated_config.account_number.field
  );
  ct.verifyHtml(sort_code_unique_tag);
  ct.verifyHtml(account_number_unique_tag);
  var validation_timeout = null;
  var last_bank_validation = null;
  var bank_verify_action_timeout = function (timeout) {
    ct.validate_bank_sequence++;
    var current_sequence = ct.validate_bank_sequence;
    last_bank_validation = JSON.stringify([
      sort_code_field.value,
      account_number_field.value,
    ]);
    if (validation_timeout !== null) {
      clearTimeout(validation_timeout);
    }
    validation_timeout = setTimeout(function () {
      if (current_sequence === ct.validate_bank_sequence) {
        ct.bankVerifyAction(validated_config);
      }
    }, timeout);
  };
  ct.tools.ccEvent(sort_code_field, "keyup", function (e) {
    var noActionKeys = [
      9, 27, 37, 38, 39, 40, 33, 34, 35, 36, 42, 44, 45, 16, 17, 18, 19, 20,
    ];
    if (noActionKeys.indexOf(e.keyCode) !== -1) {
      return;
    }
    if (
      last_bank_validation !==
      JSON.stringify([sort_code_field.value, account_number_field.value])
    ) {
      bank_verify_action_timeout(100);
    }
  });
  ct.tools.ccEvent(account_number_field, "keyup", function (e) {
    var noActionKeys = [
      9, 27, 37, 38, 39, 40, 33, 34, 35, 36, 42, 44, 45, 16, 17, 18, 19, 20,
    ];
    if (noActionKeys.indexOf(e.keyCode) !== -1) {
      return;
    }
    if (
      last_bank_validation !==
      JSON.stringify([sort_code_field.value, account_number_field.value])
    ) {
      bank_verify_action_timeout(100);
    }
  });
  ct.tools.ccEvent(sort_code_field, "blur", function () {
    if (
      last_bank_validation !==
      JSON.stringify([sort_code_field.value, account_number_field.value])
    ) {
      if (validation_timeout !== null) {
        clearTimeout(validation_timeout);
      }
      ct.bankVerifyAction(validated_config);
    }
  });
  ct.tools.ccEvent(account_number_field, "blur", function () {
    if (
      last_bank_validation !==
      JSON.stringify([sort_code_field.value, account_number_field.value])
    ) {
      if (validation_timeout !== null) {
        clearTimeout(validation_timeout);
      }
      ct.bankVerifyAction(validated_config);
    }
  });
  var extra_check_interval = setInterval(function () {
    if (
      sort_code_field.value !== "" &&
      last_bank_validation !==
        JSON.stringify([sort_code_field.value, account_number_field.value])
    ) {
      bank_verify_action_timeout(100);
    }
  }, 250);
  var field_constant_repos = setInterval(function () {
    ct.verifyReposition(
      sort_code_field,
      validated_config.sort_code.offset,
      sort_code_unique_tag
    );
    ct.verifyReposition(
      account_number_field,
      validated_config.account_number.offset,
      account_number_unique_tag
    );
  }, 100);
  var destroy_interval = setInterval(function () {
    if (document.body.contains(sort_code_field) === false) {
      ct.verifyDestroy(account_number_unique_tag);
      ct.verifyDestroy(sort_code_unique_tag);
      clearTimeout(validation_timeout);
      clearInterval(extra_check_interval);
      clearInterval(field_constant_repos);
      clearInterval(destroy_interval);
    }
  }, 250);
};
clickToAddress.prototype.bankVerifyAction = function (config) {
  var ct = this;
  var account_number_field = ct.getMixedElem(config.account_number.field);
  var sort_code_field = ct.getMixedElem(config.sort_code.field);
  var account_number = account_number_field.value;
  var sort_code = sort_code_field.value;
  var account_number_regex_check = /^\d{8}$/;
  var sort_code_regex_check = /^(?!(?:0{6}|00-00-00))(?:\d{6}|\d\d-\d\d-\d\d)$/;
  var continue_check = true;
  if (sort_code === "" || !sort_code.match(sort_code_regex_check)) {
    ct.verifyReposition(
      sort_code_field,
      config.sort_code.offset,
      config.sort_code.unique_tag
    );
    ct.validateCssSwap("fail", config.sort_code.unique_tag);
    var error_object = ct.validation_error(2001);
    if (config.callback) {
      config.sort_code.callback(false, error_object);
    }
    continue_check = false;
  }
  if (
    account_number !== "" &&
    !account_number.match(account_number_regex_check)
  ) {
    ct.verifyReposition(
      account_number_field,
      config.account_number.offset,
      config.account_number.unique_tag
    );
    ct.validateCssSwap("fail", config.account_number.unique_tag);
    var error_object = ct.validation_error(2001);
    if (config.callback) {
      config.account_number.callback(false, error_object);
    }
    continue_check = false;
  }
  if (!continue_check) {
    return;
  }
  var sort_code_clean = sort_code;
  sort_code_clean = sort_code.replaceAll("-", "");
  if (ct.last_sort_code_validation !== sort_code) {
    ct.validateCssSwap("action", config.sort_code.unique_tag);
  }
  if (account_number !== "") {
    ct.validateCssSwap("action", config.account_number.unique_tag);
  } else {
    ct.validateCssSwap(false, config.account_number.unique_tag);
  }
  ct.bankValidateCall(sort_code_clean, account_number, function (result) {
    if (
      sort_code !== sort_code_field.value ||
      account_number !== account_number_field.value
    ) {
      return;
    }
    if (result === "error") {
      ct.validateCssSwap(false, config.sort_code.unique_tag);
      ct.validateCssSwap(false, config.account_number.unique_tag);
      var error_object = ct.validation_error(500);
      if (config.callback) {
        config.callback(false, error_object);
      }
      return;
    }
    if (
      !result.successful ||
      result.error ||
      !result.general ||
      result.general.deletedDate !== ""
    ) {
      ct.validateCssSwap("fail", config.sort_code.unique_tag);
      var error_object = ct.validation_error(2001);
      if (config.sort_code.callback) {
        config.callback(result, error_object);
      }
      if (account_number !== "") {
        ct.validateCssSwap("fail", config.account_number.unique_tag);
        var error_object = ct.validation_error(2001);
        if (config.account_number.callback) {
          config.callback(result, error_object);
        }
      }
    } else {
      ct.validateCssSwap("ok", config.sort_code.unique_tag);
      sort_code_field.value = result.sortCode;
      if (config.sort_code.callback) {
        config.callback(result);
      }
      if (account_number !== "") {
        if (
          !result.bankValidate ||
          result.bankValidate.invalidAccountNumber ||
          !result.bankValidate.isCorrect
        ) {
          ct.validateCssSwap("fail", config.account_number.unique_tag);
          var error_object = ct.validation_error(2001);
          if (config.account_number.callback) {
            config.callback(result, error_object);
          }
        } else {
          ct.validateCssSwap("ok", config.account_number.unique_tag);
          account_number_field.value = result.bankValidate.accountNumber;
          if (config.account_number.callback) {
            config.callback(result);
          }
        }
      }
    }
    last_bank_validation = JSON.stringify([
      sort_code_field.value,
      account_number_field.value,
    ]);
    ct.last_sort_code_validation = sort_code_field.value;
  });
  ct.verifyReposition(
    sort_code_field,
    config.sort_code.offset,
    config.sort_code.unique_tag
  );
  ct.verifyReposition(
    account_number_field,
    config.account_number.offset,
    config.account_number.unique_tag
  );
};
clickToAddress.prototype.verifyHtml = function (tag) {
  var cc_validate_box = document.createElement("DIV");
  cc_validate_box.id = "cc_validate_box";
  cc_validate_box.setAttribute("cc_validate_tag", tag);
  document.body.appendChild(cc_validate_box);
  return cc_validate_box;
};
clickToAddress.prototype.validateCssSwap = function (new_rule, tag) {
  var ct = this;
  var box = document.querySelector(
    '#cc_validate_box[cc_validate_tag="' + tag + '"]'
  );
  var known_classes = ["action", "ok", "fail"];
  for (var i = 0; i < known_classes.length; i++) {
    ct.tools.removeClass(box, "cc-validate-" + known_classes[i]);
  }
  if (new_rule) ct.tools.addClass(box, "cc-validate-" + new_rule);
};
clickToAddress.prototype.verifyReposition = function (target, offset, tag) {
  var ct = this;
  var box = document.querySelector(
    '#cc_validate_box[cc_validate_tag="' + tag + '"]'
  );
  var elemRect = target.getBoundingClientRect();
  var doc = document.documentElement;
  var docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  var docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  var height = target.offsetHeight;
  box.style.width = height * 0.7 + "px";
  box.style.height = height * 0.7 + "px";
  var topOffset = elemRect.top + docTop + height * 0.15;
  var leftOffset = elemRect.right + docLeft - height * 0.85;
  if (offset) {
    if (typeof offset.left) {
      leftOffset += offset.left;
    }
  }
  box.style.left = leftOffset + "px";
  box.style.top = topOffset + "px";
};
clickToAddress.prototype.verifyDestroy = function (tag) {
  var ct = this;
  var box = document.querySelector(
    '#cc_validate_box[cc_validate_tag="' + tag + '"]'
  );
  box.parentNode.removeChild(box);
};
clickToAddress.prototype.getMixedElem = function (thing, accept_function) {
  if (accept_function && typeof thing == "function") {
    return { value: thing() };
  }
  if (typeof thing == "object") {
    return thing;
  }
  var element = document.querySelector(thing);
  if (element != null) {
    return element;
  }
  return document.querySelector("#" + thing);
};
clickToAddress.prototype.getUniqueTag = function () {
  var low = 1e5;
  var high = 999999;
  var unique_tag = null;
  while (
    (unique_tag = Math.floor(Math.random() * (high - low + 1) + low)) &&
    document.querySelector(
      '#cc_validate_box[cc_validate_tag="' + unique_tag + '"]'
    ) != null
  ) {}
  return unique_tag;
};
clickToAddress.prototype.validation_error_reasons = {
  1001: "Invalid phone number.",
  1002: "Please enter a mobile number.",
  1003: "Please enter a landline number.",
  2001: "Invalid email address.",
  3001: "Invalid sort code.",
  3002: "Invalid account number.",
  500: "Service Unavailable.",
};
clickToAddress.prototype.validation_error = function (code) {
  var ct = this;
  return { code: code, text: ct.validation_error_reasons[code.toString()] };
};
clickToAddress.prototype.valExist = function (obj, key) {
  if (typeof obj[key] == "undefined") return false;
  return obj[key] != null;
};
clickToAddress.prototype.setupText = function (textCfg) {
  "use strict";
  this.texts = {
    default_placeholder: "Start with post/zip code or street",
    country_placeholder: "Type here to search for a country",
    country_button: "Change Country",
    generic_error:
      "Service unavailable.</br>Please enter your address manually.",
    no_results: "No results found",
    more: "({{value}} more)",
    country_name_overrides: {},
    placeholder_country_overrides: {},
  };
  if (typeof textCfg != "undefined") {
    var keys = Object.keys(this.texts);
    for (var i = 0; i < keys.length; i++) {
      if (typeof textCfg[keys[i]] != "undefined" && textCfg[keys[i]] !== "") {
        this.texts[keys[i]] = textCfg[keys[i]];
      }
    }
  }
};
clickToAddress.prototype.setCfg = function (
  config,
  name,
  defaultValue,
  cfgValue
) {
  "use strict";
  defaultValue = defaultValue || false;
  cfgValue = cfgValue || false;
  if (!cfgValue) {
    cfgValue = name;
  }
  if (typeof config[cfgValue] != "undefined" && config[cfgValue] !== "") {
    this[name] = config[cfgValue];
  } else {
    this[name] = defaultValue;
  }
};
clickToAddress.prototype.getCfg = function (name) {
  if (
    typeof this.activeDom.config !== "undefined" &&
    typeof this.activeDom.config[name] !== "undefined"
  ) {
    return this.activeDom.config[name];
  } else {
    return this[name];
  }
};
clickToAddress.prototype.preset = function (config) {
  "use strict";
  this.jsVersion = "1.10.0";
  this.serviceReady = 0;
  this.debug = false;
  this.activeCountry = "";
  this.hover = false;
  this.visible = false;
  this.focused = false;
  this.hasContent = false;
  this.keyboardHideInProgress = false;
  this.coords = 0;
  this.activeDom = {};
  this.domLib = [];
  this.searchResults = {};
  this.searchObj = {};
  this.selectorPos = -1;
  this.activeInput = "init";
  this.searchStatus = { lastSearchId: 0, lastResponseId: 0, inCountryMode: 0 };
  this.sequence = 0;
  this.validate_phone_sequence = 0;
  this.validate_email_sequence = 0;
  this.validate_bank_sequence = 0;
  this.cache = { finds: {}, retrieves: {} };
  this.cachePos = -1;
  this.scrollPosition = 0;
  this.scrollLimit = 20;
  this.minFieldWidthLogo = 300;
  this.activeId = "";
  this.lastKeyUpEvent = null;
  this.lastSearch = "";
  this.funcStore = {};
  this.transl = null;
  this.lastSearchCompanyValue = "";
  this.validate_box = null;
  this.validate_last_value = null;
  this.lookup_in_progress = false;
  this.setCfg(config, "gfxMode", 1);
  this.setCfg(
    config,
    "baseURL",
    "https://api.craftyclicks.co.uk/address/1.1",
    "relay"
  );
  if (this.baseURL[this.baseURL.length] != "/") {
    this.baseURL += "/";
  }
  this.setCfg(config, "key", "", "accessToken");
  this.setCfg(config, "defaultCountry", "gbr");
  this.setCfg(config, "enabledCountries", []);
  if (this.enabledCountries.length) {
    for (var eci = 0; eci < this.enabledCountries.length; eci++) {
      this.enabledCountries[eci] = this.enabledCountries[eci].toUpperCase();
    }
  }
  this.setCfg(config, "style", { ambient: "light", accent: "default" });
  if (["light", "dark", "custom"].indexOf(this.style.ambient) == -1) {
    this.style.ambient = "light";
  }
  if (
    [
      "default",
      "red",
      "pink",
      "purple",
      "deepPurple",
      "indigo",
      "blue",
      "lightBlue",
      "cyan",
      "teal",
      "green",
      "lightGreen",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deepOrange",
      "brown",
      "grey",
      "blueGrey",
      "custom",
    ].indexOf(this.style.accent) == -1
  ) {
    this.style.accent = "default";
  }
  this.setCfg(config, "domMode", "name");
  this.setCfg(config, "placeholders", true);
  this.setCfg(config, "onResultSelected");
  this.setCfg(config, "onCountryChange");
  this.setCfg(config, "onSearchFocus");
  this.setCfg(config, "onSetCounty");
  this.setCfg(config, "onError");
  this.setCfg(config, "beforeFind");
  this.setCfg(config, "beforePopulate");
  this.setCfg(config, "requestFunction");
  this.setCfg(config, "historyTools", true);
  if (this.enabledCountries.length === 1) {
    this.setCfg(config, "countrySelector", false);
    this.setCfg(config, "countrySelectorOption", "disabled");
  } else {
    this.setCfg(config, "countrySelector", true);
    this.setCfg(config, "countrySelectorOption", "enabled");
  }
  if (
    typeof config.countrySelectorOption == "undefined" &&
    typeof config.countrySelector != "undefined"
  ) {
    if (this.countrySelector) {
      this.countrySelectorOption = "enabled";
    } else {
      this.countrySelectorOption = "disabled";
    }
  }
  this.setCfg(config, "limitToMaxLength", {
    enabled: false,
    useEllipsis: false,
  });
  this.setCfg(config, "showLogo", true);
  this.setCfg(config, "getIpLocation", true);
  this.setCfg(config, "accessTokenOverride", {});
  this.setupText(config.texts);
  this.setCfg(config, "countryLanguage", "en");
  this.setCfg(config, "countryMatchWith", "iso_3");
  this.setCfg(config, "tag", "");
  this.setCfg(
    config,
    "cssPath",
    "https://cc-cdn.com/generic/styles/v1/cc_c2a.min.css"
  );
  this.setCfg(config, "preserveAutocompleteAttribute", false);
  this.setCfg(config, "disableAutoSearch", false);
  this.setCfg(config, "transliterate", false);
  this.setCfg(config, "debug", false);
  this.setCfg(config, "excludeAreas", []);
  this.setCfg(config, "excludePoBox", false);
  this.setCfg(config, "useCeremonialCounties", false);
  this.setCfg(config, "customParameters", {});
  this.setFingerPrint();
};
clickToAddress.prototype.tools = {};
clickToAddress.prototype.tools.ccEvent = function (
  target,
  event_to_react,
  function_to_call
) {
  target.addEventListener(event_to_react, function_to_call);
};
clickToAddress.prototype.tools.ccData = function (target, attr, value) {
  if (typeof target === "undefined" || typeof attr === "undefined") {
    return;
  }
  if (typeof value !== "undefined") {
    target.setAttribute("data-" + attr, JSON.stringify({ data: value }));
    return true;
  } else {
    return JSON.parse(target.getAttribute("data-" + attr)).data;
  }
};
clickToAddress.prototype.tools.defaultDiacriticsRemovalMap = [
  {
    base: "A",
    letters:
      /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
  },
  { base: "AA", letters: /[\uA732]/g },
  { base: "AE", letters: /[\u00C6\u01FC\u01E2]/g },
  { base: "AO", letters: /[\uA734]/g },
  { base: "AU", letters: /[\uA736]/g },
  { base: "AV", letters: /[\uA738\uA73A]/g },
  { base: "AY", letters: /[\uA73C]/g },
  {
    base: "B",
    letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
  },
  {
    base: "C",
    letters:
      /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
  },
  {
    base: "D",
    letters:
      /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
  },
  { base: "DZ", letters: /[\u01F1\u01C4]/g },
  { base: "Dz", letters: /[\u01F2\u01C5]/g },
  {
    base: "E",
    letters:
      /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
  },
  { base: "F", letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
  {
    base: "G",
    letters:
      /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
  },
  {
    base: "H",
    letters:
      /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
  },
  {
    base: "I",
    letters:
      /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
  },
  { base: "J", letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
  {
    base: "K",
    letters:
      /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
  },
  {
    base: "L",
    letters:
      /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
  },
  { base: "LJ", letters: /[\u01C7]/g },
  { base: "Lj", letters: /[\u01C8]/g },
  { base: "M", letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
  {
    base: "N",
    letters:
      /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
  },
  { base: "NJ", letters: /[\u01CA]/g },
  { base: "Nj", letters: /[\u01CB]/g },
  {
    base: "O",
    letters:
      /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
  },
  { base: "OI", letters: /[\u01A2]/g },
  { base: "OO", letters: /[\uA74E]/g },
  { base: "OU", letters: /[\u0222]/g },
  {
    base: "P",
    letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
  },
  { base: "Q", letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
  {
    base: "R",
    letters:
      /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
  },
  {
    base: "S",
    letters:
      /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
  },
  {
    base: "T",
    letters:
      /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
  },
  { base: "TZ", letters: /[\uA728]/g },
  {
    base: "U",
    letters:
      /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
  },
  { base: "V", letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
  { base: "VY", letters: /[\uA760]/g },
  {
    base: "W",
    letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
  },
  { base: "X", letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
  {
    base: "Y",
    letters:
      /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
  },
  {
    base: "Z",
    letters:
      /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
  },
  {
    base: "a",
    letters:
      /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
  },
  { base: "aa", letters: /[\uA733]/g },
  { base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
  { base: "ao", letters: /[\uA735]/g },
  { base: "au", letters: /[\uA737]/g },
  { base: "av", letters: /[\uA739\uA73B]/g },
  { base: "ay", letters: /[\uA73D]/g },
  {
    base: "b",
    letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
  },
  {
    base: "c",
    letters:
      /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
  },
  {
    base: "d",
    letters:
      /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
  },
  { base: "dz", letters: /[\u01F3\u01C6]/g },
  {
    base: "e",
    letters:
      /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
  },
  { base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
  {
    base: "g",
    letters:
      /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
  },
  {
    base: "h",
    letters:
      /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
  },
  { base: "hv", letters: /[\u0195]/g },
  {
    base: "i",
    letters:
      /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
  },
  { base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
  {
    base: "k",
    letters:
      /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
  },
  {
    base: "l",
    letters:
      /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
  },
  { base: "lj", letters: /[\u01C9]/g },
  { base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
  {
    base: "n",
    letters:
      /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
  },
  { base: "nj", letters: /[\u01CC]/g },
  {
    base: "o",
    letters:
      /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
  },
  { base: "oi", letters: /[\u01A3]/g },
  { base: "ou", letters: /[\u0223]/g },
  { base: "oo", letters: /[\uA74F]/g },
  {
    base: "p",
    letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
  },
  { base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
  {
    base: "r",
    letters:
      /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
  },
  {
    base: "s",
    letters:
      /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
  },
  {
    base: "t",
    letters:
      /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
  },
  { base: "tz", letters: /[\uA729]/g },
  {
    base: "u",
    letters:
      /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
  },
  { base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
  { base: "vy", letters: /[\uA761]/g },
  {
    base: "w",
    letters:
      /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
  },
  { base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
  {
    base: "y",
    letters:
      /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
  },
  {
    base: "z",
    letters:
      /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g,
  },
];
clickToAddress.prototype.tools.removeDiacritics = function (str) {
  var changes = this.defaultDiacriticsRemovalMap;
  for (var i = 0; i < changes.length; i++) {
    str = str.replace(changes[i].letters, changes[i].base);
  }
  return str.toLowerCase();
};
clickToAddress.prototype.tools.binaryIndexOf = function (array, sequence) {
  "use strict";
  var minIndex = 0;
  var maxIndex = array.length - 1;
  var currentIndex;
  var currentElement;
  var resultIndex;
  while (minIndex <= maxIndex) {
    resultIndex = currentIndex = ((minIndex + maxIndex) / 2) | 0;
    currentElement = array[currentIndex];
    if (currentElement.sequence < sequence) {
      minIndex = currentIndex + 1;
    } else if (currentElement.sequence > sequence) {
      maxIndex = currentIndex - 1;
    } else {
      return currentIndex;
    }
  }
  return ~maxIndex;
};
clickToAddress.prototype.tools.getCountryCode = function (c2a, text, matchBy) {
  switch (matchBy) {
    case "iso_3":
      for (var i = 0; i < c2a.validCountries.length; i++) {
        var row = c2a.validCountries[i];
        if (row.iso_3166_1_alpha_3 == text) {
          return row.code;
        }
      }
      break;
    case "iso_2":
      for (var i = 0; i < c2a.validCountries.length; i++) {
        var row = c2a.validCountries[i];
        if (row.iso_3166_1_alpha_2 == text) {
          return row.code;
        }
      }
      break;
  }
  return false;
};
if (typeof getCountryCode == "undefined") {
  var getCountryCode = function (c2a, text, matchBy) {
    switch (matchBy) {
      case "iso_3":
        for (var i = 0; i < c2a.validCountries.length; i++) {
          var row = c2a.validCountries[i];
          if (row.iso_3166_1_alpha_3 == text) {
            return row.code;
          }
        }
        break;
      case "iso_2":
        for (var i = 0; i < c2a.validCountries.length; i++) {
          var row = c2a.validCountries[i];
          if (row.iso_3166_1_alpha_2 == text) {
            return row.code;
          }
        }
        break;
    }
    return false;
  };
}
clickToAddress.prototype.tools.addClass = function (elem, value) {
  var classes = elem.className.split(" ");
  if (classes.indexOf(value) == -1) {
    classes.push(value);
  }
  elem.className = classes.join(" ");
};
clickToAddress.prototype.tools.removeClass = function (elem, value) {
  var classes = elem.className.split(" ");
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == value) {
      classes.splice(i, 1);
      i--;
    }
  }
  elem.className = classes.join(" ");
};
clickToAddress.prototype.tools.hasClass = function (elem, value) {
  var classes = elem.className.split(" ");
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == value) {
      return true;
    }
  }
  return false;
};
clickToAddress.prototype.tools.__$styleInject = function (css) {
  css = css || "";
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
};
clickToAddress.prototype.addTransl = function () {
  var that = this;
  try {
    if ("function" == typeof define && define.amd) {
      var transl_url =
        "https://cc-cdn.com/utils/transl/v1.6.2/transliteration.min";
      requirejs.config({ paths: { transliterate: [transl_url] } });
      require(["transliterate"], function (transl) {
        that.transl = transl;
      });
    } else {
      var transl_url =
        "https://cc-cdn.com/utils/transl/v1.6.2/transliteration.min.js";
      var jsId = "crafty_transliterate";
      if (document.getElementById("crafty_transliterate") === null) {
        if (!document.getElementById(jsId)) {
          var head = document.getElementsByTagName("head")[0];
          var link = document.createElement("script");
          link.id = jsId;
          link.type = "text/javascript";
          link.src = transl_url;
          head.appendChild(link);
        }
        var waitForLib = function () {
          if (typeof transl == "function") {
            clearInterval(transl_loading);
            that.transl = transl;
          }
        };
        var transl_loading = setInterval(waitForLib, 250);
      }
    }
  } catch (e) {}
};
clickToAddress.prototype.setPlaceholder = function (country, target) {
  "use strict";
  if (this.placeholders) {
    if (country) {
      var text = this.texts.country_placeholder;
      target = this.activeInput;
      target.setAttribute("placeholder", text);
    } else {
      var placeholderCountry = this.activeCountry;
      if (placeholderCountry === "") {
        placeholderCountry = this.defaultCountry;
      }
      var overridePlaceholder =
        this.texts.placeholder_country_overrides[placeholderCountry];
      var text = this.texts.default_placeholder;
      if (overridePlaceholder !== undefined) {
        text = overridePlaceholder;
      }
      if (typeof target !== "undefined") {
        target.setAttribute("placeholder", text);
      } else {
        if (this.domLib.length > 0) {
          for (var i = 0; i < this.domLib.length; i++) {
            target = this.domLib[i].search;
            target.setAttribute("placeholder", text);
          }
        }
      }
    }
  }
};
clickToAddress.prototype.getFocus = function () {
  "use strict";
  if (this.activeInput != "init") {
    this.activeInput.focus();
  }
  this.focused = true;
};
clickToAddress.prototype.loseFocus = function () {
  "use strict";
  if (this.activeInput != "init") {
    this.activeInput.blur();
  }
  this.focused = false;
};
clickToAddress.prototype.clear = function () {
  "use strict";
  this.resultList.innerHTML = "";
  this.searchStatus = { lastSearchId: 0, lastResponseId: 0, inCountryMode: 0 };
};
clickToAddress.prototype.show = function () {
  "use strict";
  this.searchObj.style.display = "block";
  this.visible = true;
  this.setHistoryStep();
  if (this.activeInput != "init") {
    var cc_ac_stored = this.activeInput.getAttribute("autocomplete");
    if (cc_ac_stored) {
      this.activeInput.setAttribute("cc_ac_stored", cc_ac_stored);
    }
    this.activeInput.setAttribute("autocomplete", "new-crafty-global-search");
  }
};
clickToAddress.prototype.hide = function (force_it) {
  "use strict";
  if (this.keyboardHideInProgress) {
    this.keyboardHideInProgress = false;
    return;
  }
  if (force_it || (this.visible && !this.focused && !this.hover)) {
    this.searchObj.style.display = "none";
    this.visible = false;
    this.hover = false;
    if (
      this.searchStatus.inCountryMode &&
      typeof this.lastSearch !== "undefined"
    ) {
      this.activeInput.value = this.lastSearch;
    }
    this.clear();
    this.cachePos = -1;
    this.resetSelector();
    this.setPlaceholder(0);
    if (this.activeInput != "init") {
      this.activeInput.className = this.activeInput.className
        .replace(" c2a_active_s", "")
        .replace(" c2a_active", "");
      var cc_ac_stored = this.activeInput.getAttribute("cc_ac_stored");
      this.activeInput.setAttribute("autocomplete", cc_ac_stored);
      this.activeInput.removeAttribute("cc_ac_stored");
    }
  }
  this.hideErrors();
};
clickToAddress.prototype.attach = function (dom, cfg) {
  "use strict";
  var cfg = cfg || {};
  var domElements = {};
  var objectArray = [
    "search",
    "postcode",
    "town",
    "line_1",
    "line_2",
    "company",
    "county",
    "country",
    "post_office_reference_1",
    "latitude",
    "longitude",
  ];
  var quickGet = null;
  switch (this.domMode) {
    case "id":
      quickGet = function (dom, obj_name) {
        if (typeof dom[obj_name] == "string" && dom[obj_name] !== "") {
          return document.getElementById(dom[obj_name]);
        }
      };
      break;
    case "class":
      quickGet = function (dom, obj_name) {
        if (typeof dom[obj_name] == "string" && dom[obj_name] !== "") {
          return document.getElementsByClassName(dom[obj_name])[0];
        }
      };
      break;
    case "name":
      quickGet = function (dom, obj_name) {
        if (typeof dom[obj_name] == "string" && dom[obj_name] !== "") {
          return document.getElementsByName(dom[obj_name])[0];
        }
      };
      break;
    case "object":
      quickGet = function (dom, obj_name) {
        if (typeof dom[obj_name] == "object" && dom[obj_name] !== null) {
          return dom[obj_name];
        }
      };
      break;
    case "jQuery":
      quickGet = function (dom, obj_name) {
        if (dom[obj_name] instanceof jQuery) {
          return dom[obj_name][0];
        }
      };
      break;
  }
  for (var i = 0; i < objectArray.length; i++) {
    domElements[objectArray[i]] = quickGet(dom, objectArray[i]);
  }
  var target = domElements.search;
  if (target.getAttribute("cc_applied") == "true") {
    throw "ClickToAddress already applied to this element!";
  }
  target.setAttribute("cc_applied", "true");
  this.setPlaceholder(0, target);
  domElements.config = cfg;
  var domLibId = this.domLib.length;
  this.domLib.push(domElements);
  var that = this;
  this.tools.ccEvent(target, "keydown", function (e) {
    if (that.serviceReady === 0) return;
    if (e.keyCode == 38 || e.keyCode == 40) {
      e.preventDefault();
      if (!that.hasContent) {
        return;
      }
      that.moveSelector(e.keyCode == 40);
      return;
    }
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  });
  this.tools.ccEvent(target, "keyup", function (e) {
    if (that.serviceReady === 0) return;
    if (that.lastKeyUpEvent !== null && that.lastKeyUpEvent === e) {
      return;
    }
    that.lastKeyUpEvent = e;
    if (e.keyCode == 27) {
      that.hide(true);
      that.loseFocus();
      that.resetSelector();
      return;
    }
    var noActionKeys = [
      37, 38, 39, 40, 33, 34, 35, 36, 42, 44, 45, 16, 17, 18, 19, 20,
    ];
    if (noActionKeys.indexOf(e.keyCode) != -1) {
      return;
    }
    if (e.keyCode == 13) {
      e.preventDefault();
      if (!that.hasContent || that.selectorPos < 0) {
        return;
      }
      var elem = that.searchObj.getElementsByTagName("LI")[that.selectorPos];
      if (that.searchStatus.inCountryMode == 1) {
        that.selectCountry(elem.getAttribute("countryCode"));
      } else {
        that.select(elem);
      }
      return;
    }
    if (that.searchStatus.inCountryMode == 1) {
      that.changeCountry(this.value);
    } else {
      if (that.getCfg("disableAutoSearch")) {
        return;
      }
      if (this.value.indexOf(that.lastSearch) !== 0) {
        that.activeId = "";
      }
      if (that.domLib.length > 0) {
        for (var i = 0; i < that.domLib.length; i++) {
          if (that.domLib[i].search === that.activeInput) {
            that.domLib[i].lastSearch = this.value;
          }
        }
      }
      that.sequence++;
      that.searchStatus.lastSearchId = that.sequence;
      var current_sequence_number = that.sequence;
      var searchVal = this.value;
      setTimeout(function () {
        if (that.searchStatus.lastSearchId <= current_sequence_number) {
          if (searchVal !== "") {
            that.cleanHistory();
            that.search(searchVal, that.activeId, current_sequence_number);
          } else {
            that.clear();
          }
        }
      }, 200);
      that.activeDom = that.domLib[domLibId];
      that.gfxModeTools.reposition(that, target);
    }
  });
  this.tools.ccEvent(target, "focus", function () {
    that.activeDom = that.domLib[domLibId];
    that.onFocus(target);
  });
  this.tools.ccEvent(target, "blur", function () {
    if (that.serviceReady === 0) return;
    that.focused = false;
    that.hide();
  });
  this.tools.ccEvent(target, "c2a-search", function () {
    that.show();
    if (that.searchStatus.inCountryMode == 1) {
      that.changeCountry(this.value);
    } else {
      if (this.value.indexOf(that.lastSearch) !== 0) {
        that.activeId = "";
      }
      if (that.domLib.length > 0) {
        for (var i = 0; i < that.domLib.length; i++) {
          if (that.domLib[i].search === that.activeInput) {
            that.domLib[i].lastSearch = this.value;
          }
        }
      }
      that.sequence++;
      that.searchStatus.lastSearchId = that.sequence;
      var current_sequence_number = that.sequence;
      var searchVal = this.value;
      setTimeout(function () {
        if (that.searchStatus.lastSearchId <= current_sequence_number) {
          if (searchVal !== "") {
            that.cleanHistory();
            that.search(searchVal, that.activeId, current_sequence_number);
          } else {
            that.clear();
          }
        }
      }, 200);
      that.activeDom = that.domLib[domLibId];
      that.gfxModeTools.reposition(that, target);
    }
  });
  if (target === document.activeElement) {
    this.onFocus(target);
  }
  if (
    !that.getCfg("preserveAutocompleteAttribute") &&
    (typeof domElements.line_1 == "undefined" ||
      domElements.line_1.getAttribute("cc_applied") != "true")
  ) {
    target.setAttribute("autocomplete", "new-crafty-global-search");
  }
};
clickToAddress.prototype.addAddressComplete = function (dom, cfg) {
  this.attach(dom, cfg);
};
clickToAddress.prototype.onFocus = function (target) {
  "use strict";
  var that = this;
  if (that.serviceReady === 0) {
    setTimeout(function () {
      that.onFocus(target);
    }, 250);
    return;
  }
  var prestate = that.visible;
  that.activeInput = target;
  that.focused = true;
  that.show();
  that.gfxModeTools.reposition(that, target);
  if (!prestate) {
    if (typeof that.getCfg("onSearchFocus") == "function") {
      that.getCfg("onSearchFocus")(that, that.activeDom);
    }
  }
  if (target.value !== "" && !prestate) {
    that.sequence++;
    that.searchStatus.lastSearchId = that.sequence;
    var sequence = that.sequence;
    if (that.lastSearch == target.value) {
      sequence = -1;
    }
    that.lastSearch = target.value;
    that.search(target.value, that.activeId, sequence);
  }
};
clickToAddress.prototype.resetSelector = function () {
  "use strict";
  this.hasContent = false;
  this.selectorPos = -1;
};
clickToAddress.prototype.moveSelector = function (goDown) {
  "use strict";
  if (!this.visible) {
    return;
  }
  var elems = this.searchObj.getElementsByTagName("LI");
  if (goDown && this.selectorPos + 1 < elems.length) {
    this.selectorPos++;
  }
  if (!goDown && this.selectorPos - 1 >= 0) {
    this.selectorPos--;
  }
  for (var i = 0; i < elems.length; i++) {
    if (i != this.selectorPos) {
      elems[i].className = elems[i].className.replace(" active", "");
    } else {
      if (elems[i].className.indexOf("active") == -1) {
        elems[i].className = elems[i].className + " active";
      }
    }
  }
  var offset = 30 * (this.selectorPos + 1);
  var list = this.searchObj.getElementsByTagName("UL")[0];
  if (offset > list.offsetHeight + list.scrollTop) {
    list.scrollTop = offset - list.offsetHeight;
  }
  if (offset <= list.scrollTop) {
    list.scrollTop = offset - 30;
  }
};
clickToAddress.prototype.showGeo = function () {
  "use strict";
  this.searchObj.getElementsByClassName("geo")[0].style.display = "block";
};
clickToAddress.prototype.getStyleSheet = function () {
  "use strict";
  if (this.cssPath === false) {
    return;
  }
  var cssId = "crafty_css";
  if (!document.getElementById(cssId)) {
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = this.cssPath;
    link.media = "all";
    head.appendChild(link);
  }
};
clickToAddress.prototype.setProgressBar = function (state) {
  "use strict";
  var pgbar = this.searchObj.getElementsByClassName("progressBar")[0];
  switch (state) {
    case 0:
      pgbar.className = "progressBar action";
      pgbar.style.width = "50%";
      setTimeout(function () {
        if (pgbar.className == "progressBar action") {
          pgbar.className = "progressBar";
          pgbar.style.width = "0%";
        }
      }, 5e3);
      break;
    case 1:
      pgbar.className = "progressBar finish";
      pgbar.style.width = "100%";
      setTimeout(function () {
        pgbar.className = "progressBar";
        pgbar.style.width = "0%";
      }, 2e3);
      break;
  }
};
clickToAddress.prototype.triggerSearch = function (target) {
  "use strict";
  var that = this;
  if (that.serviceReady === 0) {
    setTimeout(function () {
      that.triggerSearch(target);
    }, 250);
    return;
  }
  var event = document.createEvent("Event");
  event.initEvent("c2a-search", true, true);
  target.dispatchEvent(event);
};
