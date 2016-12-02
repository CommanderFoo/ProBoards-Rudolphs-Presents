/**
* @license
* The MIT License (MIT)
*
* Copyright (c) 2016 pixeldepth.net - http://support.proboards.com/user/2671
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$.widget("ui.rudolphs_presents", $.ui.dialog, {
	_create: function _create() {
		$.ui.dialog.prototype._create.call(this);

		this.uiDialog.addClass("rudolphs-presents-dialog");

		if (this.options.buttonPaneExtra) {
			this.uiDialog.find(".ui-dialog-buttonset").prepend(this.options.buttonPaneExtra);
		}
	}
});

var Rudolphs_Presents_Date = function () {
	function Rudolphs_Presents_Date() {
		_classCallCheck(this, Rudolphs_Presents_Date);

		this.ts = pb.data("serverDate");
		this.open_date = new Date(this.get_current_year() + "-12-02 0:00:00").getTime();
	}

	_createClass(Rudolphs_Presents_Date, [{
		key: "get_current_year",
		value: function get_current_year() {
			return new Date(this.ts).getFullYear();
		}
	}, {
		key: "get_time_left",
		value: function get_time_left() {
			var return_ts = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			var diff = this.open_date - this.ts;

			if (return_ts) {
				return diff;
			}

			var total_seconds = diff / 1000;
			var days = Math.floor(total_seconds / 24 / 60 / 60);
			var hours_left = Math.floor(total_seconds - days * 86400);
			var hours = Math.floor(hours_left / 3600);
			var minutes_left = Math.floor(hours_left - hours * 3600);
			var minutes = Math.floor(minutes_left / 60);
			var seconds = total_seconds % 60;

			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			var date_string = days + " day" + (days == 1 ? "" : "s") + ", " + hours + " hour" + (hours == 1 ? "" : "s") + ", " + minutes + " minute" + (minutes == 1 ? "" : "s") + ", " + seconds + " second" + (seconds == 1 ? "" : "s");
			return {

				days: days.toString(),
				hours: hours.toString(),
				minutes: minutes.toString(),
				seconds: seconds.toString(),
				full_string: date_string

			};
		}
	}]);

	return Rudolphs_Presents_Date;
}();

var Rudolphs_Presents_Info_Dialog = function Rudolphs_Presents_Info_Dialog() {
	var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var _ref$title = _ref.title;
	var title = _ref$title === undefined ? "Error" : _ref$title;
	var _ref$msg = _ref.msg;
	var msg = _ref$msg === undefined ? "An unknown error has occurred." : _ref$msg;
	var _ref$width = _ref.width;
	var width = _ref$width === undefined ? 350 : _ref$width;
	var _ref$height = _ref.height;
	var height = _ref$height === undefined ? 200 : _ref$height;

	_classCallCheck(this, Rudolphs_Presents_Info_Dialog);

	$("<div>" + msg + "</div>").dialog({

		title: title,
		modal: true,
		resizable: false,
		draggable: false,
		width: width,
		height: height,
		dialogClass: "rudolphs-presents-info-dialog"

	});
};

var Rudolphs_Presents_User_Data = function () {
	function Rudolphs_Presents_User_Data() {
		var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var data = arguments.length <= 1 || arguments[1] === undefined ? [{ t: 10, s: 0 }] : arguments[1];

		_classCallCheck(this, Rudolphs_Presents_User_Data);

		this._id = user_id;
		this._DATA = data;
	}

	_createClass(Rudolphs_Presents_User_Data, [{
		key: "save",
		value: function save() {
			var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			yootil.key.set(Rudolphs_Presents.PLUGIN_KEY, this._DATA, this._id, callback);
		}
	}, {
		key: "push",
		value: function push() {
			var item = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var callback = arguments[1];

			var current_data = yootil.key.value(Rudolphs_Presents.PLUGIN_KEY, this._id);

			if (!current_data) {
				yootil.key.set(Rudolphs_Presents.PLUGIN_KEY, this._DATA, this._id);
			}

			this._DATA.push(item);
			yootil.key.push(Rudolphs_Presents.PLUGIN_KEY, item, this._id, callback);
		}
	}, {
		key: "clear",
		value: function clear() {
			var key = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

			this._DATA = [];
		}
	}, {
		key: "set_tokens",
		value: function set_tokens() {
			var amount = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this._DATA[0].t = amount;
		}
	}, {
		key: "set_total_sent",
		value: function set_total_sent() {
			var amount = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this._DATA[0].s = amount;
		}
	}, {
		key: "get_tokens",
		value: function get_tokens() {
			return this._DATA[0].t;
		}
	}, {
		key: "get_total_sent",
		value: function get_total_sent() {
			return this._DATA[0].s;
		}
	}, {
		key: "get_data",
		value: function get_data() {
			return this._DATA;
		}
	}, {
		key: "set_data",
		value: function set_data() {
			var data = arguments.length <= 0 || arguments[0] === undefined ? [{ t: 10 }] : arguments[0];

			this._DATA = data;
		}
	}, {
		key: "get_presents",
		value: function get_presents() {
			return this._DATA.slice(1);
		}
	}]);

	return Rudolphs_Presents_User_Data;
}();

var Rudolphs_Presents_Sender = function () {
	function Rudolphs_Presents_Sender() {
		_classCallCheck(this, Rudolphs_Presents_Sender);

		// i = item id
		// u = from user id
		// n = from user username
		// s = seen notification
		// o = opened

		this.data = {

			s: 0,
			u: 0,
			n: "?",
			i: 0,
			o: 0

		};
	}

	_createClass(Rudolphs_Presents_Sender, [{
		key: "item",
		value: function item() {
			var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			this.data.i = id;
		}
	}, {
		key: "from",
		value: function from() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var name = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			this.data.u = user_id;
			this.data.n = name;
		}
	}, {
		key: "send",
		value: function send() {
			var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			if (opts && opts.user_id && this.data.i && this.data.u && this.data.n) {
				return Rudolphs_Presents.api.present(opts.user_id).push(this.data, opts);
			}

			new Rudolphs_Presents_Info_Dialog({

				title: "Rudolph's Presents - Error",
				msg: "An error has occurred [RPS:OPTSFALSE].",
				width: 350,
				height: 150

			});

			return false;
		}
	}, {
		key: "update_tokens",
		value: function update_tokens() {
			Rudolphs_Presents.api.decrease(yootil.user.id()).tokens(1);
			Rudolphs_Presents.api.save(yootil.user.id());
		}
	}, {
		key: "update_total_sent",
		value: function update_total_sent() {
			Rudolphs_Presents.api.increase(yootil.user.id()).presents_sent(1);
			Rudolphs_Presents.api.save(yootil.user.id());
		}
	}, {
		key: "has_space",
		value: function has_space(id) {
			var present_length = JSON.stringify(this.data).length;
			var total_used = Rudolphs_Presents.api.space(id).used() + present_length;

			if (total_used < pb.data("plugin_max_key_length") - 15) {
				return true;
			}

			return false;
		}
	}]);

	return Rudolphs_Presents_Sender;
}();

var Rudolphs_Presents_Button = function () {
	function Rudolphs_Presents_Button() {
		_classCallCheck(this, Rudolphs_Presents_Button);

		this.selected = null;
		this.item_dialog = null;
		this.create_button();
	}

	_createClass(Rudolphs_Presents_Button, [{
		key: "create_button",
		value: function create_button() {
			var $button = $("<a class='button' id='rudolphs-presents-button' href='#' role='button'>Rudolph's Presents</a>");
			var $conversation_button = $(".controls a.button[href^='/conversation/new/']");

			if ($conversation_button.length) {
				$button.insertBefore($conversation_button);
			}

			// Look for button as it may have manually been added to template

			$("#rudolphs-presents-button").on("click", this.show_item_dialog.bind(this));
		}
	}, {
		key: "show_item_dialog",
		value: function show_item_dialog() {
			var _this = this;

			// Does the user have enough tokens to send a present?

			var tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

			if (tokens <= 0) {
				new Rudolphs_Presents_Info_Dialog({

					title: "Rudolph's Presents - All Presents Sent",
					msg: "You currently have no more presents to send, however, you have a chance to earn more when you post.",
					width: 350,
					height: 150

				});

				return false;
			}

			// Has a present already been sent to this user?

			/*if(Rudolphs_Presents.api.present(yootil.page.member.id()).has_received_from(yootil.user.id())){
   	new Rudolphs_Presents_Info_Dialog({
   				title: "Rudolph's Presents - Already Sent",
   		msg: "You have already sent a present to this user, you can't send another.",
   		width: 350,
   		height: 150
   			});
   			return false;
   }*/

			if (!Rudolphs_Presents.api.space(yootil.page.member.id()).left()) {
				new Rudolphs_Presents_Info_Dialog({

					title: "Rudolph's Presents - Error",
					msg: "This user can't receive anymore presents, their inventory is completely full.",
					width: 350,
					height: 150

				});

				return false;
			}

			if (!this.item_dialog) {
				var list = this.build_items_list();

				this.item_dialog = $("<div></div>").html(list).rudolphs_presents({

					//(529)

					title: "Rudolph's Presents",
					resizable: true,
					draggable: true,
					modal: true,
					width: 720,
					height: 500,
					autoOpen: false,
					buttonPaneExtra: this.build_button_pane_extra(),
					buttons: [{

						text: "Send Present",
						click: this.send_present.bind(this),
						disabled: true,
						class: "rudolphs-presents-dialog-send-button",
						id: "rudolphs-presents-dialog-send-button"

					}, {

						text: "Close",
						click: function click() {
							return _this.item_dialog.rudolphs_presents("close");
						}

					}]

				});
			}

			$(".rudolphs-presents-dialog").find("span.rudolphs-presents-item").on("click", this.select_item.bind(this));

			this.item_dialog.rudolphs_presents("open");

			return false;
		}
	}, {
		key: "build_items_list",
		value: function build_items_list() {
			var list = "";

			for (var y = 0; y < 23; y++) {
				for (var x = 0; x < 23; x++) {
					var id = x + "_" + y;
					var x_offset = x * 64;
					var y_offset = y * 64;

					if (!y && !x) {
						x_offset += 2;
						y_offset += 2;
					} else {
						x_offset += 4 * x + 2;
						y_offset += 4 * y + 2;
					}

					list += "<span data-present-id='" + id + "' class='rudolphs-presents-item' style='background-image: url(\"" + Rudolphs_Presents.images.items + "\"); background-position: -" + x_offset + "px -" + y_offset + "px;'> </span>";
				}
			}

			return list;
		}
	}, {
		key: "send_present",
		value: function send_present() {
			var _this2 = this;

			var sender = new Rudolphs_Presents_Sender();

			sender.item(this.selected.id);
			sender.from(yootil.user.id(), yootil.user.username());

			if (sender.has_space(yootil.page.member.id())) {
				$("#rudolphs-presents-dialog-send-button").button("disable").addClass("rudolphs-presents-dialog-send-button");

				sender.send({

					user_id: yootil.page.member.id(),
					success: function success() {
						sender.update_tokens();
						sender.update_total_sent();

						_this2.reset_item_dialog();
						_this2.update_token_counter();

						new Rudolphs_Presents_Info_Dialog({

							title: "Rudolph's Presents - Present Sent",
							msg: "Your present was successfully sent.",
							width: 350,
							height: 150

						});
					},

					error: function error(status) {
						_this2.item_dialog.rudolphs_presents("close");
						_this2.reset_item_dialog();

						new Rudolphs_Presents_Info_Dialog({

							title: "Rudolph's Presents - Error",
							msg: "For some reason we could not deliver this present.<br /><br />Error: " + yootil.html_encode(status.message),
							width: 350,
							height: 150

						});
					}
				});
			} else {
				new Rudolphs_Presents_Info_Dialog({

					title: "Rudolph's Presents - Error",
					msg: "This user can't receive anymore presents, their inventory is completely full.",
					width: 350,
					height: 150

				});
			}
		}
	}, {
		key: "reset_item_dialog",
		value: function reset_item_dialog() {
			this.item_dialog.rudolphs_presents("close");

			if (this.selected) {
				this.selected.span.removeClass("rudolphs-presents-item-selected");
				this.selected = null;
			}
		}
	}, {
		key: "update_token_counter",
		value: function update_token_counter() {
			var tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

			$("#rudolphs-presents-presents-left-counter").text(parseInt(tokens, 10));
		}
	}, {
		key: "select_item",
		value: function select_item(evt) {
			var $span = $(evt.currentTarget);

			if (this.selected) {
				this.selected.span.removeClass("rudolphs-presents-item-selected");
			}

			$span.addClass("rudolphs-presents-item-selected");

			this.selected = {

				id: $span.attr("data-present-id"),
				span: $span

			};

			$("#rudolphs-presents-dialog-send-button").button("enable").removeClass("rudolphs-presents-dialog-send-button");
		}
	}, {
		key: "build_button_pane_extra",
		value: function build_button_pane_extra() {
			var $extra = $("<div class='rudolphs-presents-dialog-button-pane-extra'></div>");
			var tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

			$extra.append('<button type="button" id="rudolphs-presents-presents-left-button" class="ui-button"><span class="ui-button-text"><strong>Presents Left:</strong> <span id="rudolphs-presents-presents-left-counter">' + parseInt(tokens) + '</span></span></button>').on("click", function () {

				new Rudolphs_Presents_Info_Dialog({

					title: "Rudolph's Presents Left",
					msg: "This is the amount of presents you have left to send.<br /><br />When posting, you have chance to earn more.",
					width: 350,
					height: 160

				});
			});

			return $extra;
		}
	}]);

	return Rudolphs_Presents_Button;
}();

var Rudolphs_Presents_Profile_Box = function () {
	function Rudolphs_Presents_Profile_Box() {
		_classCallCheck(this, Rudolphs_Presents_Profile_Box);

		var user_id = yootil.page.member.id() || yootil.user.id();
		var presents = Rudolphs_Presents.api.get(user_id).presents();

		if (!presents.length) {
			return;
		}

		var $box = yootil.create.profile_content_box();
		var $first_box = $("form.form_user_status .content-box:first");
		var using_custom = false;
		var $profile_box = $("#rudolphs-presents-profile-presents");

		if ($profile_box.length) {
			$first_box = $profile_box;
			using_custom = true;
		}

		if ($first_box.length) {
			var items_html = "";

			for (var p = 0; p < presents.length; p++) {
				var x = parseInt(presents[p].i.split("_")[0], 10);
				var y = parseInt(presents[p].i.split("_")[1], 10);

				var x_offset = x * 64;
				var y_offset = y * 64;

				if (!y && !x) {
					x_offset += 2;
					y_offset += 2;
				} else {
					x_offset += 4 * x + 2;
					y_offset += 4 * y + 2;
				}

				var image = "";
				var pos = "";
				var title = "";
				var klass = "";
				var data_attr = "";

				// check date here and if present is opened or not

				if (Rudolphs_Presents.date.get_time_left(true) > 0 || !presents[p].o) {
					if (yootil.page.member.id() != yootil.user.id()) {
						title = "Hey! That is not your present, you can not open that.";
					} else {
						if (Rudolphs_Presents.date.get_time_left(true) <= 0) {
							title = "Present can be opened.";
						} else {
							title = "Present can be opened in " + Rudolphs_Presents.date.get_time_left().full_string + ".";
						}
					}

					klass = " rudolphs-presents-profile-presents-present-wiggle";
					image = Rudolphs_Presents.images[this.fetch_present_box(x, y)];
					data_attr = " data-present-not-opened='" + x_offset + "_" + y_offset + "_" + parseInt(presents[p].u, 10) + "'";
				} else {
					image = Rudolphs_Presents.images.items;
					pos = " background-position: -" + x_offset + "px -" + y_offset + "px;";
					title = "Present from " + yootil.html_encode(presents[p].n, true) + " (ID# " + presents[p].u + ").";
				}

				items_html += "<span title='" + title + "'" + data_attr + " data-present-id='" + presents[p].i + "' class='rudolphs-presents-profile-presents-present" + klass + "' style='background-image: url(\"" + image + "\");" + pos + "'></span>";
			}

			if (using_custom) {
				$first_box.addClass("rudolphs-presents-profile-presents").show().html(items_html);
			} else {
				$box.addClass("rudolphs-presents-profile-presents");
				$box.html(items_html);

				if (yootil.user.id() == yootil.page.member.id()) {
					$box.insertAfter($first_box);
				} else {
					$box.insertBefore($first_box);
				}
			}

			if (yootil.page.member.id() == yootil.user.id()) {
				if (Rudolphs_Presents.date.get_time_left(true) <= 0) {
					$(".rudolphs-presents-profile-presents").find("span[data-present-not-opened]").on("click", function () {
						var $span = $(this);
						var offsets = $span.attr("data-present-not-opened");
						var x_offset = offsets.split("_")[0];
						var y_offset = offsets.split("_")[1];
						var uid = offsets.split("_")[2];

						$span.removeClass("rudolphs-presents-profile-presents-present-wiggle");

						var css = {

							"background-image": "url(\"" + Rudolphs_Presents.images.items + "\")",
							"background-position": "-" + x_offset + "px -" + y_offset + "px"

						};

						if (typeof $span.get(0).style.animation !== "undefined") {
							$span.on("animationend", function () {
								$span.css(css).addClass("rudolphs-presents-profile-presents-present-show");
							});

							$span.addClass("rudolphs-presents-profile-presents-present-hide-present");
						} else {
							$span.css(css).addClass("rudolphs-presents-profile-presents-present-show");;
						}

						var present = Rudolphs_Presents.api.present(yootil.user.id()).open($span.attr("data-present-id"), uid);

						if (present) {
							$span.attr("title", "Present from " + yootil.html_encode(present.n, true) + " (ID# " + uid + ")");
						} else {
							$span.removeAttr("title");
						}
					});
				}
			}
		}
	}

	_createClass(Rudolphs_Presents_Profile_Box, [{
		key: "fetch_present_box",
		value: function fetch_present_box() {
			var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			var box = "a";
			var total = x * y;

			if (total > 462) {
				box = "h";
			} else if (total > 397) {
				box = "g";
			} else if (total > 331) {
				box = "f";
			} else if (total > 265) {
				box = "e";
			} else if (total > 199) {
				box = "d";
			} else if (total > 133) {
				box = "c";
			} else if (total > 67) {
				box = "b";
			}

			return box;
		}
	}]);

	return Rudolphs_Presents_Profile_Box;
}();

var Rudolphs_Presents = function () {
	function Rudolphs_Presents() {
		_classCallCheck(this, Rudolphs_Presents);
	}

	_createClass(Rudolphs_Presents, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_rudolphs_presents";
			this.PLUGIN_KEY = "pixeldepth_rudolphs_presents";
			this.images = {};
			this._KEY_DATA = new Map();

			this.setup_data();
			this.setup();
			this.date = new Rudolphs_Presents_Date();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			if (yootil.location.profile_home()) {
				if (yootil.user.logged_in() && yootil.user.id() != yootil.page.member.id()) {
					new Rudolphs_Presents_Button();
				}

				new Rudolphs_Presents_Profile_Box();
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				var plugin_settings = plugin.settings;

				this.images = plugin.images;
			}
		}
	}, {
		key: "setup_data",
		value: function setup_data() {
			var user_data = proboards.plugin.keys.data[this.PLUGIN_KEY];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.entries(user_data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2);

					var key = _step$value[0];
					var value = _step$value[1];

					var id = parseInt(key, 10) || 0;

					if (id && !this._KEY_DATA.has(id)) {
						value = !value ? [{ t: 10, s: 0 }] : value;

						this._KEY_DATA.set(id, new Rudolphs_Presents_User_Data(id, value));
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}]);

	return Rudolphs_Presents;
}();

Rudolphs_Presents.api = function () {
	function _class() {
		_classCallCheck(this, _class);
	}

	_createClass(_class, null, [{
		key: "data",
		value: function data() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var id = parseInt(user_id, 10);

			if (id > 0) {
				if (!Rudolphs_Presents._KEY_DATA.has(id)) {
					Rudolphs_Presents._KEY_DATA.set(id, new Rudolphs_Presents_User_Data(id, [{ t: 10, s: 0 }]));
				}

				return Rudolphs_Presents._KEY_DATA.get(id);
			}

			console.warn("Rudolph's Presents API: User ID not valid");

			return null;
		}
	}, {
		key: "clear",
		value: function clear() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				data: function data() {
					user_data.set_data([{ t: 10 }]);
				}
			};
		}
	}, {
		key: "get",
		value: function get() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				tokens: function tokens() {
					return user_data.get_tokens();
				},
				data: function data() {
					return user_data.get_data();
				},
				presents: function presents() {
					return user_data.get_presents();
				},
				presents_sent_from: function presents_sent_from(from_user_id) {
					var presents = Rudolphs_Presents.api.get(user_id).presents();

					for (var p = 0; p < presents.length; p++) {
						if (presents.u == from_user_id) {
							return true;
						}
					}

					return false;
				}
			};
		}
	}, {
		key: "set",
		value: function set() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				present_data: function present_data() {
					var presents = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

					var data = [Rudolphs_Presents.api.get(user_id).data()[0]];

					user_data._DATA = data.concat(presents);
				}
			};
		}
	}, {
		key: "increase",
		value: function increase() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				tokens: function tokens() {
					var amount = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

					var current_tokens = user_data.get_tokens() || 0;

					return user_data.set_tokens(current_tokens + parseFloat(amount));
				},
				presents_sent: function presents_sent() {
					var amount = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

					var current_sent = user_data.get_total_sent() || 0;

					return user_data.set_total_sent(current_sent + parseFloat(amount));
				}
			};
		}
	}, {
		key: "decrease",
		value: function decrease() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				tokens: function tokens() {
					var amount = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

					var current_tokens = user_data.get_tokens() || 0;

					return user_data.set_tokens(current_tokens - parseFloat(amount));
				}
			};
		}
	}, {
		key: "save",
		value: function save() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			var user_data = this.data(user_id);

			if (user_data) {
				user_data.save(callback);

				return true;
			}

			return false;
		}
	}, {
		key: "refresh_all_data",
		value: function refresh_all_data() {
			Rudolphs_Presents.setup_data();
		}
	}, {
		key: "clear_all_data",
		value: function clear_all_data() {
			Rudolphs_Presents._KEY_DATA.clear();
		}
	}, {
		key: "present",
		value: function present() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				has_received_from: function has_received_from(from_user_id) {
					var presents = Rudolphs_Presents.api.get(user_id).presents();

					for (var p = 0; p < presents.length; p++) {
						if (presents[p].u == from_user_id) {
							return true;
						}
					}

					return false;
				},
				push: function push() {
					var present = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
					var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

					return user_data.push(present, callback);
				},
				open: function open() {
					var puid = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
					var fuid = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

					if (puid) {
						var presents = Rudolphs_Presents.api.get(user_id).presents();

						for (var p = 0; p < presents.length; p++) {
							if (presents[p].i == puid && presents[p].u == fuid) {
								presents[p].o = 1;

								Rudolphs_Presents.api.set(user_id).present_data(presents);
								Rudolphs_Presents.api.save(user_id);

								return presents[p];
							}
						}
					}

					return null;
				}
			};
		}
	}, {
		key: "space",
		value: function space() {
			var user_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				used: function used() {
					return JSON.stringify(user_data.get_data()).length;
				},
				left: function left() {
					return pb.data("plugin_max_key_length") - Rudolphs_Presents.api.space(user_id).used();
				}
			};
		}
	}]);

	return _class;
}();


Rudolphs_Presents.init();