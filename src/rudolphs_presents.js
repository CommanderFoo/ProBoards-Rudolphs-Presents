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