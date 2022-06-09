/**
 * DF_CS_add_kit_items.js
 */

var recType = nlapiGetRecordType();;
var recId = nlapiGetRecordId();
var context = nlapiGetContext();


//================== Helpers ============================
addKitItemsWindow = {
		window : null,
		bckgndDiv : null		
}
function openAddKitItemsPopUp(){
	var poId = nlapiGetFieldValue('id');
	var poName = nlapiGetFieldValue('tranid');
	var addKitItemsData = JSON.parse(nlapiGetFieldValue('custpage_dp_add_kit_items_data'));
	var addKitItemsUrl = addKitItemsData.proxyAdminUrl + '&actionType=openAddKitItemsPopUp&poId=' + poId + '&poName=' + poName;
	if (!addKitItemsWindow.bckgndDiv || addKitItemsWindow.bckgndDiv == null) {
		addKitItemsWindow.bckgndDiv = document.createElement("div");
		addKitItemsWindow.bckgndDiv.style.position = "absolute";
		addKitItemsWindow.bckgndDiv.style.zIndex = "999";
		addKitItemsWindow.bckgndDiv.style.top = '0px';
		addKitItemsWindow.bckgndDiv.style.left = '0px';
		addKitItemsWindow.bckgndDiv.style.width = (Math.max(document.body.scrollWidth, jQuery(window).width())) + 'px';
		addKitItemsWindow.bckgndDiv.style.height = (Math.max(document.body.scrollHeight, jQuery(window).height())) + 'px';
		setObjectOpacity(50, addKitItemsWindow.bckgndDiv);
		addKitItemsWindow.bckgndDiv.style.backgroundColor = 'gray';
		document.body.appendChild(addKitItemsWindow.bckgndDiv);
	}
	addKitItemsWindow.bckgndDiv.style.display = "block";
	addKitItemsWindow.bckgndDiv.style.top = '0px';
	addKitItemsWindow.window = window.open(addKitItemsUrl,"Add Kit Items to  " + poName, 'width=1200,height=800,resizable=yes,scrollbars=yes');		
	addKitItemsItems_checkWindowOpenned();
};

function addKitItemsItems_checkWindowOpenned() {
	if (!addKitItemsWindow.window) {
        alert('Unable to open pop up');
    } else { 
        if (addKitItemsWindow.window.closed) { 
        	addKitItemsItems_popUPCloseHandler();        	
        } else {
        	setTimeout('addKitItemsItems_checkWindowOpenned()',100);
        }    
    }
};

function addKitItemsItems_popUPCloseHandler(){
	var memberItemsData = nlapiGetContext().getSessionObject('memberItems');
	nlapiLogExecution('debug', 'memberItemsData', memberItemsData)
	if (!isNullOrEmpty(memberItemsData)) {
		memberItemsData = JSON.parse(memberItemsData)
		for (var i = 0; i < memberItemsData.length; i++) {
			var memberItem = memberItemsData[i];
			nlapiSelectNewLineItem('item');
			nlapiSetCurrentLineItemValue('item', 'item', memberItem.item, true, true);
			nlapiSetCurrentLineItemValue('item', 'quantity', memberItem.qty, true, true);
			nlapiSetCurrentLineItemValue('item', 'rate', memberItem.rate, true, true);
			nlapiSetCurrentLineItemValue('item', 'custcol_member_of_kit', memberItem.memberOf, true, true);
			nlapiCommitLineItem('item');
		}
	};
	addKitItemsWindow.bckgndDiv.style.display = "none";
}
