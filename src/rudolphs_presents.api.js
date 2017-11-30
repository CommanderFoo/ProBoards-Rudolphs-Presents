Rudolphs_Presents.api = class {

	static init(){
		this._sync = new Rudolphs_Presents_Sync(this.get(yootil.user.id()).data(), Rudolphs_Presents_Sync_Handler);
	}

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