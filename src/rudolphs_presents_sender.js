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