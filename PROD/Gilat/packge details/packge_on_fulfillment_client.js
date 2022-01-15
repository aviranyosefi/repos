
var list = [];

function PageLoad() {

    var type = nlapiGetRecordType();
    if (type == 'customrecord_package_detail') {
        var itf = nlapiGetFieldValue('custrecord_pd_fulfillment_no')
        if (itf != '' && itf != null) {
            var rec = rec = nlapiLoadRecord('itemfulfillment', itf);
            var count = rec.getLineItemCount('item');
            if (count > 0) {
                for (var i = 1; i <= count; i++) {
                    var item = rec.getLineItemValue('item', 'item', i)
                    var item_name = rec.getLineItemValue('item', 'itemname', i);
                    list.push({
                        item: item,
                        name: item_name,
                    });
                }
            }
            var NewBtn = document.getElementById('custrecord_pd_item_no_fs_tooltipMenu')
            NewBtn.innerHTML = '';
            var dest = document.getElementById('custrecord_pd_item_no_fs');
        }
    }
    else {

        var NewBtn = document.getElementById('recmachcustrecord_pd_fulfillment_no_custrecord_pd_item_no_fs_tooltipMenu')
        if (NewBtn != null) {
            NewBtn.innerHTML = '';
            var dest = document.getElementById('recmachcustrecord_pd_fulfillment_no_custrecord_pd_item_no_fs');


            var count = nlapiGetLineItemCount('item');
            if (count > 0) {
                for (var i = 1; i <= count; i++) {
                    var item = nlapiGetLineItemValue('item', 'item', i)
                    var item_name = nlapiGetLineItemValue('item', 'itemname', i);
                    list.push({
                        item: item,
                        name: item_name,
                    });
                }
            }


        }
    }
 
    var newList = document.createElement('ul');
    newList.style.cssText = style = "overflow:auto;background:white;width:244px;height:100px;line-height:1.5em;cursor:pointer;list-style-type: none;border:1px solid lightgrey; margin:0;";
   
    var toAdd = document.createDocumentFragment();
    for (var i = 0; i < list.length; i++) {
        var newItem = document.createElement('li');
        newItem.id = list[i].item;
        newItem.innerHTML = list[i].name;
        newItem.addEventListener("mouseover", mouseOver, false);
        newItem.addEventListener("mouseout", mouseOut, false);	
        newList.appendChild(newItem);	
        toAdd.appendChild(newList);
        dest.appendChild(toAdd);
    }
    
  
    document.addEventListener('click', function (e) {
        
           if (type == 'customrecord_package_detail') {
               var value = nlapiGetFieldValue('custrecord_pd_item_no' );
           }
           else { var value = nlapiGetCurrentLineItemValue('recmachcustrecord_pd_fulfillment_no', 'custrecord_pd_item_no');}
        
        e.stopPropagation();
        e = e || window.event;
      
        selectedBudgetClassification = e.target.id;
       
           if (selectedBudgetClassification == '') {
               if (type == 'customrecord_package_detail') {
                   nlapiSetFieldValue('custrecord_pd_item_no', value);
               }
               else { nlapiSetCurrentLineItemValue('recmachcustrecord_pd_fulfillment_no', 'custrecord_pd_item_no', value); }
           }
           else {
               if (type == 'customrecord_package_detail') {
                   nlapiSetFieldValue('custrecord_pd_item_no', selectedBudgetClassification);
               }
               else { nlapiSetCurrentLineItemValue('recmachcustrecord_pd_fulfillment_no', 'custrecord_pd_item_no', selectedBudgetClassification); }
           }

    }, false);	

}



function mouseOver() {

    this.style.cssText = 'background:#607799;color:white';
}

function mouseOut() {

    this.style.cssText = 'background:white; color: black;';
}



