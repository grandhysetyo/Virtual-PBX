import * as Constant from "./Constant.js"
import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"

class Pbxs {
	constructor() {
		this.storage = new Storage.Storage();
	}

	displayBasedOnRole() {
		let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
		if (role === Constant.USER_TYPE_ADMIN) {
			$("#id-menu-pbx").html("All PBXs");
			$("#id-menu-pbx-requests").html("All PBX Requests");
			$("#id-title-pbxs").html("All PBXs");
			$("#id-pbx-row-user-id").show();
			$("#id-pbx-row-user-name").show();
		} else {
			$("#id-menu-pbx").html("My PBXs");
			$("#id-menu-pbx-requests").html("My PBX Requests");
			$("#id-title-pbxs").html("My PBXs");
			$("#id-pbx-row-user-id").hide();
			$("#id-pbx-row-user-name").hide();
		}

		let greeting = "Hi, " + this.storage.get(Constant.STORAGE_KEY_USER_NAME);		
		$("#id-username").html(greeting);		
	}

	displayAllPbxs(data) {
		this.hideLoadingSpinner();
		$("#id-total-pbxs").html("Total PBX Containers: " + data.length);

        let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
        var count = 1;
		for (let pbx of data) {
            let formattedPbx;

            if (count==1) {
                formattedPbx = "<div class='item active'><div class='carousel-col'><div class='block img-responsive'><a href='id-delete-pbx-'" + pbx["id_pbx"] + "'><i class='fa fa-times fa-lg '></i></a><img src='img/virtual-pbx.png'/>";
            }
			else {
                formattedPbx = "<div class='item'><div class='carousel-col'><div class='block img-responsive'><a href='id-delete-pbx-'" + pbx["id_pbx"] + "'><i class='fa fa-times fa-lg '></i></a><img src='img/virtual-pbx.png'/>";
                if (role === Constant.USER_TYPE_ADMIN) {
                    formattedPbx = formattedPbx +
                        "<h4>" + pbx["user_email"] + "</h4>\n";
                }
                formattedPbx = formattedPbx +
                    "<h4>" + pbx["pbx_name"] + "</h4>"+
                    "<span>" + pbx["location"] + "</span>"+
                    "<span>" + pbx["vm_address"] + "</span>"+
                    "<span>"+ pbx["number_of_extension"] +"</span>"+
                    "<span>Saldo : 1.000</span>"+
                    "<span>Public Number</span>"+
                    "<span>02150858122</span>"+
                    "\n </div>\n </div>\n </div>";                
            }
            count = count+1;			
			$("#id-tbody-pbxs").append(formattedPbx);
		}

		let self = this;
		$("[id^=\"id-delete-pbx-\"]").click(function (event) {
			let pbxId = event.target.id.split("-")[3];
			self.deletePbx(pbxId);
		});
	}

	displayPbxDeletion(response) {
		if (response["status"]) {
			this.storage.delete(Constant.STORAGE_KEY_ALL_PBXS);
			$("#id-tbody-pbxs").empty();
			this.showLoadingSpinner();
			let self = this;
			GLOBAL.connection.getAllPbxs(function (data) {
				self.displayAllPbxs(data);
			});
		}
		alert(response["message"]);
	}

	showLoadingSpinner() {
		$("#id-spinner-pbxs").show();
	}

	hideLoadingSpinner() {
		$("#id-spinner-pbxs").hide();
	}

	deletePbx(pbxId) {
		let message = "Are you sure want to delete the container?";
		let result = confirm(message);
		if (result) {
			$("#id-delete-pbx-" + pbxId).hide();
			$("#id-spinner-action-pbx-" + pbxId).show();
			let self = this;
			GLOBAL.connection.deletePbx(pbxId, function (data) {
				self.displayPbxDeletion(data);
			});
		}
	}
}

$(document).ready(function () {
	let PBXS = new Pbxs();
    PBXS.displayBasedOnRole();
    $("#id-logout").click(function (){ GLOBAL.logout(); });
    $("#id-tbody-pbxs").empty();
    PBXS.showLoadingSpinner();
    GLOBAL.connection.getAllPbxs(function(data) {
    	PBXS.displayAllPbxs(data);
	});
});
