/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 May 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */

	var ctx = nlapiGetContext();
	var role = ctx.role;
	

function syg_filterprojects_PageInit(type){
  

	console.log('filter projects - pageInit')

	var customerList = document.getElementById('item_customer_fs_tooltipMenu');
	
	if(customerList != null) {
		try{
			
	
	if(role != "1010" || role !=  "1011") {
		
	
				
//				var searchPopUp = customerList.children[customerList.children.length-1];
//				searchPopUp.style.display = 'none';
	}

	customerList.addEventListener("click", function(e){
	e.preventDefault();
	console.log('click')
	
	
	

	setTimeout(function(){
	   onlyProjects()
	    }, 700);
	});

	function onlyProjects() {
	var popupdiv = document.getElementById('inner_popup_div');
	var popuptable = popupdiv.children[0]
	popuptable.style.opacity = 0;
	var textfield = document.getElementById('st')
	if( textfield != null) {
	textfield.value = 'PRJ%';
	textfield.disabled = true;
	}
	var searchBtn = document.getElementById('Search')
	try{
		searchBtn.click();
		searchBtn.hidden = true
		
	}catch(err){
		
		searchBtn.click();
		searchBtn.hidden = true
	}


	setTimeout(function(){

	var textfield2 = document.getElementById('st')
	var searchBtn2 = document.getElementById('tdbody_Search')

	var td = textfield2.parentElement;
	var searchtd = searchBtn2.children[0]
	td.hidden = true
	searchtd.style.display = 'none';
	searchBtn2.style.display = 'none';
	 
	 }, 700);
	}
	}catch(err) {
		
		if(role != "1010" || role !=  "1011") {

			var searchPopUp = customerList.children[customerList.children.length-1];
			searchPopUp.style.display = 'none';
}

		customerList.addEventListener("click", function(e){
		e.stopPropagation
		e.preventDefault();
		console.log('click')

		setTimeout(function(){
		   onlyProjects()
		    }, 700);
		});
		}
	
	}// end of customerList != null
	

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function syg_filterprojects_LineInit(type) {
  


	
	console.log('filter projects - LineInit');
	
	var customerList = document.getElementById('item_customer_fs_tooltipMenu');
	
	if(customerList != null) {
		try{
			
			if(role != "1010" || role !=  "1011") {

//				var searchPopUp = customerList.children[customerList.children.length-1];
//				searchPopUp.style.display = 'none';
	}
	customerList.addEventListener("click", function(e){
	e.stopPropagation
	e.preventDefault();
	console.log('click')
	setTimeout(function(){
	   onlyProjects()
	    }, 700);
	});

	function onlyProjects() {
		
		var popupdiv = document.getElementById('inner_popup_div');
		var popuptable = popupdiv.children[0]
		popuptable.style.opacity = 0;

	var textfield = document.getElementById('st')
	if( textfield != null) {
	textfield.value = 'PRJ%';
	textfield.disabled = true;
	}
	var searchBtn = document.getElementById('Search')
	try{
		searchBtn.click();
		searchBtn.hidden = true
		
	}catch(err){
		
		searchBtn.click();
		searchBtn.hidden = true
	}

	setTimeout(function(){

	var textfield2 = document.getElementById('st')
	var searchBtn2 = document.getElementById('tdbody_Search')

	var td = textfield2.parentElement;
	var searchtd = searchBtn2.children[0]
	td.hidden = true
	searchtd.style.display = 'none';
	searchBtn2.style.display = 'none';
	 }, 700);
	}
	}catch(err) {
		if(role != "1010" || role !=  "1011") {

//			var searchPopUp = customerList.children[customerList.children.length-1];
//			searchPopUp.style.display = 'none';
}
		customerList.addEventListener("click", function(e){
		e.stopPropagation
		e.preventDefault();
		console.log('click')

		setTimeout(function(){
		   onlyProjects()
		    }, 700);
		});
		}
	
	}// end of customerList != null

}
