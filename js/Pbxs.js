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
		// this.hideLoadingSpinner();
		// $("#id-total-pbxs").html("Total PBX Containers: " + data.length);

		// let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
		// for (let pbx of data) {
		// 	let formattedPbx = "<tr>\n";
		// 	if (role === Constant.USER_TYPE_ADMIN) {
		// 		formattedPbx = formattedPbx +
		// 			"<td>" + pbx["user_email"] + "</td>\n";
		// 	}
		// 	formattedPbx = formattedPbx +
		// 		"<td><a href='user_extension.html?id=" + pbx["id_pbx"] + "'>" + pbx["pbx_name"] + "</a></td>\n" +
		// 		"<td>" + pbx["location"] + "</td>\n" +
		// 		"<td>" + pbx["number_of_extension"] + "</td>\n" +
		// 		"<td>" + pbx["vm_address"] + "</td>\n" +
		// 		"<td>" +				
		// 		"<a href='user_extension.html?id=" + pbx["id_pbx"] + "' style='margin-left: 5px'><i class='fa fa-info'></i></a>"+
		// 		"<img id=\"id-delete-pbx-" + pbx["id_pbx"] + "\" alt=\"Icon for deleting\" src=\"res/ic_trash.png\" style=\"width: 13px;\">" +
		// 		"</td>\n" +
		// 		"</tr>";
		// 	$("#id-tbody-pbxs").append(formattedPbx);
		// }
		let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);

		var table = $('#tb').DataTable();
		
		for (let pbx of data) {
			let btnDelete = "<img id=\"id-delete-pbx-" + pbx["id_pbx"] + "\" alt=\"Icon for deleting\" src=\"res/ic_trash.png\" style=\"width: 13px;\">" ;
			let btnExtension = "<a href='user_extension.html?id=" + pbx["id_pbx"] + "' style='margin-left: 5px'><i class='fa fa-info'></i></a>";
			let btnName = "<a href='user_extension.html?id=" + pbx["id_pbx"] + "'>" + pbx["pbx_name"] + "</a>";
			if (role === Constant.USER_TYPE_ADMIN) {
				table.row.add([pbx['user_email'],pbx['Location'],pbx['number_of_extension'],pbx['vm_address'],btnExtension+ btnDelete]).draw();    	
				
			}
			else{
				table.row.add([btnName,pbx['Location'],pbx['number_of_extension'],pbx['vm_address'],btnExtension+ btnDelete]).draw();    
			}
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
