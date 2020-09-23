import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"
import * as Constant from "./Constant.js";

class OutboundNumber {
	constructor() {
        this.storage = new Storage.Storage();
        this.ID_UPDATED_OUTBOUND_NUMBER = -1;
    }

    displayAllOutboundNumber(data) {
		for (let outboundNumber of data) {
            let formattedOutboundNumber = "<tr>\n" +
				"<td>" + outboundNumber["location"] + "</td>\n" +
				"<td>" + outboundNumber["code_area"] + "</td>\n" +
				"<td>" + outboundNumber["number"] + "</td>\n" +
				"<td>" +				
				"<a id='id-delete-outbound-number-'" + outboundNumber["id_outbound_num"] + "' style='margin-left: 5px'><i class='fa fa-trash'></i></a>"+
				"<a id='id-click-update-outbound-number-'" + outboundNumber["id_outbound_num"] + "' style='margin-left: 5px'><i class='fa fa-pencil-square-o'></i></a>"+
				"</td>\n" +
				"</tr>";
			$("#id-tbody-outbound-numbers").append(formattedOutboundNumber);
        }

        let self = this;
		$("[id^=\"id-delete-outbound-number\"]").click(function (event) {
			let idOutboundNumber = event.target.id.split("-")[4];
			self.deleteOutboundNumber(idOutboundNumber);
		});

		$("[id^=\"id-click-update-outbound-number\"]").click(function (event) {
			self.ID_UPDATED_OUTBOUND_NUMBER = event.target.id.split("-")[5];
			let selected_outbound_number = data[0];
			for (let outboundNumber of data) {
				if (outboundNumber["id_outbound_num"] === parseInt(self.ID_UPDATED_OUTBOUND_NUMBER)) {
					selected_outbound_number = outboundNumber;
				}
			}
			$("#id-update-outbound-number-code-area").val(selected_outbound_number["code_area"]);
			$("#id-update-outbound-number").val(selected_outbound_number["number"]);
			$("#modal-update-outbound-number").modal("show");
		});
    }

    displayOutboundNumberCreation(response) {
		$("#id-new-outbound-number-code-area").val("");
		$("#id-new-outbound-number").val("");
		$("#modal-outbound-number").modal("hide");
		$("#id-new-number-cancel").show();
		$("#id-new-number-submit").show();
		$("#id-new-outbound-number-code-area").html("");
		$("#id-new-outbound-number").html("");
		$("#id-spinner-new-outbound-number").hide();
		if (response["status"]) {
			$("#id-tbody-outbound-numbers").empty();
			let self = this;
			GLOBAL.connection.getAllOutboundNumbers(function (data) {
				self.displayAllOutboundNumber(data);
			});
		}
		alert(response["message"]);
	}

    createNewOutboundNumber() {
		let codeArea = $("#id-new-outbound-number-code-area").val();
        let number = $("#id-new-outbound-number").val();
		if (codeArea === "" || number === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else if (!/^\d+$/.test($('#id-new-outbound-number-code-area').val()) || !/^\d+$/.test($('#id-new-outbound-number').val())) {
            let message = "Input must be a number"
            alert(message);
        } else {
			$("#id-new-number-cancel").hide();
			$("#id-new-number-submit").hide();
			$("#id-spinner-new-outbound-number").show();
			let self = this;
			GLOBAL.connection.createOutboundNumber(codeArea, number, function (data) {
				self.displayOutboundNumberCreation(data);
			});
		}
	}

    displayOutboundNumberDeletion(response) {
		if (response["status"]) {
			$("#id-tbody-outbound-numbers").empty();
			let self = this;
			GLOBAL.connection.getAllOutboundNumbers(function (data) {
				self.displayAllOutboundNumber(data);
			});
		}
		alert(response["message"]);
	}

    deleteOutboundNumber(idOutboundNumber) {
		let message = "Are you sure want to delete the outbound number?";
		let result = confirm(message);
		if (result) {
			$("#id-delete-outbound-number-" + idOutboundNumber).hide();
			$("#id-click-update-outbound-number-" + idOutboundNumber).hide();
			$("#id-spinner-action-outbound-number-" + idOutboundNumber).show();
			let self = this;
			GLOBAL.connection.deleteOutboundNumber(idOutboundNumber, function (data) {
				self.displayOutboundNumberDeletion(data);
			});
		}
    }

    displayOutboundNumberUpdate(response) {
		$("#modal-update-outbound-number").modal("hide");
		$("#id-update-outbound-number-cancel").show();
		$("#id-update-outbound-number-submit").show();
		$("#id-update-outbound-number-code-area").html("");
		$("#id-update-outbound-number").html("");
		$("#id-spinner-update-outbound-number").hide();
		if (response["status"]) {
			$("#id-tbody-outbound-numbers").empty();
			let self = this;
			GLOBAL.connection.getAllOutboundNumbers(function (data) {
				self.displayAllOutboundNumber(data);
			});
		}
		alert(response["message"]);
	}
    
    updateOutboundNumber() {
		let codeArea = $("#id-update-outbound-number-code-area").val();
        let number = $("#id-update-outbound-number").val();
		if (codeArea === "" || number === "") {
			let message = "Please complete all required fields";
			alert(message);
		} else if (!/^\d+$/.test($('#id-update-outbound-number-code-area').val()) || !/^\d+$/.test($('#id-update-outbound-number').val())) {
            let message = "Input must be a number"
            alert(message);
        } else {
			$("#id-update-outbound-number-cancel").hide();
			$("#id-update-outbound-number-submit").hide();
			$("#id-spinner-update-outbound-number").show();
			let self = this;
			GLOBAL.connection.updateOutboundNumber(this.ID_UPDATED_OUTBOUND_NUMBER, codeArea, number, function (data) {
				self.displayOutboundNumberUpdate(data);
			});
		}
	}
}

$(document).ready(function () {
	let OUTBOUNDNUMBER = new OutboundNumber();
	let greeting = "Hi, " + OUTBOUNDNUMBER.storage.get(Constant.STORAGE_KEY_USER_NAME);
	$("#id-username").html(greeting);
    $("#id-new-number-submit").click(function (){ OUTBOUNDNUMBER.createNewOutboundNumber(); });
    $("#id-update-outbound-number-submit").click(function (){ OUTBOUNDNUMBER.updateOutboundNumber(); });
    $("#id-tbody-outbound-numbers").empty();
    GLOBAL.connection.getAllOutboundNumbers(function (data) {
		OUTBOUNDNUMBER.displayAllOutboundNumber(data);
	});
});