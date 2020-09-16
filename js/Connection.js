// Temporarily, cache is disabled. Please take a look for improvement.
import * as BaseConnection from "./BaseConnection.js"
import * as Constant from "./Constant.js"
import * as Storage from "./Storage.js"

export class Connection {
	constructor() {
		this.baseConnection = new BaseConnection.BaseConnection();
		this.storage = new Storage.Storage();
	}

    signInWithGoogle(token, callback) {
        let data = {
            "token": token
        };
        this.baseConnection.signInWithGoogle(data, callback);
    }

    getLocations(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_LOCATIONS))
            callback(this.storage.get(Constant.STORAGE_KEY_LOCATIONS));
        else
            this.baseConnection.getLocations(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            // this.storage.save(Constant.STORAGE_KEY_LOCATIONS, data);
            callback(data);
        }
    }

    getAllPbxRequests(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_ALL_PBX_REQUESTS))
            callback(this.storage.get(Constant.STORAGE_KEY_ALL_PBX_REQUESTS));
        else
            this.baseConnection.getAllPbxRequests(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            // this.storage.save(Constant.STORAGE_KEY_ALL_PBX_REQUESTS, data);
            callback(data);
        }
    }

    createPbxRequest(name, location, number_of_extension, callback) {
        let data = {
            "name": name,
            "location": location,
            "number_of_extension": number_of_extension
        };
        this.baseConnection.createPbxRequest(data, callback);
    }

    deletePbxRequest(pbxRequestId, callback) {
        let data = {
            "id_pbx_request": pbxRequestId
        };
        this.baseConnection.deletePbxRequest(data, callback);
    }

    approvePbxRequest(pbxRequestId, callback) {
        let data = {
            "id_pbx_request": pbxRequestId
        };
        this.baseConnection.approvePbxRequest(data, callback);
    }

    getAllPbxs(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_ALL_PBXS))
            callback(this.storage.get(Constant.STORAGE_KEY_ALL_PBXS));
        else
            this.baseConnection.getAllPbxs(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    deletePbx(pbxId, callback) {
        let data = {
            "id_pbx": pbxId
        };
        this.baseConnection.deletePbx(data, callback);
    }

    getAllExtensions(idPbx, callback) {
        let data = {
            "id_pbx": idPbx
        };
        this.baseConnection.getAllExtensions(data, noCacheToStorage);

        function noCacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    getOutgoingStatus(idPbx, callback) {
        let data = {
            "id_pbx": idPbx
        };
        this.baseConnection.getOutgoingStatus(data, noCacheToStorage);

        function noCacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    getIncomingStatus(idPbx, callback) {
        let data = {
            "id_pbx": idPbx
        };
        this.baseConnection.getIncomingStatus(data, noCacheToStorage);

        function noCacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    updateOutgoing(idPbx, callLimit, callback) {
        let data = {
            "id_pbx": idPbx,
            "call_limit": callLimit
        };
        this.baseConnection.updateOutgoing(data, callback);
    }

    updateIncoming(idPbx, callback) {
        let data = {
            "id_pbx": idPbx
        };
        this.baseConnection.updateIncoming(data, callback);
    }

    updateOperator(idExtension, callback) {
        let data = {
            "id_extension": idExtension
        };
        this.baseConnection.updateOperator(data, callback);
    }

    createExtension(idPbx, username, secret, name_assignee, email_assignee, callback) {
        let data = {
            "id_pbx": idPbx,
            "username": username,
            "secret": secret,
			"name_assignee": name_assignee,
			"email_assignee": email_assignee
        };
        this.baseConnection.createExtension(data, callback);
    }

    updateExtension(idExtension, username, secret, forwarded_number, callback) {
        let data = {
            "id_extension": idExtension,
            "username": username,
            "secret": secret,
            "forwarded_number": forwarded_number
        };
        this.baseConnection.updateExtension(data, callback);
    }

    deleteExtension(idExtension, callback) {
        let data = {
            "id_extension": idExtension
        };
        this.baseConnection.deleteExtension(data, callback);
    }

    getCallLogData(page=null, per_page=null, id_pbx, status=null, callback) {
        let data = {
            "page": page,
            "per_page": per_page,
            "id_pbx": id_pbx,
            "status": status
        };
        this.baseConnection.getCallLogData(data, noCacheToStorage)

        function noCacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    getAllOutboundNumbers(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_ALL_OUTBOUND_NUMBERS))
            callback(this.storage.get(Constant.STORAGE_KEY_ALL_OUTBOUND_NUMBERS));
        else
            this.baseConnection.getAllOutboundNumbers(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    createOutboundNumber(codeArea, number, callback) {
        let data = {
            "code_area": codeArea,
            "outbound_number": number
        };
        this.baseConnection.createOutboundNumber(data, callback);
    }

    updateOutboundNumber(idOutboundNumber, codeArea, number, callback) {
        let data = {
            "id_outbound_num": idOutboundNumber,
            "code_area": codeArea,
            "outbound_number": number
        };
        this.baseConnection.updateOutboundNumber(data, callback);
    }

    deleteOutboundNumber(idOutboundNumber, callback) {
        let data = {
            "id_outbound_num": idOutboundNumber
        };
        this.baseConnection.deleteOutboundNumber(data, callback);
    }

    getAllVouchers(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_ALL_VOUCHERS))
            callback(this.storage.get(Constant.STORAGE_KEY_ALL_VOUCHERS));
        else
            this.baseConnection.getAllVouchers(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    getTopUpHistory(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_ALL_VOUCHERS))
            callback(this.storage.get(Constant.STORAGE_KEY_ALL_VOUCHERS));
        else
            this.baseConnection.getTopUpHistory(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    buyVoucher(credit, callback) {
        let data = {
            "credit": credit
        };
        this.baseConnection.buyVoucher(data, callback);
    }

    topUpWallet(credit, callback) {
        let data = {
            "credit": credit
        };
        this.baseConnection.topUpWallet(data, callback);
    }

    approveVoucher(id_voucher, callback) {
        let data = {
            "id_voucher": id_voucher
        };
        this.baseConnection.approveVoucher(data, callback);
    }

    rejectVoucher(id_voucher, callback) {
        let data = {
            "id_voucher": id_voucher
        };
        this.baseConnection.rejectVoucher(data, callback);
    }

    uploadPaymentFile(id_voucher, file, callback) {
        let data = {
            "id_voucher": id_voucher,
            "file": file
        };
        this.baseConnection.uploadPaymentFile(data, callback);
    }

    getPaymentFile(id_voucher, callback) {
        let data = {
            "id_voucher": id_voucher
        };
        this.baseConnection.getPaymentFile(data, callback);
    }

    reedemVoucher(voucher_code, callback) {
        let data = {
            "voucher_code": voucher_code
        };
        this.baseConnection.reedemVoucher(data, callback);
    }

    getSaldo(callback) {
        if (this.storage.isExist(Constant.STORAGE_KEY_USER_SALDO))
            callback(this.storage.get(Constant.STORAGE_KEY_USER_SALDO));
        else
            this.baseConnection.getSaldo(cacheToStorage);

        function cacheToStorage(response) {
            let data = response["data"];
            callback(data);
        }
    }

    topUpSaldoExtension(idPbx, idExtension, saldo, callback) {
        let data = {
            "id_pbx": idPbx,
            "id_extension": idExtension,
            "saldo": saldo
        };
        this.baseConnection.topUpSaldoExtension(data, callback);
    }

    topUpSaldoPBX(idPbx, saldo, callback) {
        let data = {
            "id_pbx": idPbx,
            "saldo": saldo
        };
        this.baseConnection.topUpSaldoPBX(data, callback);
    }
    
}
