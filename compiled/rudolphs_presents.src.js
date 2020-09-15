/**
* @license
* The MIT License (MIT)
*
* Copyright (c) 2020 pixeldepth.net - http://support.proboards.com/user/2671
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

		let $notification = $("<div title='You have received a " + Rudolphs_Presents.get_text("present", true) + "' class='rudolphs-presents-notification' style='background-image: url(\""  + image +"\");'></div>");

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
		this.open_date = new Date(this.get_current_year(), 11, 25, 0, 0, 0).getTime();
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
		return parseInt(this._DATA[0].t, 10);
	}

	get_total_sent(){
		return parseInt(this._DATA[0].s, 10);
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
		let $button = $("<a class='button' id='rudolphs-presents-button' href='#' role='button'>" + Rudolphs_Presents.get_text("profile_button") + "</a>");
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

		if(tokens <= 0 && !Rudolphs_Presents.api.get(yootil.user.id()).unlimited()){
			new Rudolphs_Presents_Info_Dialog({

				title: Rudolphs_Presents.get_text("dialog_title") + " - No " + Rudolphs_Presents.get_text("token") + "s",
				msg: "You currently have no more " + Rudolphs_Presents.get_text("token", true) + "s, however, you have a chance to earn more when you post.",
				width: 350,
				height: 150

			});

			return false;
		}

		// Has a present already been sent max allowed presents to this user?

		if(Rudolphs_Presents.api.present(yootil.page.member.id()).has_received_max_from(yootil.user.id())){
			new Rudolphs_Presents_Info_Dialog({

				title: Rudolphs_Presents.get_text("dialog_title") + " - Maximum Sent",
				msg: "You have already sent the maximum amount of " + Rudolphs_Presents.get_text("present", true) + "s to this user, you can't send anymore.",
				width: 350,
				height: 150

			});

			return false;
		}

		if(!Rudolphs_Presents.api.space(yootil.page.member.id()).left()){
			new Rudolphs_Presents_Info_Dialog({

				title: Rudolphs_Presents.get_text("dialog_title") + " - Error",
				msg: "This user can't receive anymore " + Rudolphs_Presents.get_text("present", true) + "s, their inventory is full.",
				width: 350,
				height: 150

			});

			return false;
		}

		if(!this.item_dialog){
			let list = this.build_items_list();

			this.item_dialog = $("<div></div>").html(list).rudolphs_presents({

				//(529)

				title: Rudolphs_Presents.get_text("dialog_title"),
				resizable: true,
				draggable: true,
				modal: true,
				width: 720,
				height: 500,
				autoOpen: false,
				buttonPaneExtra: this.build_button_pane_extra(),
				buttons: [

					{

						text: "Send",
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

					if(!Rudolphs_Presents.api.get(yootil.user.id()).unlimited()){
						sender.update_tokens();
					}

					sender.update_total_sent();

					this.reset_item_dialog();
					this.update_token_counter();

					Rudolphs_Presents.api.sync(yootil.user.id());

					new Rudolphs_Presents_Info_Dialog({

						title: Rudolphs_Presents.get_text("dialog_title") + " - " + Rudolphs_Presents.get_text("present") + " Sent",
						msg: "Your " + Rudolphs_Presents.get_text("present", true) + " was successfully sent.",
						width: 350,
						height: 150

					});
				},

				error: (status) => {
					this.item_dialog.rudolphs_presents("close");
					this.reset_item_dialog();

					new Rudolphs_Presents_Info_Dialog({

						title: Rudolphs_Presents.get_text("token") + " - Error",
						msg: "For some reason we could not deliver this item.<br /><br />Error: " + yootil.html_encode(status.message),
						width: 350,
						height: 150

					});
				}
			});
		} else {
			new Rudolphs_Presents_Info_Dialog({

				title: Rudolphs_Presents.get_text("dialog_title") + " - Error",
				msg: "This user can't receive anymore items, their inventory is full.",
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

		if(Rudolphs_Presents.api.get(yootil.user.id()).unlimited()){
			tokens = "Unlimited";
		} else {
			tokens = parseInt(tokens, 10); // Should move parsing to the tokens method really.
		}

		$("#rudolphs-presents-presents-left-counter").text(tokens);
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

		if(Rudolphs_Presents.api.get(yootil.user.id()).unlimited()){
			tokens = "Unlimited";
		} else {
			tokens = parseInt(tokens, 10); // Should move parsing to the tokens method really.
		}

		$extra.append('<button type="button" id="rudolphs-presents-presents-left-button" class="ui-button"><span class="ui-button-text"><strong>Present Tokens:</strong> <span id="rudolphs-presents-presents-left-counter">' + tokens + '</span></span></button>').on("click", () => {

			new Rudolphs_Presents_Info_Dialog({

				title: Rudolphs_Presents.get_text("dialog_title") + " - " + Rudolphs_Presents.get_text("token") + "s",
				msg: "This is the amount of items you have left to send.<br /><br />When posting, you have chance to earn more.",
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
						title = "Hey! That is not your " + Rudolphs_Presents.get_text("present", true) + ", you can not open that.";
					} else {
						if(Rudolphs_Presents.date.get_time_left(true) <= 0){
							title = Rudolphs_Presents.get_text("present") + " can be opened.";
						} else {
							title = Rudolphs_Presents.get_text("present") + " can be opened in " + Rudolphs_Presents.date.get_time_left().full_string + ".";
						}
					}

					klass = " rudolphs-presents-profile-presents-present-wiggle";
					image = Rudolphs_Presents.images[this.fetch_present_box(x, y)]
					data_attr = " data-present-not-opened='" + x_offset + "_" + y_offset + "_" + parseInt(presents[p].u, 10) + "'";
				} else {
					image = Rudolphs_Presents.images.items;
					pos = " background-position: -" + x_offset + "px -" + y_offset + "px;";
					title = Rudolphs_Presents.get_text("present") + " from " + pb.text.escape_html(presents[p].n) + " (ID# " + parseInt(presents[p].u, 10) + ").";
				}

				if(yootil.page.member.id() == yootil.user.id() && Rudolphs_Presents.permissions.member_banned()){
					title = "You can never open this " + Rudolphs_Presents.get_text("present", true) + ", you are banned.";
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

			if(yootil.page.member.id() == yootil.user.id() && !Rudolphs_Presents.permissions.member_banned()){
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
							$span.attr("title", Rudolphs_Presents.get_text("present") + " from " + yootil.html_encode(present.n, true) + " (ID# " + uid + ").");
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

class Rudolphs_Presents_Mini_Profile_Stats {

	constructor(){
		this.using_custom = false;
		this.add_stats_to_mini_profiles();
		yootil.event.after_search(this.add_stats_to_mini_profiles, this);
	}

	add_stats_to_mini_profiles(){
		let $mini_profiles = yootil.get.mini_profiles();

		if(!$mini_profiles.length || $mini_profiles.find(".rudolphs-presents-user-stats").length){
			return;
		}

		$mini_profiles.each((index, item) => {
			let $mini_profile = $(item);
			let $elem = $mini_profile.find(".rudolphs-presents-user-stats");
			let $user_link = $mini_profile.find("a.user-link[href*='user/']");
			let $info = $mini_profile.find(".info");

			if(!$elem.length && !$info.length){
				console.warn("Rudolph's Presents Mini Profile: No info element found.");
				return;
			}

			if($user_link.length){
				let user_id_match = $user_link.attr("href").match(/\/user\/(\d+)\/?/i);

				if(!user_id_match || !parseInt(user_id_match[1], 10)){
					console.warn("Rudolph's Presents Mini Profile: Could not match user link.");
					return;
				}

				Rudolphs_Presents.api.refresh_all_data();

				let user_id = parseInt(user_id_match[1], 10);
				let using_info = false;

				if($elem.length){
					this.using_custom = true;
				} else {
					using_info = true;
					$elem = $("<div class='rudolphs-presents-user-stats'></div>");
				}

				let sent = yootil.number_format(Rudolphs_Presents.api.get(user_id).total_presents_sent());
				let received = yootil.number_format(Rudolphs_Presents.api.get(user_id).total_presents_received());
				let tokens = yootil.number_format(Rudolphs_Presents.api.get(user_id).tokens());

				let html = "";

				html += "<span class='rudolphs-presents-stats-sent'>" + Rudolphs_Presents.get_text("present") + "s Sent: <span>" + sent + "</span></span><br />";
				html += "<span class='rudolphs-presents-stats-received'>" + Rudolphs_Presents.get_text("present") + "s Received: <span>" + received + "</span></span><br />";
				html += "<span class='rudolphs-presents-stats-tokens'>" + Rudolphs_Presents.get_text("present") + " " + Rudolphs_Presents.get_text("token") + "s: <span>" + tokens + "</span></span><br />";

				$elem.html(html);

				if(using_info){
					$info.prepend($elem);
				}

				$elem.show();
			} else {
				console.warn("Rudolph's Presents Mini Profile: Could not find user link.");
			}

		});
	}

};

class Rudolphs_Presents_Post_Chance {

	constructor(){
		this._submitted = false;
		this._tokens_added = 0;
		this._hook = "";
		this.init();
	}

	 init(){
		this._hook = (yootil.location.posting_thread())? "thread_new" : ((yootil.location.thread())? "post_quick_reply" : "post_new");

		 let $the_form = yootil.form.any_posting();

		if($the_form.length){
			$the_form.on("submit", () => {
				this._submitted = true;
				this.set_on();
			});
		}
	 }

	set_on(){
		if(!yootil.location.editing()){
			let user_id = yootil.user.id();
			let tokens_to_add = this.token_chance();

			if(tokens_to_add){
				if(this._submitted){
					if(this._tokens_added){
						Rudolphs_Presents.api.decrease(user_id).tokens(this._tokens_added);
					}

					this._tokens_added = tokens_to_add;

					Rudolphs_Presents.api.increase(user_id).tokens(tokens_to_add);
					yootil.key.set_on(Rudolphs_Presents.PLUGIN_KEY, Rudolphs_Presents.api.get(user_id).data(), user_id, this._hook);
					Rudolphs_Presents.api.sync(yootil.user.id());
				}
			}
		}
	}

	token_chance(){
		let current_tokens = Rudolphs_Presents.api.get(yootil.user.id()).tokens();

		if(current_tokens > 0){
			return;
		}

		let rand = Math.random() * 100;
		let tokens = 0;

		if(rand < 1){
			tokens = 15;
		} else if(rand < 10){
			tokens = 8;
		} else if(rand < 40){
			tokens = 5;
		} else if(rand < 50){
			tokens = 4;
		} else if(rand < 60){
			tokens = 3;
		} else if(rand < 70){
			tokens = 2;
		} else if(rand < 80){
			tokens = 1;
		}

		return tokens;
	}

}

class Rudolphs_Presents {

	static init(){
		this.PLUGIN_ID = "pd_rudolphs_presents";
		this.PLUGIN_KEY = "pixeldepth_rudolphs_presents";

		this._KEY_DATA = new Map();

		this.images = {};
		this.settings = {};

		this.setup();
		this.setup_data();

		this.api.init();

		this.date = new Rudolphs_Presents_Date();

		$(this.ready.bind(this));
	}

	static ready(){
		if(yootil.location.profile_home()){
			if(!this.permissions.member_banned() && this.permissions.group_can_send_presents()){
				if(yootil.user.logged_in() && yootil.user.id() != yootil.page.member.id()){
					new Rudolphs_Presents_Button();
				}
			}

			new Rudolphs_Presents_Profile_Box();
		}

		if(yootil.user.logged_in() && !this.permissions.member_banned()){
			this.show_present_notification();
		}

		let location_check = (

			yootil.location.search_results() ||
			yootil.location.message_thread() ||
			yootil.location.thread() ||
			yootil.location.recent_posts()

		);

		if(location_check){
			new Rudolphs_Presents_Mini_Profile_Stats();
		}

		if(!this.permissions.member_banned()){
			if((yootil.location.posting() || yootil.location.thread())){
				new Rudolphs_Presents_Post_Chance();
			}
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			this.settings = plugin.settings;
			this.images = plugin.images;

			this.settings.text = {

				profile_button: this.settings.profile_button_text,
				dialog_title: this.settings.dialog_title_text,
				present: this.settings.present_text,
				token: this.settings.token_text

			};

			this.settings.starting_tokens = parseInt(this.settings.starting_tokens, 10) || 10;
		}
	}

	static setup_data(){
		let user_data = proboards.plugin.keys.data[this.PLUGIN_KEY];

		for(let key in user_data){
			let id = parseInt(key, 10) || 0;

			if(id && !this._KEY_DATA.has(id)){
				let value = (!user_data[key])? [{t: this.settings.starting_tokens, s: 0}] : user_data[key];

				this._KEY_DATA.set(id, new Rudolphs_Presents_User_Data(id, value));
			}
		}
	}

	static show_present_notification(){
		if(this.api.present(yootil.user.id()).unseen()){
			new Rudolphs_Presents_Notification();
		}
	}

	static get_text(key, lower = false){
		return (lower)? this.settings.text[key].toLowerCase() : this.settings.text[key];
	}

}

Rudolphs_Presents.permissions = class {

	static member_banned(user_id = 0){
		if(!Rudolphs_Presents.settings.banned_members.length){
			return false;
		}

		user_id = user_id || yootil.user.id();

		if($.inArrayLoose(user_id, Rudolphs_Presents.settings.banned_members) > -1){
			return true;
		}

		return false;
	}

	static group_can_send_presents(){
		if(!Rudolphs_Presents.settings.allowed_to_send.length){
			return true;
		}

		let user_groups = yootil.user.group_ids();

		for(let g = 0, l = user_groups.length; g < l; g ++){
			if($.inArrayLoose(user_groups[g], Rudolphs_Presents.settings.allowed_to_send) > -1){
				return true;
			}
		}

		return false;
	}

}

Rudolphs_Presents.api = class {

	static init(){
		let data = (yootil.user.logged_in())? this.get(yootil.user.id()).data() : {};

		this._sync = new Rudolphs_Presents_Sync(data, Rudolphs_Presents_Sync_Handler);
	}

	static data(user_id = 0){
		let id = parseInt(user_id, 10);

		if(id > 0){
			if(!Rudolphs_Presents._KEY_DATA.has(id)){
				Rudolphs_Presents._KEY_DATA.set(id, new Rudolphs_Presents_User_Data(id, [{t: Rudolphs_Presents.settings.starting_tokens, s: 0}]));
			}

			return Rudolphs_Presents._KEY_DATA.get(id);
		}

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

			unlimited(){
				if(yootil.user.is_staff() && $.inArrayLoose(user_id, Rudolphs_Presents.settings.unlimited_keys) > -1){
					return true;
				}

				return false;
			},

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
			},

			total_presents_sent(){
				return user_data.get_total_sent();
			},

			total_presents_received(){
				return Rudolphs_Presents.api.get(user_id).presents().length || 0;
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
			},

			data(data){
				user_data._DATA = data;
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

				return user_data.set_tokens(current_tokens + parseInt(amount, 10));
			},

			presents_sent(amount = 0){
				let current_sent = user_data.get_total_sent() || 0;

				return user_data.set_total_sent(current_sent + parseInt(amount, 10));
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
				let new_amount = current_tokens - parseInt(amount, 10);

				// Saftey for negative (should never be possible)

				if(new_amount < 0){
					new_amount = 0;
				}

				return user_data.set_tokens(new_amount);
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

			has_received_max_from(from_user_id){
				let presents = Rudolphs_Presents.api.get(user_id).presents();
				let counter = 0;

				for(let p = 0; p < presents.length; p ++){
					if(presents[p].u == from_user_id){
						counter ++;
					}
				}

				if(counter >= 3){
					return true;
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

	static sync(user_id){
		if(user_id != yootil.user.id()){
			return;
		}

		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		this._sync.update(user_data.get_data());
	}

};

class Rudolphs_Presents_Sync {

	constructor(data = {}, handler = null){
		if(!handler || typeof handler.change == "undefined"){
			return;
		}

		this._trigger_caller = false;
		this._handler = handler;
		this._key = "rudolphs_presents_data_sync_" + yootil.user.id();

		// Need to set the storage off the bat

		yootil.storage.set(this._key, data, true, true);

		// Delay adding event (IE issues yet again)

		setTimeout(() => $(window).on("storage", (evt) => {
			if(evt && evt.originalEvent && evt.originalEvent.key == this._key){

				// IE fix

				if(this._trigger_caller){
					this._trigger_caller = false;
					return;
				}

				let event = evt.originalEvent;
				let old_data = event.oldValue;
				let new_data = event.newValue;

				// If old == new, don't do anything

				if(old_data != new_data){
					this._handler.change(JSON.parse(new_data), JSON.parse(old_data));
				}
			}
		}), 100);
	}

	// For outside calls to trigger a manual update

	update(data = {}){
		this._trigger_caller = true;
		yootil.storage.set(this._key, data, true, true);
	}

	get key(){
		return this._key;
	}

};

class Rudolphs_Presents_Sync_Handler {

	static change(new_data, old_data){
		this._new_data = new_data;
		this._old_data = old_data;

		Rudolphs_Presents.api.set(yootil.user.id()).data(this._new_data);

		$(this.ready.bind(this));
	}

	static ready(){
		this.update_mini_profile();
	}

	static update_mini_profile(){
		let location_check = (

			yootil.location.search_results() ||
			yootil.location.message_thread() ||
			yootil.location.thread() ||
			yootil.location.recent_posts()

		);

		if(location_check){
			let user_id = yootil.user.id();
			let $mini_profiles = yootil.get.mini_profiles(user_id);

			if($mini_profiles.length){
				let $elems = $mini_profiles.find(".rudolphs-presents-user-stats");

				if($elems.length){
					let $sent = $elems.find(".rudolphs-presents-stats-sent span");

					if($sent.length){
						$sent.text(yootil.number_format(Rudolphs_Presents.api.get(user_id).total_presents_sent()))
					}

					let $received = $elems.find(".rudolphs-presents-stats-received span");

					if($received.length){
						$received.text(yootil.number_format(Rudolphs_Presents.api.get(user_id).total_presents_received()))
					}

					let $tokens = $elems.find(".rudolphs-presents-stats-tokens span");

					if($tokens.length){
						$tokens.text(yootil.number_format(Rudolphs_Presents.api.get(user_id).tokens()))
					}
				}
			}
		}
	}

	static get old_data(){
		return this._old_data;
	}

	static get new_data(){
		return this._new_data;
	}

};

Rudolphs_Presents.init();