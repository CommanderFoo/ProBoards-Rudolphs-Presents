$.widget("ui.rudolphs_presents", $.ui.dialog, {

	_create(){
		$.ui.dialog.prototype._create.call(this);

		this.uiDialog.addClass("rudolphs-presents-dialog");

		if(this.options.buttonPaneExtra){
			this.uiDialog.find(".ui-dialog-buttonset").prepend(this.options.buttonPaneExtra);
		}
	}

});