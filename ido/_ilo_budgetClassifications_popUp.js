	var selectedBudgetClassification = '';
	var newList;

	/**
	 * Module Description
	 * 
	 * Version    Date            Author           Remarks
	 * 1.00       22 Dec 2016     idor
	 *
	 */

	/**
	 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
	 * @appliedtorecord recordType 
	 * 
	 * @param {String} type Access mode: create, copy, edit
	 * @returns {Void}
	 */


		
		
	function budgetClass_suggestions_PageInit(type){
		
		var getContext = nlapiGetContext();
		if(getContext.role == '3') {
			var NewBtn = document.getElementById('item_custcol_cseg3_fs_tooltipMenu');
			addNewBtn = NewBtn.nextSibling;
			addNewBtn.innerHTML = '';
		}
		
		var output = '';	
		
		var input_box = document.getElementById('item_custcol_cseg3_display');
		input_box.value = '';
		input_box.defaultValue = '';
		input_box.readOnly = true;
		
		var arrowBtn = document.getElementById('parent_actionbuttons_item_custcol_cseg3_fs');
		arrowBtn.innerHTML = '';


		
		var para = document.createElement("p");
		para.style.cssText = 'color:blue;cursor:pointer';
		var node = document.createTextNode("Which one?");
		para.appendChild(node);

		var suggest = document.getElementsByClassName("listheader")[0];
		suggest.appendChild(para);

		suggest.addEventListener("click",filterOptions);

			output = '';
	   
	}

	/**
	 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
	 * @appliedtorecord recordType
	 * 
	 * @param {String} type Sublist internal id
	 * @param {String} name Field internal id
	 * @param {Number} linenum Optional line item number, starts from 1
	 * @returns {Void}
	 */
	function budgetClass_suggestions_FieldChanged(type, name, linenum){
		
//		if (name == 'entity') {
//			var fc_para = document.createElement("p");
//			fc_para.style.cssText = 'color:blue;cursor:pointer';
//			var fc_node = document.createTextNode("Which one?");
//			fc_para.appendChild(fc_node);
//
//			var fc_suggest = document.getElementsByClassName("listheader")[0];
//			fc_suggest.appendChild(fc_para);
//			fc_suggest.addEventListener("click",filterOptions);
//
//				output = ''; 
//		}
		
		if (name == 'subsidiary') {
			var fcS_para = document.createElement("p");
			fcS_para.style.cssText = 'color:blue;cursor:pointer';
			var fcS_node = document.createTextNode("Which one?");
			fcS_para.appendChild(fcS_node);

			var fcS_suggest = document.getElementsByClassName("listheader")[0];
			fcS_suggest.appendChild(fcS_para);
			fcS_suggest.addEventListener("click",filterOptions);

				output = ''; 
			
		}
		
		if (name == 'custcol_cseg3') {
			try{
				setItem();
			}
			catch(e) {
				alert('Unable to edit Budget Classification. Choose a different column.');
				//nlapiSelectNewLineItem('item');
				nlapiCancelLineItem('item');
			}
			
			 
		}
		
	 
	}

	function budgetClass_suggestions_ValidateInsert() {
		
		function addSuggest(){
		var vi_para = document.createElement("p");
		vi_para.style.cssText = 'color:blue;cursor:pointer';
		var vi_node = document.createTextNode("Which one?");
		vi_para.appendChild(vi_node);

		var vi_suggest = document.getElementsByClassName("listheader")[0];
		vi_suggest.appendChild(vi_para);
		vi_suggest.addEventListener("click",filterOptions);

			output = '';
		}
	addSuggest(); 
		
		return true;
		
	}


	function filterOptions(e) {
		e.preventDefault();
		console.log(e);

		var budgetClassOptions = [];
		var ownerBudgetClass = [];
		var ownerBudge = [];
		var sysBudge = [];
		var budgeNames = [];
		var budgetsOfOwner;
		var budgetsOfOwnerID;
		var today = new Date();
		var salaries=[];
		var requestor = nlapiGetFieldValue('entity');
		var requestor_subsid = nlapiGetFieldValue('subsidiary');
		console.log(requestor);
		var todayStr = nlapiDateToString(today);
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_owner', null,'anyof', requestor); // 'requestor' is the internal id of the requestor
		filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_subsidiary', null, 'anyof', requestor_subsid);

		filters[2] = new nlobjSearchFilter('custrecord_ilo_budget_type', null, 'is', '1');
		filters[3] = new nlobjSearchFilter('custrecord_ilo_budget_fromdate', null, 'notafter', todayStr);
		filters[4] = new nlobjSearchFilter('custrecord_ilo_budget_todate', null, 'notbefore', todayStr);
//		filters[5] = new nlobjSearchFilter('custrecord_ilo_budget_class', null, 'noneof', 'Salaries');

		var cols = new Array();
		cols[0] = new nlobjSearchColumn('internalid').setSort(false);
		cols[1] = new nlobjSearchColumn('custrecord_ilo_budget_class');
		cols[2] = new nlobjSearchColumn('custrecord_ilo_budget_exp_account');


		var budgetClassbyOwner = nlapiSearchRecord(
				'customrecord_ilo_budget_control_record', null, filters, cols);

				if(budgetClassbyOwner == null) {
				
				alert("There are no current Budget Classification suggestions for the current requestor");
				}
				else{

		for (var a = 0; a<budgetClassbyOwner.length; a++) { 
		  budgetsOfOwner  = budgetClassbyOwner[a].getText('custrecord_ilo_budget_class');
		  budgetsOfOwnerID = budgetClassbyOwner[a].getValue('custrecord_ilo_budget_class');
		  budgeNames.push(budgetsOfOwner);
		  if(budgetsOfOwner == 'Salaries' && budgetsOfOwnerID == '2') {
			  salaries.push({
				  budgetsOfOwner : budgetsOfOwner,
			      budgetsOfOwnerID : budgetsOfOwnerID 
			  });
		  }else{
		 ownerBudge.push({	 
			 budgetsOfOwner : budgetsOfOwner,
			 budgetsOfOwnerID : budgetsOfOwnerID
			 
		 });
		  }
		  
		}
		console.log(ownerBudge);
		
//		var arrToString = ownerBudge.toString();
//		var formattedString = arrToString.split(",").join("\n");
//		alert("The current Budget Classifications for this requestor are : \r\n" + formattedString + "\r\n");
		var toAdd = document.createDocumentFragment();
		var dest = document.getElementById('item_custcol_cseg3_fs');
console.log(dest);
		newList = document.createElement('ul');
		newList.style.cssText = style="overflow:auto;background:white;width:244px;height:100px;line-height:1.5em;cursor:pointer;list-style-type: none;border:1px solid lightgrey; margin:0;";
		var cont = document.getElementsByClassName("listheader")[0];
		cont.addEventListener("click", function() {
	    if (newList.style.display == 'none') {
	    	newList.style.display = 'block';

	      } else {
	    	  newList.style.display = 'none';
	      }
		});
		
		if(dest.childElementCount != 6) {
			for (var i = 0; i<ownerBudge.length; i++) {

				var newItem = document.createElement('li');
				newItem.id = ownerBudge[i].budgetsOfOwnerID;
				newItem.innerHTML = ownerBudge[i].budgetsOfOwner;
				//budgeNames.push(data[i].budgetsOfOwner);
				newItem.addEventListener("mouseover", mouseOver, false);
				newItem.addEventListener("mouseout", mouseOut, false);	
				newList.appendChild(newItem);	
		 		toAdd.appendChild(newList);
		}

			dest.appendChild(toAdd);
			console.dir(dest);
		}
		}
				
				document.addEventListener('click', function(e) {
					e.stopPropagation();
				    e = e || window.event;
			    var target = e.target || e.srcElement,
				text = target.textContent || text.innerText; 

			var selectedName = e.target.innerHTML;
			console.log(selectedName);
			if(budgeNames.indexOf(selectedName) != -1) {
				selectedBudgetClassification = e.target.id;

				console.log(selectedBudgetClassification);
				nlapiSetCurrentLineItemValue('item', 'custcol_cseg3', selectedBudgetClassification);
				
		
//				setTimeout(function(){ 
//					nlapiCommitLineItem('item');
//				}, 600);
//				
			}

			}, false);	

	}

	function setItem() {
		var items=[];
		var departments=[];
	 
		var selected = nlapiGetCurrentLineItemValue('item', 'custcol_cseg3');
		console.log(selected);

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custrecord_ilo_expense_item_id', null, 'doesnotstartwith', "");
		filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_class', null,'anyof', selected);
		var cols = new Array();
		cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_department');
	  cols[1] = new nlobjSearchColumn('custrecord_ilo_expense_item_id');
		var selectedBudget = nlapiSearchRecord(
				'customrecord_ilo_budget_control_record', null, filters, cols);

		var selectedDepartment;
		var selectedExpenseItem;

	    for(var i = 0; i<selectedBudget.length; i++) {
	    selectedExpenseItem = selectedBudget[i].getValue('custrecord_ilo_expense_item_id');
	    selectedDepartment = selectedBudget[i].getValue('custrecord_ilo_budget_department');
	    if(selectedExpenseItem == ''){
	    	continue;
	    }
	    items.push(selectedExpenseItem);
	    
	    if(selectedDepartment == '') {
	    	continue;
	    }
	    departments.push(selectedDepartment);
	    };
		
	console.log(departments);
		setTimeout(function(){ 
			nlapiSetCurrentLineItemValue('item', 'department', departments[0]);
		}, 600);
		
		nlapiSetCurrentLineItemValue('item', 'item', items[0]);

	};

	
	function mouseOver() {

		this.style.cssText = 'background:#607799;color:white';
	}


	function mouseOut() {

		this.style.cssText = 'background:white; color: black;';
	}



