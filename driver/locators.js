
var SeleniumWebdriver = require("selenium-webdriver");

exports.title = SeleniumWebdriver.By.css(".gs_rt a");
exports.info = SeleniumWebdriver.By.css(".gs_a");
exports.cite = SeleniumWebdriver.By.css(".gs_fl a[href^='/scholar?cites=']");
exports.results = SeleniumWebdriver.By.css("#gs_ccl_results");
exports.hit = SeleniumWebdriver.By.css(".gs_r");
exports.captcha = SeleniumWebdriver.By.css("#gs_captcha_ccl, #captcha");
exports.next = SeleniumWebdriver.By.css("#gs_n .gs_ico_nav_next"); // "#gs_n .gs_ico_nav_next, #gs_nm .gs_wr"
exports.pdf = SeleniumWebdriver.By.css(".gs_ggs a[href$=\".pdf\"]")
