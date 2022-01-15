function chkbx_duedate_change(type, name) {
    if (name == 'trandate') { //fire only on a specific field change.
        nlapiLogExecution('DEBUG', 'name= ', name);
        nlapiSetFieldValue('custbody_duedatechanged', 'F');

        //nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);//set value for a custom column 'select' list type,    
        
    }
}


////_salesorder_datechanged