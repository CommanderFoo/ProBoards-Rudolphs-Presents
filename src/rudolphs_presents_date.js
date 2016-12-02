class Rudolphs_Presents_Date {

	constructor(){
		this.ts = pb.data("serverDate");
		this.open_date = new Date(this.get_current_year() + "-12-25 0:00:00").getTime();
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