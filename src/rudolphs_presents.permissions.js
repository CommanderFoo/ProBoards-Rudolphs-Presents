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