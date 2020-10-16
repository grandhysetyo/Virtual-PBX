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
    
    saveExcel(tableID, ReportName = ''){
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        ReportName = ReportName?ReportName+'.xls':''+'EmployeeName.xls';//modify excle sheet name here 
        
        // Create download link element
        downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob( blob, ReportName);
        }else{
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        
            // Setting the file name
            downloadLink.download = ReportName;
            
            //triggering the function
            downloadLink.click();
        }
    }

    savePDF(tableID) {
        // Choose the element that our invoice is rendered in.
        var tableSelect = document.getElementById(tableID);
        // Choose the element and save the PDF for our user.
        html2pdf()
          .from(tableSelect)
          .save();
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
    
    $('#tb').DataTable( {
        dom: 'Bfrtip',
        buttons: [{ 
            extend: 'pdf',
        }]
    } );
    $("#save-excel").click(function (){ callog.saveExcel('tb'); });
    // $("#save-pdf").click(function (){ callog.savePDF('tb'); });
    $("#save-pdf").on("click", function() {
        table.button( '.buttons-pdf' ).trigger();
    });
});

