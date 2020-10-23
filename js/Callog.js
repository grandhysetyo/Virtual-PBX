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

    displayExtensionPbxs(data) {
        // let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
        // $("#callerid").empty();    
        var arr = [];
		for (let callLog of data){
            arr.push(callLog[1]);
		}
		var filteredArray = arr.filter(function(item, pos){
		  return arr.indexOf(item)== pos; 
        });
            
		for (let callLog of filteredArray) {
			let formattedPbx;
            formattedPbx = "<option value='"+callLog+"'>"+ callLog +"</option>"
                        
            $("#callerid").append(formattedPbx);
            			
		}
		
    }

    displayStatusExt(data) {
        // let role = this.storage.get(Constant.STORAGE_KEY_USER_TYPE);
        // $("#status-call").empty();
		var arr = [];
		for (let callLog of data){
            arr.push(callLog[4]);
		}
		var filteredArray = arr.filter(function(item, pos){
		  return arr.indexOf(item)== pos; 
		});
		
		for (let callLog of filteredArray) {
			let formattedPbx;
			formattedPbx = "<option value='"+callLog+"'>"+ callLog +"</option>"
			$("#status-call").append(formattedPbx);
		}
		
    }

    displayCallLogData(data,callerId,statusExt,dateRange) {
        var table = $('#tb').DataTable();
        table.clear().draw();
		for (let callLog of data) {	            
            var billing = 0;
            if (callLog[4]=="ANSWERED"){
                billing = Math.floor(callLog[3]/10)*100;
            }

            if(callerId!='' || dateRange!='' || statusExt!=''){                
                if (callerId==callLog[1] || statusExt==callLog[4]) {                    
                    table.row.add([callLog[0],callLog[1],callLog[2],callLog[3],billing,callLog[4],callLog[5]]).draw();        
                }                
            }else{
                table.row.add([callLog[0],callLog[1],callLog[2],callLog[3],billing,callLog[4],callLog[5]]).draw();    
            }
		}		
    }
    
    saveExcel(tableID, ReportName = ''){
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        ReportName = ReportName?ReportName+'.xls':''+'call-log.xls';//modify excle sheet name here 
        
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
        var opt = {
            margin:       1,
            filename:     'callog-pbx.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 4 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
          };
        // Choose the element and save the PDF for our user.
        html2pdf()
            .set(opt)
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
            var dateRange = '';
            var callerId = '';
            var statusExt = '';
            GLOBAL.connection.getCallLogData(null, null, idpbx, null, function (data) {
                callog.displayCallLogData(data,callerId,statusExt,dateRange);
                callog.displayExtensionPbxs(data);
                callog.displayStatusExt(data);
            });            
        }
        
    });
    $('#filter').click(function(){
        var callerId = $('#callerid').val();
        var statusExt = $('#status-call').val();
        var dateRange = $('#daterange').val();        
        var idpbx = activities.options[activities.selectedIndex].value;         
        GLOBAL.connection.getCallLogData(null, null, idpbx, null, function (data) {
            callog.displayCallLogData(data,callerId,statusExt,dateRange);                     
        });
    });
       
    $("#save-excel").click(function (){ callog.saveExcel('tb'); });
    $("#save-pdf").click(function (){ callog.savePDF('tb'); });
    
});

