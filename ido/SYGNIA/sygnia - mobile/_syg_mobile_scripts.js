/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jul 2018     idor
 *
 */
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 May 2018     idor
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

function syg_hideFields(type) {

    if (type == 'view') {

        console.log('in the view')
    }

    console.log('role : ' + role)

    if (role == '1010' || role == '1011') {

        console.log('in employee center')

        //remove travel record body buttons
        var travel_addBtn = document.getElementById("custbody_travel_record_popup_new");
        var travel_openBtn = document.getElementById("custbody_travel_record_popup_link");

        if (travel_addBtn != null) {
            travel_addBtn.remove()
        }

        if (travel_openBtn != null) {
            travel_openBtn.remove()
        }

        //remove travel column buttons
        var travel_addBtn_col = document.getElementById("custcol_ilo_travel_number_column_popup_new");
        var travel_openBtn_col = document.getElementById("custcol_ilo_travel_number_column_popup_link");

        if (travel_addBtn_col != null) {
            travel_addBtn_col.remove()
        }

        if (travel_openBtn_col != null) {
            travel_openBtn_col.remove()
        }

        //disable travel and employee column fields
        var travelDisplayField = document.getElementById("expense_custcol_ilo_travel_number_column_display")

        if (travelDisplayField != null) {
            travelDisplayField.disabled = true;
        }

        var employeeColumnField = document.getElementById("expense_custcol_employee_display")

        if (employeeColumnField != null) {
            employeeColumnField.disabled = true;
        }

        var taxcodeColumnField = document.getElementById("expense_taxcode_display")

        if (taxcodeColumnField != null) {
            taxcodeColumnField.disabled = true;
        }



        try {
            filterTravelRecs();
        } catch (err) {
            console.log('err filtering travelrecords : ' + err)
        }

    }

    else {
        console.log('not in employee center')
    }



}






function filterTravelRecs() {


    var TravelList = document.getElementById('custbody_travel_record_popup_list');
	
  //alert(document.getElementById('custbody_travel_record_display'))
  
  // var TravelList2 = document.getElementById('custbody_travel_record_fs');
  var TravelList3 = document.getElementById('custbody_travel_record_display');

  //  alert(document.body.children[3].children[0].children[1].innerHTML);
    //document.body.children[3].children[0].children[1].children[0].style.display = 'none';
    //document.body.children[3].children[1].style.display = 'none';

//    if (TravelList2 != null) {
//
//        TravelList2.addEventListener("touchstart", function (e) {
//           // e.preventDefault();
//          nlapiLogExecution('debug', 'clicked span', 'true')
//            console.log('click')
//            alert('clicked travel record list! travelList2')
//
//
//            setTimeout(function () {
//                onlyEmpTravels()
//            }, 4000);
//        });
//    }
  
      if (TravelList3 != null) {

        TravelList3.addEventListener("touchstart", function (e) {
           e.preventDefault();
          nlapiLogExecution('debug', 'clicked input', 'true')
            console.log('click')
            //alert('clicked travel record list! travelList3')


            setTimeout(function () {
                onlyEmpTravels()
            }, 6000);
        });
    }




    var entityid = nlapiGetFieldValue('entity');
    var noTravelid = '10006';
    var empsTravels = getAllTravels(entityid, noTravelid);

    function getAllTravels(entityid, noTravelid) {


        var searchAssets = nlapiLoadSearch(null, 'customsearch_syg_all_travel_recs');

        var allassets = [];
        var resultsAssets = [];
        var resultContacts = [];
        var searchid = 0;
        var resultset = searchAssets.runSearch();
        var rs;


        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (rs in resultslice) {

                allassets.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);

        if (allassets != null) {
            allassets.forEach(function (line) {




                if (line.getValue('custrecord_ilo_travel_employee') == entityid) {


                    resultsAssets.push(line.getValue('internalid'));
                }//end of check if employee matches

            });

        };
        resultsAssets.push(noTravelid)
        return resultsAssets;

    }

    var empsTravels = getAllTravels(entityid, noTravelid)

    function onlyEmpTravels() {
    	alert('in onlyEmpTravels function!');
    	
    	var nodes = document.querySelectorAll('[uir-multiselect-id]');
    	var allTRS = document.querySelectorAll('tr')
    	//var elList = document.getElementsByClassName('smalltextnolink');
    	alert('nodes :' +  nodes.length);
    	alert('document body :' +  document.body.innerHTML);
    	alert('allTRS :' +  allTRS.length);
    	
    	
    	var aTags = document.getElementsByTagName("a");
    	var searchText = "TR10001 Maayan Salom Jan 2018";
    	var found;

    	for (var i = 0; i < aTags.length; i++) {
    	  if (aTags[i].textContent.indexOf(searchText) >= 0) {
    	    found = aTags[i];
    	    break;
    	  }
    	}

    	alert(found);

//alert(document.body.children[3].innerHTML);
        var textfield = document.getElementById('segment_fields')

        try {

            if (textfield != null) {
                textfield.style.display = 'none';
            }

            var innerDiv = document.getElementById('inner_popup_div')
            var theTable = innerDiv.children[0]

            var rows = theTable.querySelectorAll('tr');

            for (var i = 0; i < rows.length; i++) {

                var travelID = rows[i].attributes[1].value;

                if (travelID != noTravelid && empsTravels.indexOf(travelID) == -1) {


                    rows[i].remove()
                }


            }//end of loop over rows

        } catch (err) {
            console.log(err)
            //var bodyClick = document.getElementById('pageContainer');
            TravelList.click()
        }

    }//end of onlyEmpTravels


}// end of filterTravelRecs
