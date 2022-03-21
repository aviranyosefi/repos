
function getEmpsSups() {


var allEmpsSups = [];

			var cols = new Array();
			cols[0] = new nlobjSearchColumn('custrecord_ilo_emp_supervisor_employee');
			cols[1] = new nlobjSearchColumn('custrecord_ilo_emp_supervisor_supervisor');


			var s = nlapiSearchRecord('customrecord_ilo_emp_supervisor_rec', null, null, cols);
			
			
						if (s != null) {
				s.forEach(function(line) {
					
					allEmpsSups.push({
					
					employee: line.getValue('custrecord_ilo_emp_supervisor_employee'),
					supervisor : line.getValue('custrecord_ilo_emp_supervisor_supervisor'),
					recID : line.id
					
					
					});
									
				});

			};
			
			return allEmpsSups;
			
			
			}


function update_employee_supervisor(type){
	
	if(type == 'edit') {
		
		var getSupervisor = nlapiGetFieldValue('supervisor');
		
		if(getSupervisor != null || "" || undefined) {
			
			var currEmp = nlapiGetFieldValue('altname');
			var currEmpID = nlapiGetRecordId();

			var allEmps = getEmpsSups();
			
			var check = '';
			var recID = '';
			
			for(var i = 0; i<allEmps.length; i++) {
				
				if(currEmp != allEmps[i].employee) {
					
					check = 'to create';
					
				}	
				if(currEmp == allEmps[i].employee) {
					
					check = 'to edit';
					recID = allEmps[i].recID;
					
				}	
				}
			
			if(check == 'to edit') {
				
				var rec = nlapiLoadRecord('customrecord_ilo_emp_supervisor_rec', recID);
				rec.setFieldValue('custrecord_ilo_emp_supervisor_employee', currEmp)
				rec.setFieldValue('custrecord_ilo_emp_supervisor_supervisor', getSupervisor);
				rec.setFieldValue('custrecord_ilo_emp_supervisor_emp_id', currEmpID);
				
				nlapiSubmitRecord(rec);
				
				
			}
			
		if(check == 'to create') {
				
				var rec = nlapiCreateRecord('customrecord_ilo_emp_supervisor_rec', recID);
				rec.setFieldValue('custrecord_ilo_emp_supervisor_employee', currEmp)
				rec.setFieldValue('custrecord_ilo_emp_supervisor_supervisor', getSupervisor);
				rec.setFieldValue('custrecord_ilo_emp_supervisor_emp_id', currEmpID);
				
				nlapiSubmitRecord(rec);
				
				
			}
			
			
		
				
			

		}

	}
	
 
}


function update_emp_rec_afterSubmit() {
	
	if(type == 'create') {
		
		var getSupervisor = nlapiGetFieldValue('supervisor');
		var getNewID = nlapiGetRecordId();
		if(getSupervisor != null || "" || undefined) {
			
			var currEmp = nlapiGetFieldValue('altname');

			
			var newRec = nlapiCreateRecord('customrecord_ilo_emp_supervisor_rec');
			newRec.setFieldValue('custrecord_ilo_emp_supervisor_employee', currEmp);
			newRec.setFieldValue('custrecord_ilo_emp_supervisor_supervisor', getSupervisor);
			newRec.setFieldValue('custrecord_ilo_emp_supervisor_emp_id', getNewID);
			nlapiSubmitRecord(newRec);
			
		
		}

	}
}
