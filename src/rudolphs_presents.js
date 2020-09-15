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