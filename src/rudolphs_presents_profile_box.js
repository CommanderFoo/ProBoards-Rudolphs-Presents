class Rudolphs_Presents_Profile_Box {

	constructor(){
		let user_id = yootil.page.member.id() || yootil.user.id();
		let presents = Rudolphs_Presents.api.get(user_id).presents();

		if(!presents.length){
			return;
		}

		let $box = yootil.create.profile_content_box();
		let $first_box = $("form.form_user_status .content-box:first");
		let using_custom = false;
		let $profile_box = $("#rudolphs-presents-profile-presents");

		if($profile_box.length){
			$first_box = $profile_box
			using_custom = true;
		}

		if($first_box.length){
			let items_html = "";

			for(let p = 0; p < presents.length; p ++){
				let x = parseInt(presents[p].i.split("_")[0], 10);
				let y = parseInt(presents[p].i.split("_")[1], 10);

				let x_offset = x * 64;
				let y_offset = y * 64;

				if(!y && !x){
					x_offset += 2;
					y_offset += 2;
				} else {
					x_offset += (4 * x) + 2;
					y_offset += (4 * y) + 2;
				}

				let image = "";
				let pos = "";
				let title = "";
				let klass = "";
				let data_attr = "";


				// check date here and if present is opened or not

				if(Rudolphs_Presents.date.get_time_left(true) > 0 || !presents[p].o){
					if(yootil.page.member.id() != yootil.user.id()){
						title = "Hey! That is not your present, you can not open that.";
					} else {
						if(Rudolphs_Presents.date.get_time_left(true) <= 0){
							title = "Present can be opened.";
						} else {
							title = "Present can be opened in " + Rudolphs_Presents.date.get_time_left().full_string + ".";
						}
					}

					klass = " rudolphs-presents-profile-presents-present-wiggle";
					image = Rudolphs_Presents.images[this.fetch_present_box(x, y)]
					data_attr = " data-present-not-opened='" + x_offset + "_" + y_offset + "_" + parseInt(presents[p].u, 10) + "'";
				} else {
					image = Rudolphs_Presents.images.items;
					pos = " background-position: -" + x_offset + "px -" + y_offset + "px;";
					title = "Present from " + yootil.html_encode(presents[p].n, true) + " (ID# " + presents[p].u + ").";
				}

				items_html += "<span title='" + title + "'" + data_attr + " data-present-id='" + presents[p].i + "' class='rudolphs-presents-profile-presents-present" + klass + "' style='background-image: url(\"" + image + "\");" + pos + "'></span>";
			}

			items_html = "<div class='rudolphs-presents-profile-presents-header'><span>Presents</span></div>" + items_html;

			if(using_custom){
				$first_box.addClass("rudolphs-presents-profile-presents").show().html(items_html);
			} else {
				$box.addClass("rudolphs-presents-profile-presents");
				$box.html(items_html);

				if(yootil.user.id() == yootil.page.member.id()){
					$box.insertAfter($first_box);
				} else {
					$box.insertBefore($first_box);
				}
			}

			if(yootil.page.member.id() == yootil.user.id()){
				if(Rudolphs_Presents.date.get_time_left(true) <= 0){
					$(".rudolphs-presents-profile-presents").find("span[data-present-not-opened]").on("click", function(){
						let $span = $(this);
						let offsets = $span.attr("data-present-not-opened");
						let x_offset = offsets.split("_")[0];
						let y_offset = offsets.split("_")[1];
						let uid = offsets.split("_")[2];

						$span.removeClass("rudolphs-presents-profile-presents-present-wiggle")

						let css = {

							"background-image": "url(\"" + Rudolphs_Presents.images.items + "\")",
							"background-position": "-" + x_offset + "px -" + y_offset + "px"

						};

						if(typeof($span.get(0).style.animation) !== "undefined"){
							$span.on("animationend", () => {
								$span.css(css).addClass("rudolphs-presents-profile-presents-present-show");
							});

							$span.addClass("rudolphs-presents-profile-presents-present-hide-present");
						} else {
							$span.css(css).addClass("rudolphs-presents-profile-presents-present-show");;
						}

						let present = Rudolphs_Presents.api.present(yootil.user.id()).open($span.attr("data-present-id"), uid);

						if(present){
							$span.attr("title", "Present from " + yootil.html_encode(present.n, true) + " (ID# " + uid + ").");
						} else {
							$span.removeAttr("title");
						}
					});
				}
			}
		}
	}

	fetch_present_box(x = 0, y = 0){
		let box = "a";
		let total = x * y;

		if(total > 462){
			box = "h";
		} else if(total > 397){
			box = "g";
		} else if(total > 331){
			box = "f";
		} else if(total > 265){
			box = "e";
		} else if(total > 199){
			box = "d";
		} else if(total > 133){
			box = "c";
		} else if(total > 67){
			box = "b";
		}

		return box;
	}

}