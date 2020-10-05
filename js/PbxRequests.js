import * as Constant from "./Constant.js"
import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"

class PbxRequests {
	constructor() {
		this.storage = new Storage.Storage();
	}

	displayBasedOnRole() {
		let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
		if (role === Constant.USER_TYPE_ADMIN) {
			$("#id-menu-pbx").html("All PBXs");
			$("#id-menu-pbx-requests").html("All PBX Requests");
			$("#id-title-pbx-requests").html("All PBX Requests");
			$("#id-pbx-request-row-user-id").show();
			$("#id-pbx-request-row-user-name").show();
			$("#id-create-new-pbx-request").hide();
		} else {
			$("#id-menu-pbx").html("My PBXs");
			$("#id-menu-pbx-requests").html("My PBX Requests");
			$("#id-title-pbx-requests").html("My PBX Requests");
			$("#id-pbx-requests-row-user-id").hide();
			$("#id-pbx-requests-row-user-name").hide();
			$("#id-create-new-pbx-request").show();
		}

		let greeting = "Selamat datang, " + this.storage.get(Constant.STORAGE_KEY_USER_NAME);
		$("#id-username").html(greeting);
	}

	displayLocations(data) {
		for (let location of data) {
			let formattedLocation = "<option>" + location["location_name"] + "</option>";
			$("#id-pbx-request-location").append(formattedLocation);
		}
	}

	displayAllPbxRequests(data) {
		this.hideLoadingSpinner();
		$("#id-total-pbx-requests").html("Total PBX Requests: " + data.length);
		let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);

		for (let pbxRequest of data) {
			let formattedPbxRequest = "<tr>\n";
			if (role === Constant.USER_TYPE_ADMIN) {
				formattedPbxRequest = formattedPbxRequest +
					"<td>" + pbxRequest["user_email"] + "</td>\n";
			}
			formattedPbxRequest = formattedPbxRequest +
				"<td>" + pbxRequest["date"] + "</td>\n" +
				"<td>" + pbxRequest["pbx_request_name"] + "</td>\n" +
				"<td>" + pbxRequest["location"] + "</td>\n" +
				"<td>" + pbxRequest["number_of_extension"] + "</td>\n" +
				"<td>";
			if (role === Constant.USER_TYPE_ADMIN && pbxRequest["status"] === "Pending") {
				formattedPbxRequest = formattedPbxRequest +
					"<button id=\"id-approve-pbx-request-" + pbxRequest["id_pbx_request"] + "\" type=\"button\" class=\"btn btn-success\">Approve</button>";
			}
			formattedPbxRequest = formattedPbxRequest +
				"<div id=\"id-spinner-action-pbx-request-" + pbxRequest["id_pbx_request"] + "\" class=\"spinner-border text-primary\" role=\"status\" style=\"display: none;\"></div>" +
				"<img id=\"id-delete-pbx-request-" + pbxRequest["id_pbx_request"] + "\" alt=\"Icon for deleting\" src=\"res/ic_trash.png\" style=\"width: 20px;\">" +
				"</td>\n" +
				"</tr>";
			$("#id-tbody-pbx-requests").append(formattedPbxRequest);
		}

		let self = this;
		$("[id^=\"id-approve-pbx-request\"]").click(function (event) {
			let pbxRequestId = event.target.id.split("-")[4];
			self.approvePbxRequest(pbxRequestId);
		});

		$("[id^=\"id-delete-pbx-request\"]").click(function (event) {
			let pbxRequestId = event.target.id.split("-")[4];
			self.deletePbxRequest(pbxRequestId);
		});
	}

	displayPbxRequestCreation(response) {
		$("#id-pbx-request-name").val("");
		$("#modal-pbx-request").modal("hide");
		$("#id-pbx-request-cancel").show();
		$("#id-pbx-request-submit").show();
		$("#id-pbx-request-name").html("");
		$("#id-spinner-new-pbx-request").hide();
		if (response["status"]) {
			this.storage.delete(Constant.STORAGE_KEY_ALL_PBX_REQUESTS);
			$("#id-tbody-pbx-requests").empty();
			this.showLoadingSpinner();
			let self = this;
			GLOBAL.connection.getAllPbxRequests(function (data) {
				self.displayAllPbxRequests(data);
			});
		}
		alert(response["message"]);
	}

	displayPbxRequestApproval(response) {
		if (response["status"]) {
			this.storage.delete(Constant.STORAGE_KEY_ALL_PBX_REQUESTS);
			this.storage.delete(Constant.STORAGE_KEY_ALL_PBXS);
			$("#id-tbody-pbx-requests").empty();
			this.showLoadingSpinner();
			let self = this;
			GLOBAL.connection.getAllPbxRequests(function (data) {
				self.displayAllPbxRequests(data);
			});
		}
		alert(response["message"]);
	}

	displayPbxRequestDeletion(response) {
		if (response["status"]) {
			this.storage.delete(Constant.STORAGE_KEY_ALL_PBX_REQUESTS);
			$("#id-tbody-pbx-requests").empty();
			this.showLoadingSpinner();
			let self = this;
			GLOBAL.connection.getAllPbxRequests(function (data) {
				self.displayAllPbxRequests(data);
			});
		}
		alert(response["message"]);
	}

	showLoadingSpinner() {
		$("#id-spinner-pbx-requests").show();
	}

	hideLoadingSpinner() {
		$("#id-spinner-pbx-requests").hide();
	}

	createPbxRequest() {
		let name = $("#id-pbx-request-name").val();
		let location = $("#id-pbx-request-location").val();
		let number_of_extension = $("#id-pbx-request-extension").val();
		if (name === "" || location === "" || number_of_extension === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else {
			$("#id-pbx-request-cancel").hide();
			$("#id-pbx-request-submit").hide();
			$("#id-spinner-new-pbx-request").show();
			let self = this;
			GLOBAL.connection.createPbxRequest(name, location, number_of_extension, function (data) {
				self.displayPbxRequestCreation(data);
			});
		}
	}

	approvePbxRequest(pbxRequestId) {
		let message = "Are you sure want to approve the request?";
		let result = confirm(message);
		if (result) {
			$("#id-delete-pbx-request-" + pbxRequestId).hide();
			$("#id-approve-pbx-request-" + pbxRequestId).hide();
			$("#id-spinner-action-pbx-request-" + pbxRequestId).show();
			let self = this;
			GLOBAL.connection.approvePbxRequest(pbxRequestId, function (data) {
				self.displayPbxRequestApproval(data);
			});
		}
	}

	deletePbxRequest(pbxRequestId) {
		let message = "Are you sure want to delete the request?";
		let result = confirm(message);
		if (result) {
			$("#id-delete-pbx-request-" + pbxRequestId).hide();
			$("#id-approve-pbx-request-" + pbxRequestId).hide();
			$("#id-spinner-action-pbx-request-" + pbxRequestId).show();
			let self = this;
			GLOBAL.connection.deletePbxRequest(pbxRequestId, function (data) {
				self.displayPbxRequestDeletion(data);
			});
		}
	}
}

$(document).ready(function () {
	let PBX_REQUESTS = new PbxRequests();
    PBX_REQUESTS.displayBasedOnRole();
    $("#id-logout").click(function (){ GLOBAL.logout(); });
    $("#id-pbx-request-submit").click(function (){ PBX_REQUESTS.createPbxRequest(); });
    $("#id-tbody-pbx-requests").empty();
    PBX_REQUESTS.showLoadingSpinner();
    GLOBAL.connection.getLocations(function (data) {
		PBX_REQUESTS.displayLocations(data);
	});
    GLOBAL.connection.getAllPbxRequests(function (data) {
		PBX_REQUESTS.displayAllPbxRequests(data);
	});
});
