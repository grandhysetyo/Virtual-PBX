import * as Constant from "./Constant.js"
import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"

class Index {
	constructor() {
		this.storage = new Storage.Storage();
	}

	displayLoginResult(response) {
		let status = response["status"];
		let message = response["message"];
		let data = response["data"];
		if (!status)
			alert(message);
		else {
			let isAdmin = data["is_admin"];
			let name = data["name"];
			let token = data["token"];
			this.storage.save(Constant.STORAGE_KEY_USER_NAME, name);
			this.storage.save(Constant.STORAGE_KEY_USER_TOKEN, token);
			if (isAdmin) {
				this.storage.save(Constant.STORAGE_KEY_USER_TYPE, Constant.USER_TYPE_ADMIN);
				GLOBAL.moveWindowTo("admin_pbx.html");
			}
			else {
				this.storage.save(Constant.STORAGE_KEY_USER_TYPE, Constant.USER_TYPE_NONADMIN);
				GLOBAL.moveWindowTo("user_pbx.html");
			}
		}
		$("#id-sign-in").show();
		$("#id-spinner-sign-in").hide();
	}
}

let INDEX = new Index();
window.signInWithGoogle = function(googleUser) {
	$("#id-sign-in").hide();
	$("#id-spinner-sign-in").show();

	let loginToken = googleUser.getAuthResponse().id_token;
	GLOBAL.connection.signInWithGoogle(loginToken, function(response){
		INDEX.displayLoginResult(response);
	});
	gapi.auth2.getAuthInstance().signOut();
};
