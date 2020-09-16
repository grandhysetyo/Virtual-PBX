import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"
import * as Constant from "./Constant.js";

class Wallet {
	constructor() {
        this.storage = new Storage.Storage();
	}

	displaySaldo(data) {
        let saldo = data["saldo"];
        $("#id-wallet-saldo").html("");
		$("#id-wallet-saldo").html("Rp. " + saldo);
	}

	getSaldo(response) {
		$("#id-voucher-top-up").show();
		$("#id-spinner-voucher-top-up").hide();
		$("#id-voucher-code").val("");
		let self = this;
		GLOBAL.connection.getSaldo(function (data) {
			self.displaySaldo(data);
		});
		alert(response["message"]);
	}

	reedemVoucher() {
		let voucher_code = $("#id-voucher-code").val();
		$("#id-voucher-top-up").hide();
		$("#id-spinner-voucher-top-up").show();
		let self = this;
		GLOBAL.connection.reedemVoucher(voucher_code, function (data) {
            self.getSaldo(data);
        });
    }

}

$(document).ready(function () {
	let WALLET = new Wallet();
	let greeting = "Hi, " + WALLET.storage.get(Constant.STORAGE_KEY_USER_NAME);
	$("#id-username").html(greeting);
	$("#id-voucher-top-up").click(function (){ WALLET.reedemVoucher(); });
	GLOBAL.connection.getSaldo(function (data) {
		WALLET.displaySaldo(data);
	});
});
