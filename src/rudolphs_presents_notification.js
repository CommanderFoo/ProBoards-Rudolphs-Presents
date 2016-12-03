class Rudolphs_Presents_Notification {

	constructor(){
		let imgs = ["a", "b", "c", "d", "e", "f", "g", "h"];
		let image = Rudolphs_Presents.images[imgs[~~ (Math.random() * imgs.length)]];

		let $notification = $("<div title='You have received a present' class='rudolphs-presents-notification' style='background-image: url(\""  + image +"\");'></div>");

		$notification.fadeIn(1000, () => $notification.addClass("rudolphs-presents-notification-rotate"));
		$notification.on("click", this.mark_all_seen);

		$("body").append($notification);
	}

	mark_all_seen(){
		let $note = $(this);

		Rudolphs_Presents.api.present(yootil.user.id()).mark_all_seen();

		$note.fadeOut(1500, () => $note.remove());
	}

}