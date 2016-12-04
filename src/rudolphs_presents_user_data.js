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