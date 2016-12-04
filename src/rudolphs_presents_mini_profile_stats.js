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

				html += "<span class='rudolphs-presents-stats-sent'>Presents Sent: <span>" + sent + "</span></span><br />";
				html += "<span class='rudolphs-presents-stats-received'>Presents Received: <span>" + received + "</span></span><br />";
				html += "<span class='rudolphs-presents-stats-tokens'>Present Tokens: <span>" + tokens + "</span></span><br />";

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