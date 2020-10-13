import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"
import * as Constant from "./Constant.js";

class Extension {
	constructor(id_pbx) {
		this.storage = new Storage.Storage();
		this.ID_PBX = id_pbx;
		this.ID_UPDATED_EXTENSION = -1;
	}

	maskPassword(password){
		let maskedPassword = "";
		for (let i = 0; i < password.length; i++) {
			maskedPassword = maskedPassword + "*";
		}
		return maskedPassword
	}

	displayAllExtensions(data) {
		let number = 0;
		let operatorEnabled = false
		let buttonOperator = null
		let forwarded_number = null
		for (let extension of data) {
			if (extension["operator"] === 1) {
				operatorEnabled = true
			}
		}
		
		for (let extension of data) {
			number = number + 1;
			if (extension["operator"] === 1 && operatorEnabled) {
				buttonOperator = 
					"<button id=\"btn-update-operator-" + extension["id_extension"] + "\" type=\"button\" class=\"btn btn-danger\" style=\"color: white; margin-left: 5pt;\">" +
					"<i class='fa fa-minus-circle' style='margin-right:5px;' aria-hidden='true'></i>Disable operator</button>"
			} else if (!operatorEnabled) {
				buttonOperator = 
					"<button id=\"btn-update-operator-" + extension["id_extension"] + "\" type=\"button\" class=\"btn btn-sm\" style=\"background: #4e73df; color: white; margin-left: 5pt;\">" +
					"<i class='fa fa-check-square' style='margin-right:5px;' aria-hidden='true'></i>Enable operator</button>"
			} else {
				buttonOperator = ""
			}

			if (extension["forwarded_number"] === "") {
				forwarded_number = "disabled"
			} else {
				forwarded_number = extension["forwarded_number"]
			}

			let saldo = extension["saldo"]
			if (extension["saldo"] == null) {
				saldo = "Disabled"
			}
			var table = $('#tb').DataTable();
			let btnDelete = "<img id=\"id-delete-extension-" + extension["id_extension"] + "\" alt=\"Icon for deleting\" src=\"res/ic_trash.png\" style=\"width: 20px; margin-left: 5px;\">" ;
			let btnUpdate = "<img id=\"id-click-update-extension-" + extension["id_extension"] + "\" alt=\"Icon for updating\" src=\"res/ic_edit.png\" style=\"width: 20px; margin-left: 5px;\">";
			let btnTopUp = "<img id=\"id-click-top-up-extension-" + extension["id_extension"] + "\" alt=\"Icon for top up\" src=\"res/ic_top_up.png\" style=\"width: 20px; margin-left: 5px;\">";
			
			table.row.add([extension['name_assignee'],extension['username'],extension["email_assignee"],forwarded_number,saldo,btnDelete+ btnUpdate+ btnTopUp+ buttonOperator]).draw();

			// let formattedExtension = "<tr>\n" +
			// 	"<td>" + extension["name_assignee"] + "</td>\n" +
			// 	"<td>" + extension["username"] + "</td>\n" +
			// 	"<td>" + extension["email_assignee"] + "</td>\n" +
			// 	"<td>" + forwarded_number + "</td>\n" +
			// 	"<td>" + saldo + "</td>\n" +
			// 	"<td>" +
			// 	"<div id=\"id-spinner-action-extension-" + extension["id_extension"] + "\" class=\"spinner-border text-primary\" role=\"status\" style=\"display: none;\"></div>" +				
			// 	"<img id=\"id-delete-extension-" + extension["id_extension"] + "\" alt=\"Icon for deleting\" src=\"res/ic_trash.png\" style=\"width: 20px; margin-left: 5px;\">" +
			// 	"<img id=\"id-click-update-extension-" + extension["id_extension"] + "\" alt=\"Icon for updating\" src=\"res/ic_edit.png\" style=\"width: 20px; margin-left: 5px;\">" +
			// 	"<img id=\"id-click-top-up-extension-" + extension["id_extension"] + "\" alt=\"Icon for top up\" src=\"res/ic_top_up.png\" style=\"width: 20px; margin-left: 5px;\">" +				
			// 	buttonOperator +
			// 	"</td>\n" +
			// 	"</tr>";
			$("#id-tbody-extensions").append(table);
		}

		let self = this;
		$("[id^=\"id-delete-extension\"]").click(function (event) {
			let idExtension = event.target.id.split("-")[3];
			self.deleteExtension(idExtension);
		});

		$("[id^=\"id-click-update-extension\"]").click(function (event) {
			self.ID_UPDATED_EXTENSION = event.target.id.split("-")[4];
			let selected_extension = data[0];
			for (let extension of data) {
				if (extension["id_extension"] === parseInt(self.ID_UPDATED_EXTENSION)) {
					selected_extension = extension;
				}
			}
			$("#id-update-extension-username").val(selected_extension["username"]);
			$("#id-update-extension-secret").val(selected_extension["secret"]);
			if (selected_extension["forwarded_number"] !== "") {
				$("#id-extension-call-forwarding-yes").prop("checked", true);
				self.showFormCallForwarding();	
			} else {
				$("#id-extension-call-forwarding-no").prop("checked", true);
				self.hideFormCallForwarding();
			}
			$("#id-extension-call-forwarding-number").empty();
			for (let extension of data) {
				if (extension["id_extension"] !== parseInt(self.ID_UPDATED_EXTENSION)) {
					let formattedExtension = "<option value="+ extension["username"] +">"+ extension["username"] +"</option>\n"
					$("#id-extension-call-forwarding-number").append(formattedExtension);
				}
			}
			$("#modal-update-pbx-extension").modal("show");
		});

		$("[id^=\"btn-update-operator\"]").click(function (event) {
			let idExtension = event.target.id.split("-")[3];
			self.updateOprator(idExtension);
		});

		$("[id^=\"id-click-top-up-extension\"]").click(function (event) {
			self.ID_UPDATED_EXTENSION = event.target.id.split("-")[5];
			let selected_extension = data[0];
			for (let extension of data) {
				if (extension["id_extension"] === parseInt(self.ID_UPDATED_EXTENSION)) {
					selected_extension = extension;
				}
			}
			if (selected_extension["saldo"] !== null) {
				$("#id-top-up-saldo-extension-enable").prop("checked", true);
				self.showFormTopUpSaldoExtension();	
			} else {
				$("#id-top-up-saldo-extension-disable").prop("checked", true);
				self.hideFormTopUpSaldoExtension();
			}
			$("#modal-top-up-saldo-extension").modal("show");
		});
	}

	displayExtensionDeletion(response) {
		if (response["status"]) {
			$("#id-tbody-extensions").empty();
			let self = this;
			GLOBAL.connection.getAllExtensions(this.ID_PBX, function (data) {
				self.displayAllExtensions(data);
			});
		}
		alert(response["message"]);
	}

	deleteExtension(idExtension) {
		let message = "Are you sure want to delete the extension?";
		let result = confirm(message);
		if (result) {
			$("#id-delete-extension-" + idExtension).hide();
			$("#id-click-update-extension-" + idExtension).hide();
			$("#btn-update-operator-" + idExtension).hide();
			$("#id-spinner-action-extension-" + idExtension).show();
			let self = this;
			GLOBAL.connection.deleteExtension(idExtension, function (data) {
				self.displayExtensionDeletion(data);
			});
		}
	}

	displayExtensionUpdate(response) {
		$("#modal-update-pbx-extension").modal("hide");
		$("#id-update-extension-cancel").show();
		$("#id-update-extension-submit").show();
		$("#id-update-extension-username").html("");
		$("#id-update-extension-secret").html("");
		$("#id-spinner-update-extension").hide();
		if (response["status"]) {
			$("#id-tbody-extensions").empty();
			let self = this;
			GLOBAL.connection.getAllExtensions(this.ID_PBX, function (data) {
				self.displayAllExtensions(data);
			});
		}
		alert(response["message"]);
	}

	updateExtension() {
		let username = $("#id-update-extension-username").val();
		let secret = $("#id-update-extension-secret").val();
		let forwarded_number = $("#id-extension-call-forwarding-number").val();
		if ($("#id-extension-call-forwarding-no").prop("checked")) {
			forwarded_number = ""
		}
		if ($("#id-extension-call-forwarding-yes").prop("checked")) {
			forwarded_number
		}
		if (username === "" || secret === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else {
			$("#id-update-extension-cancel").hide();
			$("#id-update-extension-submit").hide();
			$("#id-spinner-update-extension").show();
			let self = this;
			GLOBAL.connection.updateExtension(this.ID_UPDATED_EXTENSION, username, secret, forwarded_number, function (data) {
				self.displayExtensionUpdate(data);
			});
		}
	}

	displayExtensionCreation(response) {
		$("#id-extension-username").val("");
		$("#id-extension-secret").val("");
		$("#modal-pbx-extension").modal("hide");
		$("#id-new-extension-cancel").show();
		$("#id-new-extension-submit").show();
		$("#id-extension-username").html("");
		$("#id-extension-secret").html("");
		$("#id-spinner-new-extension").hide();
		if (response["status"]) {
			$("#id-tbody-extensions").empty();
			let self = this;
			GLOBAL.connection.getAllExtensions(this.ID_PBX, function (data) {
				self.displayAllExtensions(data);
			});
		}
		alert(response["message"]);
	}

	createNewExtension() {
		let id_pbx = this.ID_PBX;
		let username = $("#id-extension-username").val();
		let secret = $("#id-extension-secret").val();
		let name_assignee = $("#id-extension-name-assignee").val();
		let email_assignee = $("#id-extension-email-assignee").val();
		if (username === "" || secret === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else {
			$("#id-new-extension-cancel").hide();
			$("#id-new-extension-submit").hide();
			$("#id-spinner-new-extension").show();
			let self = this;
			GLOBAL.connection.createExtension(id_pbx, username, secret, name_assignee, email_assignee, function (data) {
				self.displayExtensionCreation(data);
			});
		}
	}

	displayOutgoingSection(response) {
		$("#id-call-limit").val("");
		$("#id-spinner-disable-outgoing").hide();
		$("#btn-enable-outgoing").show();
		$("#modal-enable-outgoing").modal("hide");
		$("#id-enable-outgoing-cancel").show();
		$("#id-enable-outgoing-submit").show();
		$("#id-call-limit").html("");
		$("#id-spinner-enable-outgoing").hide();
		if (response["status"]) {
			let self = this;
			let iconPrefix = '<span class="icon-outgoing"></span>';
			GLOBAL.connection.getOutgoingStatus(this.ID_PBX, function (data) {
				self.getOutgoingStatus(data);
			});
			if ($("#btn-enable-outgoing").html() === iconPrefix+ ' Disable outgoing call') {
				$("#btn-enable-outgoing").html(iconPrefix + ' Enable outgoing call');
				$("#btn-enable-incoming").hide();
			} else {
				$("#btn-enable-outgoing").html(iconPrefix + ' Disable outgoing call');
				$("#btn-enable-incoming").show();
			}
		}
		alert(response["message"]);
	}

	submitOutgoing() {
		let callLimit = $("#id-call-limit").val();
		let idPbx = this.ID_PBX;
		if (callLimit === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else {
			$("#id-enable-outgoing-cancel").hide();
			$("#id-enable-outgoing-submit").hide();
			$("#id-spinner-enable-outgoing").show();
			$("#btn-enable-outgoing").hide();
			$("#id-spinner-disable-outgoing").show();
			let self = this;

			$("#modal-enable-outgoing").modal("hide");
			$("#btn-enable-outgoing").removeAttr("data-target");
			$("#btn-enable-outgoing").removeAttr("data-toggle");

			GLOBAL.connection.updateOutgoing(idPbx, callLimit, function (data) {
				self.displayOutgoingSection(data);
			});
			
		}
	}

	updateOutgoing() {
		let iconPrefix = '<span class="icon-outgoing"></span>';
		let self = this;
		if ($("#btn-enable-outgoing").html() === iconPrefix+ ' Disable outgoing call') {
			$("#btn-enable-outgoing").hide();
			$("#id-spinner-disable-outgoing").show();
			GLOBAL.connection.updateOutgoing(this.ID_PBX, 10, function (data) {
				self.displayOutgoingSection(data);
			});
		} 
	}

	displayIncoming(response) {
		$("#btn-enable-incoming").show();
		$("#id-spinner-enable-incoming").hide();
		if (response["status"]) {
			let self = this;
			GLOBAL.connection.getIncomingStatus(this.ID_PBX, function (data) {
				self.getIncomingStatus(data);
			});
			let iconPrefix = '<span class="icon-incoming"></span>';
			if ($("#btn-enable-incoming").html() === iconPrefix+ ' Disable incoming call') {	
				$("#btn-enable-incoming").html(iconPrefix + ' Enable incoming call');
			} else {	
				$("#btn-enable-incoming").html(iconPrefix + ' Disable incoming call');
			}
		}
		alert(response["message"]);
	}

	updateIncoming() {
		let idPbx = this.ID_PBX;
		let self = this;
		$("#btn-enable-incoming").hide();
		$("#id-spinner-enable-incoming").show();
		GLOBAL.connection.updateIncoming(idPbx, function (data) {
			self.displayIncoming(data);
		});
	}

	getOutgoingStatus(data) {
		let iconPrefix = '<span class="icon-outgoing"></span>';
		if (!data || data.length === 0 || !data["outgoing"]) {
			$("#btn-enable-outgoing").html(iconPrefix + ' Enable outgoing call');
			$("#btn-enable-outgoing").attr("data-toggle", "modal");
			$("#btn-enable-outgoing").attr("data-target", "#modal-enable-outgoing");
			$("#btn-enable-incoming").hide();
		} else {
			$("#btn-enable-outgoing").html(iconPrefix + ' Disable outgoing call');
			$("#btn-enable-outgoing").removeAttr("data-target");
			$("#btn-enable-outgoing").removeAttr("data-toggle");
			$("#btn-enable-incoming").show();
		}

		let outgoing = data["code_area"] + data["outgoing"]
		if (!data["outgoing"] || data["outgoing"] === "false") {
			outgoing = "No number" 
		}
		
		let saldo = data["saldo"]
		if (data["saldo"] == null) {
			saldo = "Disabled"
		}

		let formattedStatus = "<tr>\n" +
			"<td>" + data["name"] + "</td>\n" +
			"<td>" + data["ip_address"] + "</td>\n" +
			"<td>" + data["max_extension"] + "</td>\n" +
			"<td>" + outgoing + "</td>\n" +
			"<td>" + data["cac"] + "</td>\n" +
			"<td>" + saldo + "</td>\n" +
			"<td>" +			
			"<img id=\"id-click-top-up-pbx-" + data["id_pbx"] + "\" alt=\"Icon for top up\" src=\"res/ic_top_up.png\" style=\"width: 20px; margin-left: 5px;\">" +
			"</td>\n" +
			"</tr>";
		$("#id-tbody-status").html(formattedStatus);

		let self = this
		$("[id^=\"id-click-top-up-pbx\"]").click(function () {
			if (data["saldo"] !== null) {
				$("#id-top-up-saldo-pbx-enable").prop("checked", true);
				self.showFormTopUpSaldoPBX();	
			} else {
				$("#id-top-up-saldo-pbx-disable").prop("checked", true);
				self.hideFormTopUpSaldoPBX();
			}
			$("#modal-top-up-saldo-pbx").modal("show");
		});
	}

	getIncomingStatus(data) {
		let iconPrefix = '<span class="icon-incoming"></span>';
		if (!data || data.length === 0) {
			$("#btn-enable-incoming").html(iconPrefix + ' Enable incoming call');
		} else {
			$("#btn-enable-incoming").html(iconPrefix + ' Disable incoming call');
		}
	}

	updateOprator(idExtension){
		let message = "Enable this extension as operator?";
		let result = confirm(message);
		if (result) {
			$("#id-delete-extension-" + idExtension).hide();
			$("#id-click-update-extension-" + idExtension).hide();
			$("#btn-update-operator-" + idExtension).hide();
			$("#id-spinner-action-extension-" + idExtension).show();
			let self = this;
			GLOBAL.connection.updateOperator(idExtension, function (data) {
				self.displayExtensionDeletion(data);
			});
		}
	}

	displayTopUpSaldoExtension(response) {
		$("#modal-top-up-saldo-extension").modal("hide");
		$("#id-top-up-saldo-extension-cancel").show();
		$("#id-top-up-saldo-extension-submit").show();
		$("#id-spinner-top-up-saldo-extension").hide();
		$("#id-nominal-top-up-extension").val("");
		if (response["status"]) {
			$("#id-tbody-extensions").empty();
			let self = this;
			GLOBAL.connection.getAllExtensions(this.ID_PBX, function (data) {
				self.displayAllExtensions(data);
			});
		}
		alert(response["message"]);
	}

	displayTopUpSaldoPBX(response) {
		$("#modal-top-up-saldo-pbx").modal("hide");
		$("#id-top-up-saldo-pbx-cancel").show();
		$("#id-top-up-saldo-pbx-submit").show();
		$("#id-spinner-top-up-saldo-pbx").hide();
		$("#id-nominal-top-up-pbx").val("");
		if (response["status"]) {
			$("#id-tbody-status").empty();
			let self = this;
			GLOBAL.connection.getOutgoingStatus(this.ID_PBX, function (data) {
				self.getOutgoingStatus(data);
			});
		}
		alert(response["message"]);
	}

	topUpSaldoExtension() {
		let saldo = $("#id-nominal-top-up-extension").val();
		if ($("#id-top-up-saldo-extension-disable").prop("checked")) {
			saldo = null
		}
		if ($("#id-top-up-saldo-extension-enable").prop("checked")) {
			saldo
		}
		if (saldo === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else {
			$("#id-top-up-saldo-extension-cancel").hide();
			$("#id-top-up-saldo-extension-submit").hide();
			$("#id-spinner-top-up-saldo-extension").show();
			$("#id-nominal-top-up-extension").html("");
			let self = this;
			GLOBAL.connection.topUpSaldoExtension(self.ID_PBX, self.ID_UPDATED_EXTENSION, saldo, function (data) {
				self.displayTopUpSaldoExtension(data);
			});
		}
	}

	topUpSaldoPBX() {
		let saldo = $("#id-nominal-top-up-pbx").val();
		if ($("#id-top-up-saldo-pbx-disable").prop("checked")) {
			saldo = null
		}
		if ($("#id-top-up-saldo-pbx-enable").prop("checked")) {
			saldo
		}
		if (saldo === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else {
			$("#id-top-up-saldo-pbx-cancel").hide();
			$("#id-top-up-saldo-pbx-submit").hide();
			$("#id-spinner-top-up-saldo-pbx").show();
			$("#id-nominal-top-up-pbx").html("");
			let self = this;
			GLOBAL.connection.topUpSaldoPBX(self.ID_PBX, saldo, function (data) {
				self.displayTopUpSaldoPBX(data);
			});
		}
	}

	displayCallLogData(data) {
		let number = 0;
		for (let callLog of data) {
			let formattedCallLog = "<tr>\n" +
				"<td>" + callLog[0] + "</td>\n" +
				"<td>" + callLog[1] + "</td>\n" +
				"<td>" + callLog[2] + "</td>\n" +
				"<td>" + callLog[3] + "</td>\n" +
				"<td>" + callLog[6] + "</td>\n" +
				"<td>" + callLog[4] + "</td>\n" +
				"<td>" + callLog[5] + "</td>\n" +
				"</tr>";
			$("#id-tbody-call-log").append(formattedCallLog);
		}
		$('#callLogs').DataTable().draw();;

	}

	refreshLog() {
		$("#callLogs").hide();
		$("#id-spinner-log").show();
		$('#callLogs').DataTable().destroy();
		$('#id-tbody-call-log').html("")
		let self = this;
		GLOBAL.connection.getCallLogData(null, null, this.ID_PBX, null, function (data) {
			self.displayCallLogData(data);
		});
		$("#id-spinner-log").hide();
		$("#callLogs").show();
	}

	showFormCallForwarding() {
		$("#id-form-extension-call-forwarding").show();
	}

	hideFormCallForwarding() {
		$("#id-form-extension-call-forwarding").hide();
	}

	showFormTopUpSaldoExtension() {
		$("#id-form-top-up-saldo-extension").show();
	}

	hideFormTopUpSaldoExtension() {
		$("#id-form-top-up-saldo-extension").hide();
	}

	showFormTopUpSaldoPBX() {
		$("#id-form-top-up-saldo-pbx").show();
	}

	hideFormTopUpSaldoPBX() {
		$("#id-form-top-up-saldo-pbx").hide();
	}

}

$(document).ready(function () {
	let id_pbx = window.location.search.substr(1).split("=")[1];
	let EXTENSION = new Extension(id_pbx);
	let greeting = "Hi, " + EXTENSION.storage.get(Constant.STORAGE_KEY_USER_NAME);
	$("#id-username").html(greeting);
    $("#id-new-extension-submit").click(function (){ EXTENSION.createNewExtension(); });
	$("#id-update-extension-submit").click(function (){ EXTENSION.updateExtension(); });
	$("#id-enable-outgoing-submit").click(function (){ EXTENSION.submitOutgoing(); });
	$("#btn-enable-outgoing").click(function() {EXTENSION.updateOutgoing(); })
	$("#btn-enable-incoming").click(function() {EXTENSION.updateIncoming(); })
	$("#btn-refresh-log").click(function() {EXTENSION.refreshLog(); })
	$("#id-extension-call-forwarding-yes").click(function() {EXTENSION.showFormCallForwarding(); })
	$("#id-extension-call-forwarding-no").click(function() {EXTENSION.hideFormCallForwarding(); })
	$("#id-top-up-saldo-extension-submit").click(function() {EXTENSION.topUpSaldoExtension(); })
	$("#id-top-up-saldo-pbx-submit").click(function() {EXTENSION.topUpSaldoPBX(); })
	$("#id-top-up-saldo-extension-enable").click(function() {EXTENSION.showFormTopUpSaldoExtension(); })
	$("#id-top-up-saldo-extension-disable").click(function() {EXTENSION.hideFormTopUpSaldoExtension(); })
	$("#id-top-up-saldo-pbx-enable").click(function() {EXTENSION.showFormTopUpSaldoPBX(); })
	$("#id-top-up-saldo-pbx-disable").click(function() {EXTENSION.hideFormTopUpSaldoPBX(); })
	$("#id-tbody-extensions").empty();
	$("#id-spinner-log").show();
	$("#callLogs").hide();
	$("#id-form-extension-call-forwarding").hide();
	$("#id-form-top-up-saldo-extension").hide();
	$("#id-form-top-up-saldo-pbx").hide();
	GLOBAL.connection.getAllExtensions(EXTENSION.ID_PBX, function (data) {
		EXTENSION.displayAllExtensions(data);
	});
	GLOBAL.connection.getCallLogData(null, null, EXTENSION.ID_PBX, null, function (data) {
		EXTENSION.displayCallLogData(data);
	});
	GLOBAL.connection.getOutgoingStatus(EXTENSION.ID_PBX, function (data) {
		EXTENSION.getOutgoingStatus(data);
	});
	GLOBAL.connection.getIncomingStatus(EXTENSION.ID_PBX, function (data) {
		EXTENSION.getIncomingStatus(data);
	});
	$("#id-spinner-log").hide();
	$("#callLogs").show();
});
