import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"
import * as Constant from "./Constant.js";

class Voucher {
	constructor() {
        this.storage = new Storage.Storage();
        this.ID_VOUCHER = -1;
	}

	displayActiveVouchers(data) {
		for (let voucher of data) {
			if (voucher["status"] !== "Reedemed" && voucher["status"] !== "Verified") {
                let formattedVoucher = "<tr>\n" +
                    "<td>" + voucher["date"] + "</td>\n" +
                    "<td>" + voucher["credit"] + "</td>\n" +
                    "<td>" + voucher["status"] + "</td>\n" +
                    "<td>" +
                    "<div id=\"id-spinner-action-voucher-" + voucher["id_voucher"] + "\" class=\"spinner-border text-primary\" role=\"status\" style=\"display: none;\"></div>" +
                    "<button id=\"btn-detail-voucher-" + voucher["id_voucher"] + "\" type=\"button\" class=\"btn btn-sm\" style=\"background: #4e73df; color: white; margin-left: 5pt;\"></i>Detail</button>"
                    "</td>\n" +
                    "</tr>";
			    $("#id-tbody-vouchers-active").append(formattedVoucher);
            }
		}

		let self = this;

		$("[id^=\"btn-detail-voucher\"]").click(function (event) {
			self.ID_VOUCHER = event.target.id.split("-")[3];
			let selected_voucher = data[0];
			for (let voucher of data) {
				if (voucher["id_voucher"] === parseInt(self.ID_VOUCHER)) {
					selected_voucher = voucher;
				}
			}
			if (selected_voucher["payment_file"]) {
				$("#id-payment-check-file").hide()
				$("#id-voucher-detail-submit").hide()
				$("#label-upload-payment-check").html("<b>Payment Proof File</b>")

				// Show payment proof file
				GLOBAL.connection.getPaymentFile(self.ID_VOUCHER, function (data, type) {
					let viewFull = () => {
						window.open(data, '_blank')
					}

					if (type.includes("pdf")) {
						$('#id-payment-proof-wrapper').html(
							`<p class="text-center py-3">Preview not available</p>`
						)
					} else {
						$('#id-payment-proof-wrapper').html(
							$('<img>', {
								id:'img-payment-proof',
								src:data,
								class:"img-fluid img-thumbnail"
							})
						)
					}

					let btnView = `<button class="btn view-button" style="width:100%"><i class="fa fa-download"></i> View Full</button>`
					$('#id-payment-proof-wrapper').append(btnView)
					$('.view-button').click(viewFull)
				});
			} else {
				$("#id-payment-check-file").show()
				$("#id-voucher-detail-submit").show()
				$("#label-upload-payment-check").html("<b>Upload Payment Check</b>")
				$('#id-payment-proof-wrapper').html("")
			}
			$("#id-detail-voucher-date").html("<b>Date/Time: </b>"+selected_voucher["date"]);
            $("#id-detail-voucher-nominal").html("<b>Nominal: </b>"+selected_voucher["credit"]);
            $("#id-detail-voucher-status").html("<b>Status: </b>"+selected_voucher["status"]);
			$("#modal-voucher-detail").modal("show");
		});
		
	}

	displayTopUpHistory(data) {
		$("#id-buy-voucher-cancel").show();
		$("#id-buy-voucher-submit").show();
		$("#id-spinner-top-up").hide();
		$("#id-tbody-top-up-history").html("")
		for (let topUp of data) {
			let formattedVoucher = "<tr>\n" +
				"<td>" + topUp["created_at"] + "</td>\n" +
				"<td>" + topUp["credit"] + "</td>\n" +
				"</tr>";
			$("#id-tbody-top-up-history").append(formattedVoucher);
		}
	}

	displayHistoryVouchers(data) {
		for (let voucher of data) {
			if (voucher["status"] !== "Pending" && voucher["status"] !== "Rejected") {
                let formattedVoucher = "<tr>\n" +
                    "<td>" + voucher["date"] + "</td>\n" +
                    "<td>" + voucher["credit"] + "</td>\n" +
					"<td>" + voucher["status"] + "</td>\n" +
					"<td>" + voucher["voucher_code"] + "</td>\n" +
                    "<td>" +
                    "<div id=\"id-spinner-action-voucher-" + voucher["id_voucher"] + "\" class=\"spinner-border text-primary\" role=\"status\" style=\"display: none;\"></div>" +
                    "<button id=\"btn-detail-voucher-history-" + voucher["id_voucher"] + "\" type=\"button\" class=\"btn btn-sm\" style=\"background: #4e73df; color: white; margin-left: 5pt;\">Detail</button>"
                    "</td>\n" +
                    "</tr>";
			    $("#id-tbody-voucher-history").append(formattedVoucher);
            }
		}

		let self = this;

		$("[id^=\"btn-detail-voucher-history\"]").click(function (event) {
			self.ID_VOUCHER = event.target.id.split("-")[4];
			let selected_voucher = data[0];
			for (let voucher of data) {
				if (voucher["id_voucher"] === parseInt(self.ID_VOUCHER)) {
					selected_voucher = voucher;
				}
			}
			$("#id-detail-histroy-voucher-date").html("<b>Date/Time: </b>"+selected_voucher["date"]);
            $("#id-detail-histroy-voucher-nominal").html("<b>Nominal: </b>"+selected_voucher["credit"]);
			$("#id-detail-histroy-voucher-status").html("<b>Status: </b>"+selected_voucher["status"]);
			$("#id-detail-histroy-voucher-code").html("<b>Voucher Code: </b>"+selected_voucher["voucher_code"]);
			$("#modal-history-voucher-detail").modal("show");
		});
	}

	buyNewVoucher() {
		let credit = $("#id-voucher-nominal").val();
		$("#id-buy-voucher-cancel").hide();
		$("#id-buy-voucher-submit").hide();
		$("#id-spinner-buy-voucher").show();
		let self = this;
		GLOBAL.connection.buyVoucher(credit, function (data) {
            self.displayVoucher(data);
        });
	}
	
	topUpWallet() {
		let credit = $("#id-top-up-nominal").val();
		$("#id-top-up-cancel").hide();
		$("#id-top-up-submit").hide();
		$("#id-spinner-top-up").show();
		let self = this;
		GLOBAL.connection.topUpWallet(credit, function (data) {
			$("#id-top-up-cancel").show();
			$("#id-top-up-submit").show();
			$("#id-spinner-top-up").hide();
			$("#modal-top-up").modal("hide");
			alert(data["message"]);
			GLOBAL.connection.getTopUpHistory(function (data) {
				self.displayTopUpHistory(data);
			});	
		});
    }
    
    displayVoucher(response) {
		$("#modal-buy-voucher").modal("hide");
		$("#modal-voucher-detail").modal("hide");
		$("#id-buy-voucher-cancel").show();
		$("#id-buy-voucher-submit").show();
		$("#id-spinner-buy-voucher").hide();
		$("#id-voucher-detail-reject").show();
		$("#id-voucher-detail-approve").show();
		$("#id-spinner-voucher-detail").hide();
		if (response["status"]) {
			$("#id-tbody-vouchers-active").empty();
			$("#id-tbody-voucher-history").empty();
			let self = this;
			GLOBAL.connection.getAllVouchers(function (data) {
				self.displayActiveVouchers(data);
			});
			GLOBAL.connection.getAllVouchers(function (data) {
				self.displayHistoryVouchers(data);
			});
		}
		alert(response["message"]);
	}

	approveVoucher() {
		let self = this;
		$("#id-voucher-detail-reject").hide();
		$("#id-voucher-detail-approve").hide();
		$("#id-spinner-voucher-detail").show();
		GLOBAL.connection.approveVoucher(self.ID_VOUCHER, function (data) {
            self.displayVoucher(data);
        });
	}

	rejectVoucher() {
		let self = this;
		$("#id-voucher-detail-reject").hide();
		$("#id-voucher-detail-approve").hide();
		$("#id-spinner-voucher-detail").show();
		GLOBAL.connection.rejectVoucher(self.ID_VOUCHER, function (data) {
            self.displayVoucher(data);
        });
	}

	uploadPaymentFile() {
		let self = this;
		let file = $('#id-payment-check-file').prop('files')[0];
		$("#id-voucher-detail-cancel").hide();
		$("#id-voucher-detail-submit").hide();
		$("#id-spinner-voucher-detail").show();
		GLOBAL.connection.uploadPaymentFile(self.ID_VOUCHER, file, function (data) {
            self.displayVoucher(data);
        });
	}

}

$(document).ready(function () {
	let VOUCHER = new Voucher();
	let greeting = "Hi, " + VOUCHER.storage.get(Constant.STORAGE_KEY_USER_NAME);
	$("#id-username").html(greeting);
	$("#id-buy-voucher-submit").click(function (){ VOUCHER.buyNewVoucher(); });
	$("#id-top-up-submit").click(function (){ VOUCHER.topUpWallet(); });
	$("#id-voucher-detail-approve").click(function (){ VOUCHER.approveVoucher(); });
	$("#id-voucher-detail-reject").click(function (){ VOUCHER.rejectVoucher(); });
	$("#id-voucher-detail-submit").click(function (){ VOUCHER.uploadPaymentFile(); });
	$("#id-tbody-vouchers-active").empty();
	$("#id-tbody-vouchers-history").empty();
	GLOBAL.connection.getTopUpHistory(function (data) {
		VOUCHER.displayTopUpHistory(data);
	});
	GLOBAL.connection.getAllVouchers(function (data) {
		VOUCHER.displayActiveVouchers(data);
	});
	GLOBAL.connection.getAllVouchers(function (data) {
		VOUCHER.displayHistoryVouchers(data);
	});
});
