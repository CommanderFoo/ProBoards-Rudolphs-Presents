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

$.widget("ui.rudolphs_presents", $.ui.dialog, {

	_create(){
		$.ui.dialog.prototype._create.call(this);

		this.uiDialog.addClass("rudolphs-presents-dialog");

		if(this.options.buttonPaneExtra){
			this.uiDialog.find(".ui-dialog-buttonset").prepend(this.options.buttonPaneExtra);
		}
	}

});

class Rudolphs_Presents_Notification {

	constructor(){
		let imgs = ["a", "b", "c", "d", "e", "f", "g", "h"];
		let image = Rudolphs_Presents.images[imgs[~~ (Math.random() * imgs.length)]];

		let $notification = $("<div title='You have received a present' class='rudolphs-presents-notification' style='background-image: url(\""  + image +"\");'></div>");

		$notification.fadeIn(1000, () => $notification.addClass("rudolphs-presents-notification-rotate"));
		$notification.on("click", this.mark_all_seen);

		$("body").append($notification);
	}

	mark_all_seen(){
		let $note = $(this);

		Rudolphs_Presents.api.present(yootil.user.id()).mark_all_seen();

		$note.fadeOut(1500, () => $note.remove());
	}

}

class Rudolphs_Presents_Date {

	constructor(){
		this.ts = pb.data("serverDate");
		this.open_date = new Date(this.get_current_year() + "-12-02 0:00:00").getTime();
	}

	get_current_year(){
		return new Date(this.ts).getFullYear();
	}

	get_time_left(return_ts = false){
		let diff = this.open_date - this.ts;

		if(return_ts){
			return diff;
		}

		let total_seconds = diff / 1000;
		let days = Math.floor(total_seconds / 24 / 60 / 60);
		let hours_left = Math.floor(total_seconds - (days * 86400));
		let hours = Math.floor(hours_left / 3600);
		let minutes_left = Math.floor(hours_left - ( hours * 3600));
		let minutes = Math.floor(minutes_left / 60);
		let seconds = total_seconds % 60;

		hours = (hours < 10)? "0" + hours : hours;
		minutes = (minutes < 10)? "0" + minutes : minutes;
		seconds = (seconds < 10)? "0" + seconds : seconds;

		let date_string = days + " day" + ((days == 1)? "" : "s") + ", " + hours + " hour" + ((hours == 1)? "" : "s") + ", " + minutes + " minute" + ((minutes == 1)? "" : "s") + ", " + seconds + " second" + ((seconds == 1)? "" : "s");
		return {

			days: days.toString(),
			hours: hours.toString(),
			minutes: minutes.toString(),
			seconds: seconds.toString(),
			full_string: date_string

		};
	}

}

class Rudolphs_Presents_Info_Dialog {

	constructor({title = "Error", msg = "An unknown error has occurred.", width = 350, height = 200} = {}){
		$("<div>" + msg + "</div>").dialog({

			title,
			modal: true,
			resizable: false,
			draggable: false,
			width,
			height,
			dialogClass: "rudolphs-presents-info-dialog"

		});
	}

}

class Rudolphs_Presents_User_Data {

	constructor(user_id = 0, data = [{t: 10, s: 0}]){
		this._id = user_id;
		this._DATA = data;
	}

	save(callback = null){
		yootil.key.set(Rudolphs_Presents.PLUGIN_KEY, this._DATA, this._id, callback);
	}

	push(item = null, callback){
		let current_data = yootil.key.value(Rudolphs_Presents.PLUGIN_KEY, this._id);

		if(!current_data){
			yootil.key.set(Rudolphs_Presents.PLUGIN_KEY, this._DATA, this._id);
		}

		this._DATA.push(item);
		yootil.key.push(Rudolphs_Presents.PLUGIN_KEY, item, this._id, callback);
	}

	clear(key = ""){
		this._DATA = [];
	}

	set_tokens(amount = 0){
		this._DATA[0].t = amount;
	}

	set_total_sent(amount = 0){
		this._DATA[0].s = amount;
	}

	get_tokens(){
		return this._DATA[0].t;
	}

	get_total_sent(){
		return this._DATA[0].s;
	}

	get_data(){
		return this._DATA;
	}

	set_data(data = [{t:10}]){
		this._DATA = data;
	}

	get_presents(){
		return this._DATA.slice(1);
	}

}

class Rudolphs_Presents_Sender {

	constructor(){

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

	item(id = null){
		this.data.i = id;
	}

	from(user_id = null, name = null){
		this.data.u = user_id;
		this.data.n = name;
	}

	send(opts = {}){
		if(opts && opts.user_id && this.data.i && this.data.u && this.data.n){
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

	update_tokens(){
		Rudolphs_Presents.api.decrease(yootil.user.id()).tokens(1);
		Rudolphs_Presents.api.save(yootil.user.id());
	}

	update_total_sent(){
		Rudolphs_Presents.api.increase(yootil.user.id()).presents_sent(1);
		Rudolphs_Presents.api.save(yootil.user.id());
	}

	has_space(id){
		let present_length = JSON.stringify(this.data).length;
		let total_used = Rudolphs_Presents.api.space(id).used() + present_length;

		if(total_used < (pb.data("plugin_max_key_length") - 15)){
			return true;
		}

		return false;
	}

}

class Rudolphs_Presents_Button {

	constructor(){
		this.selected = null;
		this.item_dialog = null;
		this.create_button();
	}

	create_button(){
		let $button = $("<a class='button' id='rudolphs-presents-button' href='#' role='button'>Rudolph's Presents</a>");
		let $conversation_button = $(".controls a.button[href^='/conversation/new/']");

		if($conversation_button.length){
			$button.insertBefore($conversation_button);
		}

		// Look for button as it may have manually been added to template

		$("#rudolphs-presents-button").on("click", this.show_item_dialog.bind(this));
	}

	show_item_dialog(){

		// Does the user have enough tokens to send a present?

		let tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

		if(tokens <= 0){
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

		if(!Rudolphs_Presents.api.space(yootil.page.member.id()).left()){
			new Rudolphs_Presents_Info_Dialog({

				title: "Rudolph's Presents - Error",
				msg: "This user can't receive anymore presents, their inventory is completely full.",
				width: 350,
				height: 150

			});

			return false;
		}

		if(!this.item_dialog){
			let list = this.build_items_list();

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
				buttons: [

					{

						text: "Send Present",
						click: this.send_present.bind(this),
						disabled: true,
						class: "rudolphs-presents-dialog-send-button",
						id: "rudolphs-presents-dialog-send-button"

					},

					{

						text: "Close",
						click: () => this.item_dialog.rudolphs_presents("close")

					}

				]


			});
		}

		$(".rudolphs-presents-dialog").find("span.rudolphs-presents-item").on("click", this.select_item.bind(this));

		this.item_dialog.rudolphs_presents("open");

		return false;
	}

	build_items_list(){
		let list = "";

		for(let y = 0; y < 23; y ++){
			for(let x = 0; x < 23; x ++){
				let id = x + "_" + y;
				let x_offset = x * 64;
				let y_offset = y * 64;

				if(!y && !x){
					x_offset += 2;
					y_offset += 2;
				} else {
					x_offset += (4 * x) + 2;
					y_offset += (4 * y) + 2;
				}

				list += "<span data-present-id='" + id + "' class='rudolphs-presents-item' style='background-image: url(\"" + Rudolphs_Presents.images.items + "\"); background-position: -" + x_offset + "px -" + y_offset + "px;'> </span>";
			}
		}

		return list;
	}

	send_present(){
		let sender = new Rudolphs_Presents_Sender();

		sender.item(this.selected.id);
		sender.from(yootil.user.id(), yootil.user.username());

		if(sender.has_space(yootil.page.member.id())){
			$("#rudolphs-presents-dialog-send-button").button("disable").addClass("rudolphs-presents-dialog-send-button");

			sender.send({

				user_id: yootil.page.member.id(),
				success: () => {
					sender.update_tokens();
					sender.update_total_sent();

					this.reset_item_dialog();
					this.update_token_counter();

					new Rudolphs_Presents_Info_Dialog({

						title: "Rudolph's Presents - Present Sent",
						msg: "Your present was successfully sent.",
						width: 350,
						height: 150

					});
				},

				error: (status) => {
					this.item_dialog.rudolphs_presents("close");
					this.reset_item_dialog();

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

	reset_item_dialog(){
		this.item_dialog.rudolphs_presents("close");

		if(this.selected){
			this.selected.span.removeClass("rudolphs-presents-item-selected");
			this.selected = null;
		}
	}

	update_token_counter(){
		let tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

		$("#rudolphs-presents-presents-left-counter").text(parseInt(tokens, 10));
	}

	select_item(evt){
		let $span = $(evt.currentTarget);

		if(this.selected){
			this.selected.span.removeClass("rudolphs-presents-item-selected");
		}

		$span.addClass("rudolphs-presents-item-selected");

		this.selected = {

			id: $span.attr("data-present-id"),
			span: $span

		}

		$("#rudolphs-presents-dialog-send-button").button("enable").removeClass("rudolphs-presents-dialog-send-button");
	}

	build_button_pane_extra(){
		let $extra = $("<div class='rudolphs-presents-dialog-button-pane-extra'></div>");
		let tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

		$extra.append('<button type="button" id="rudolphs-presents-presents-left-button" class="ui-button"><span class="ui-button-text"><strong>Presents Left:</strong> <span id="rudolphs-presents-presents-left-counter">' + parseInt(tokens) + '</span></span></button>').on("click", () => {

			new Rudolphs_Presents_Info_Dialog({

				title: "Rudolph's Presents Left",
				msg: "This is the amount of presents you have left to send.<br /><br />When posting, you have chance to earn more.",
				width: 350,
				height: 160

			});

		});

		return $extra;
	}

}

class Rudolphs_Presents_Profile_Box {

	constructor(){
		let user_id = yootil.page.member.id() || yootil.user.id();
		let presents = Rudolphs_Presents.api.get(user_id).presents();

		if(!presents.length){
			return;
		}

		let $box = yootil.create.profile_content_box();
		let $first_box = $("form.form_user_status .content-box:first");
		let using_custom = false;
		let $profile_box = $("#rudolphs-presents-profile-presents");

		if($profile_box.length){
			$first_box = $profile_box
			using_custom = true;
		}

		if($first_box.length){
			let items_html = "";

			for(let p = 0; p < presents.length; p ++){
				let x = parseInt(presents[p].i.split("_")[0], 10);
				let y = parseInt(presents[p].i.split("_")[1], 10);

				let x_offset = x * 64;
				let y_offset = y * 64;

				if(!y && !x){
					x_offset += 2;
					y_offset += 2;
				} else {
					x_offset += (4 * x) + 2;
					y_offset += (4 * y) + 2;
				}

				let image = "";
				let pos = "";
				let title = "";
				let klass = "";
				let data_attr = "";


				// check date here and if present is opened or not

				if(Rudolphs_Presents.date.get_time_left(true) > 0 || !presents[p].o){
					if(yootil.page.member.id() != yootil.user.id()){
						title = "Hey! That is not your present, you can not open that.";
					} else {
						if(Rudolphs_Presents.date.get_time_left(true) <= 0){
							title = "Present can be opened.";
						} else {
							title = "Present can be opened in " + Rudolphs_Presents.date.get_time_left().full_string + ".";
						}
					}

					klass = " rudolphs-presents-profile-presents-present-wiggle";
					image = Rudolphs_Presents.images[this.fetch_present_box(x, y)]
					data_attr = " data-present-not-opened='" + x_offset + "_" + y_offset + "_" + parseInt(presents[p].u, 10) + "'";
				} else {
					image = Rudolphs_Presents.images.items;
					pos = " background-position: -" + x_offset + "px -" + y_offset + "px;";
					title = "Present from " + yootil.html_encode(presents[p].n, true) + " (ID# " + presents[p].u + ").";
				}

				items_html += "<span title='" + title + "'" + data_attr + " data-present-id='" + presents[p].i + "' class='rudolphs-presents-profile-presents-present" + klass + "' style='background-image: url(\"" + image + "\");" + pos + "'></span>";
			}

			items_html = "<div class='rudolphs-presents-profile-presents-header'><span>Presents</span></div>" + items_html;

			if(using_custom){
				$first_box.addClass("rudolphs-presents-profile-presents").show().html(items_html);
			} else {
				$box.addClass("rudolphs-presents-profile-presents");
				$box.html(items_html);

				if(yootil.user.id() == yootil.page.member.id()){
					$box.insertAfter($first_box);
				} else {
					$box.insertBefore($first_box);
				}
			}

			if(yootil.page.member.id() == yootil.user.id()){
				if(Rudolphs_Presents.date.get_time_left(true) <= 0){
					$(".rudolphs-presents-profile-presents").find("span[data-present-not-opened]").on("click", function(){
						let $span = $(this);
						let offsets = $span.attr("data-present-not-opened");
						let x_offset = offsets.split("_")[0];
						let y_offset = offsets.split("_")[1];
						let uid = offsets.split("_")[2];

						$span.removeClass("rudolphs-presents-profile-presents-present-wiggle")

						let css = {

							"background-image": "url(\"" + Rudolphs_Presents.images.items + "\")",
							"background-position": "-" + x_offset + "px -" + y_offset + "px"

						};

						if(typeof($span.get(0).style.animation) !== "undefined"){
							$span.on("animationend", () => {
								$span.css(css).addClass("rudolphs-presents-profile-presents-present-show");
							});

							$span.addClass("rudolphs-presents-profile-presents-present-hide-present");
						} else {
							$span.css(css).addClass("rudolphs-presents-profile-presents-present-show");;
						}

						let present = Rudolphs_Presents.api.present(yootil.user.id()).open($span.attr("data-present-id"), uid);

						if(present){
							$span.attr("title", "Present from " + yootil.html_encode(present.n, true) + " (ID# " + uid + ").");
						} else {
							$span.removeAttr("title");
						}
					});
				}
			}
		}
	}

	fetch_present_box(x = 0, y = 0){
		let box = "a";
		let total = x * y;

		if(total > 462){
			box = "h";
		} else if(total > 397){
			box = "g";
		} else if(total > 331){
			box = "f";
		} else if(total > 265){
			box = "e";
		} else if(total > 199){
			box = "d";
		} else if(total > 133){
			box = "c";
		} else if(total > 67){
			box = "b";
		}

		return box;
	}

}

class Rudolphs_Presents {

	static init(){
		this.PLUGIN_ID = "pd_rudolphs_presents";
		this.PLUGIN_KEY = "pixeldepth_rudolphs_presents";
		this.images = {};
		this._KEY_DATA = new Map();

		this.setup_data();
		this.setup();
		this.date = new Rudolphs_Presents_Date();

		$(this.ready.bind(this));
	}

	static ready(){
		if(yootil.location.profile_home()){
			if(yootil.user.logged_in() && yootil.user.id() != yootil.page.member.id()){
				new Rudolphs_Presents_Button();
			}

			new Rudolphs_Presents_Profile_Box();
		}

		if(yootil.user.logged_in()){
			this.show_present_notification();
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			let plugin_settings = plugin.settings;

			this.images = plugin.images;
		}
	}

	static setup_data(){
		let user_data = proboards.plugin.keys.data[this.PLUGIN_KEY];

		for(let [key, value] of Object.entries(user_data)){
			let id = parseInt(key, 10) || 0;

			if(id && !this._KEY_DATA.has(id)){
				value = (!value)? [{t: 10, s: 0}] : value;

				this._KEY_DATA.set(id, new Rudolphs_Presents_User_Data(id, value));
			}
		}
	}

	static show_present_notification(){
		if(this.api.present(yootil.user.id()).unseen()){
			new Rudolphs_Presents_Notification();
		}
	}

}

Rudolphs_Presents.api = class {

	static data(user_id = 0){
		let id = parseInt(user_id, 10);

		if(id > 0){
			if(!Rudolphs_Presents._KEY_DATA.has(id)){
				Rudolphs_Presents._KEY_DATA.set(id, new Rudolphs_Presents_User_Data(id, [{t: 10, s: 0}]));
			}

			return Rudolphs_Presents._KEY_DATA.get(id);
		}

		console.warn("Rudolph's Presents API: User ID not valid");

		return null;
	}

	static clear(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			data(){
				user_data.set_data([{t: 10, s: 0}]);
			}

		};
	}

	static get(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			tokens(){
				return user_data.get_tokens();
			},

			data(){
				return user_data.get_data();
			},

			presents(){
				return user_data.get_presents();
			},

			presents_sent_from(from_user_id){
				let presents = Rudolphs_Presents.api.get(user_id).presents();

				for(let p = 0; p < presents.length; p ++){
					if(presents.u == from_user_id){
						return true;
					}
				}

				return false;
			}

		};
	}

	static set(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			present_data(presents = []){
				let data = [Rudolphs_Presents.api.get(user_id).data()[0]];

				user_data._DATA = data.concat(presents);
			}

		};
	}

	static increase(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			tokens(amount = 0){
				let current_tokens = user_data.get_tokens() || 0;

				return user_data.set_tokens(current_tokens + parseFloat(amount));
			},

			presents_sent(amount = 0){
				let current_sent = user_data.get_total_sent() || 0;

				return user_data.set_total_sent(current_sent + parseFloat(amount));
			}

		};
	}

	static decrease(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			tokens(amount = 0){
				let current_tokens = user_data.get_tokens() || 0;

				return user_data.set_tokens(current_tokens - parseFloat(amount));
			}

		};
	}

	static save(user_id = 0, callback = null){
		let user_data = this.data(user_id);

		if(user_data){
			user_data.save(callback);

			return true;
		}

		return false;
	}

	static refresh_all_data(){
		Rudolphs_Presents.setup_data();
	}

	static clear_all_data(){
		Rudolphs_Presents._KEY_DATA.clear();
	}

	static present(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			has_received_from(from_user_id){
				let presents = Rudolphs_Presents.api.get(user_id).presents();

				for(let p = 0; p < presents.length; p ++){
					if(presents[p].u == from_user_id){
						return true;
					}
				}

				return false;
			},

			push(present = {}, callback = null){
				return user_data.push(present, callback);
			},

			open(puid = "", fuid = 0){
				if(puid){
					let presents = Rudolphs_Presents.api.get(user_id).presents();

					for(let p = 0; p < presents.length; p ++){
						if(presents[p].i == puid && presents[p].u == fuid){
							presents[p].o = 1;
							presents[p].s = 1;

							Rudolphs_Presents.api.set(user_id).present_data(presents);
							Rudolphs_Presents.api.save(user_id);

							return presents[p];
						}
					}
				}

				return null;
			},

			unseen(){
				let presents = Rudolphs_Presents.api.get(user_id).presents();

				for(let p = 0; p < presents.length; p ++){
					if(!presents[p].o && !presents[p].s){
						return true;
					}
				}

				return false;
			},

			mark_all_seen(){
				let presents = Rudolphs_Presents.api.get(user_id).presents();

				for(let p = 0; p < presents.length; p ++){
					presents[p].s = 1;
				}

				Rudolphs_Presents.api.set(user_id).present_data(presents);
				Rudolphs_Presents.api.save(user_id);
			}

		};
	}

	static space(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			used(){
				return JSON.stringify(user_data.get_data()).length;
			},

			left(){
				return (pb.data("plugin_max_key_length") - Rudolphs_Presents.api.space(user_id).used());
			}

		}
	}

};

Rudolphs_Presents.init();