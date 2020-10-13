import {GLOBAL} from "./Global.js";
import * as Storage from "./Storage.js"
import * as Constant from "./Constant.js";

class Callog {
	constructor() {
		this.storage = new Storage.Storage();		
    }
    
    displayAllPbxs(data) {
		// let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
		for (let pbx of data) {
			let formattedPbx;
			formattedPbx = "<option value='"+pbx["id_pbx"]+"'>"+ pbx["pbx_name"] +"</option>"
			$("#pbx-name").append(formattedPbx);
		}
		
    }
    
}
$(document).ready(function () {
    let callog = new Callog(); 
    callog.displayBasedOnRole();   
    GLOBAL.connection.getAllPbxs(function(data) {
        callog.displayAllPbxs(data);
    });
});

