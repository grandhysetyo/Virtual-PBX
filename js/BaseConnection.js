import * as Constant from "./Constant.js"
import * as Storage from "./Storage.js"

export class BaseConnection {
	constructor() {
		this.storage = new Storage.Storage();
	}

    requestPost(url, data, callback) {
        let self = this;
		$.ajax({
            url: url,
            type: "POST",
            data: data,
            crossDomain: true,
            beforeSend: function (request) {
                let token = self.storage.get(Constant.STORAGE_KEY_USER_TOKEN);
                request.setRequestHeader("Authorization", "Bearer " + token);
            }})
            .done(function (response) {
                callback(response);
            })
            .fail(function (error) {
                callback(error);
            })
    }

    requestGet(url, callback) {
		let self = this;
        $.ajax({
            url: url,
            type: "GET",
            beforeSend: function (request) {
                let token = self.storage.get(Constant.STORAGE_KEY_USER_TOKEN);
                request.setRequestHeader("Authorization", "Bearer " + token);
            }})
            .done(function (response) {
                callback(response);
            })
            .fail(function (error) {
                callback(error)
            })
    }

    getFile(url, callback) {
        let self = this;
        let token = self.storage.get(Constant.STORAGE_KEY_USER_TOKEN);
		const options = {
			headers: {
				"Authorization": "Bearer " + token
			}
		};

		fetch(url, options)
			.then(res => res.blob())
			.then(blob => {
                callback(URL.createObjectURL(blob), blob.type);
			});
    }

    uploadFile(url, data, callback) {
        let self = this;
        let formData = new FormData()
        for (let key in data) {
            formData.append(key, data[key]);
        }
		$.ajax({
            url: url,
            type: "POST",
            data: formData,
            crossDomain: true,
            processData: false,
            contentType: false,
            beforeSend: function (request) {
                let token = self.storage.get(Constant.STORAGE_KEY_USER_TOKEN);
                request.setRequestHeader("Authorization", "Bearer " + token);
            }})
            .done(function (response) {
                callback(response);
            })
            .fail(function (error) {
                callback(error);
            })
    }

    signInWithGoogle(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_SIGN_IN_WITH_GOOGLE;
        this.requestPost(url, data, callback);
    }

    getLocations(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_LOCATIONS;
        this.requestGet(url, callback)
    }

    createPbxRequest(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_CREATE_PBX_REQUEST;
        this.requestPost(url, data, callback);
    }

    getAllPbxRequests(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_ALL_PBX_REQUESTS;
        this.requestGet(url, callback);
    }

    deletePbxRequest(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_DELETE_PBX_REQUEST;
        this.requestPost(url, data, callback);
    }

    approvePbxRequest(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_APPROVE_PBX_REQUEST;
        this.requestPost(url, data, callback);
    }

    getAllPbxs(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_ALL_PBXS;
        this.requestGet(url, callback);
    }

    deletePbx(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_DELETE_PBX;
        this.requestPost(url, data, callback);
    }

    getAllExtensions(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_ALL_EXTENSIONS;
        this.requestPost(url, data, callback);
    }

    createExtension(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_CREATE_EXTENSION;
        this.requestPost(url, data, callback);
    }

    updateExtension(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_UPDATE_EXTENSION;
        this.requestPost(url, data, callback);
    }

    deleteExtension(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_DELETE_EXTENSION;
        this.requestPost(url, data, callback);
    }

    getOutgoingStatus(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_OUTGOING_STATUS;
        this.requestPost(url, data, callback);
    }

    getIncomingStatus(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_INCOMING_STATUS;
        this.requestPost(url, data, callback);
    }

    updateOutgoing(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_UPDATE_OUTGOING;
        this.requestPost(url, data, callback);
    }

    updateIncoming(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_UPDATE_INCOMING;
        this.requestPost(url, data, callback);
    }

    updateOperator(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_UPDATE_OPERATOR;
        this.requestPost(url, data, callback);
    }

    getCallLogData(data, callback) {
        let page = data.page;
        let per_page = data.per_page;
        let id_pbx = data.id_pbx;
        let status = data.status;
        let url = Constant.URL_BASE;
        if (page === null && per_page === null) {
            url += Constant.URL_GET_CALL_LOG_DATA + "?id_pbx=" + id_pbx ;
        } else
        if (status != null) {
            url += Constant.URL_GET_CALL_LOG_DATA + "?page=" + page + "&perPage=" + per_page + "&status=" +status ;
        } else {
            url += Constant.URL_GET_CALL_LOG_DATA + "?page=" + page + "&perPage=" + per_page;
        }
        this.requestGet(url, callback);
    }

    getAllOutboundNumbers(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_ALL_OUTBOUND_NUMBERS;
        this.requestGet(url, callback);
    }

    createOutboundNumber(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_CREATE_OUTBOUND_NUMBER;
        this.requestPost(url, data, callback);
    }

    updateOutboundNumber(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_UPDATE_OUTBOUND_NUMBER;
        this.requestPost(url, data, callback);
    }

    deleteOutboundNumber(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_DELETE_OUTBOUND_NUMBER;
        this.requestPost(url, data, callback);
    }

    getAllVouchers(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_ALL_VOUCHERS;
        this.requestGet(url, callback);
    }

    getTopUpHistory(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_TOP_UP_HISTORY;
        this.requestGet(url, callback);
    }

    buyVoucher(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_BUY_VOUCHER;
        this.requestPost(url, data, callback);
    }

    topUpWallet(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_TOP_UP_WALLET;
        this.requestPost(url, data, callback);
    }

    approveVoucher(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_APPROVE_VOUCHER;
        this.requestPost(url, data, callback);
    }

    rejectVoucher(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_REJECT_VOUCHER;
        this.requestPost(url, data, callback);
    }

    uploadPaymentFile(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_PAYMENT_PROOF;
        this.uploadFile(url, data, callback);
    }

    getPaymentFile(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_PAYMENT_PROOF + "?id_voucher="+data.id_voucher;
        this.getFile(url, callback);
    }

    reedemVoucher(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_REEDEM_VOUCHER;
        this.requestPost(url, data, callback);
    }

    getSaldo(callback) {
        let url = Constant.URL_BASE + Constant.URL_GET_SALDO;
        this.requestGet(url, callback);
    }

    topUpSaldoExtension(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_TOP_UP_SALDO_EXTENSION;
        this.requestPost(url, data, callback);
    }

    topUpSaldoPBX(data, callback) {
        let url = Constant.URL_BASE + Constant.URL_TOP_UP_SALDO_PBX;
        this.requestPost(url, data, callback);
    }
}
