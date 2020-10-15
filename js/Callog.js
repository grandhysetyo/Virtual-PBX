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

    displayCallLogData(data) {
        var table = $('#tb').DataTable();
        table.clear().draw();
		for (let callLog of data) {			
            table.row.add([callLog[0],callLog[1],callLog[2],callLog[3],callLog[6],callLog[4],callLog[5]]).draw();    
		}		
	}
    
}
$(document).ready(function () {
    let callog = new Callog();     
    GLOBAL.connection.getAllPbxs(function(data) {
        callog.displayAllPbxs(data);
    });
    
    var activities = document.getElementById("pbx-name");
    activities.addEventListener("change", function() {
        if(activities.value != "")
        {            
            var idpbx = activities.options[activities.selectedIndex].value;            
            GLOBAL.connection.getCallLogData(null, null, idpbx, null, function (data) {
                callog.displayCallLogData(data);
            });
        }
        
    });
});

