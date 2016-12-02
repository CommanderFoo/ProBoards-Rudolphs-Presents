class Rudolphs_Presents_Info_Dialog {

	constructor({title = "Error", msg = "An unknown error has occurred.", width = 350, height = 200} = {}){
		$("<div>" + msg + "</div>").dialog({

			title,
			modal: true,
			resizable: false,
			draggable: false,
			width,
			height,
			dialogClass: "rudolphs-presents-info-dialog"

		});
	}

}