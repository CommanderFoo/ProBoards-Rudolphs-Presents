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