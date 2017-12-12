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