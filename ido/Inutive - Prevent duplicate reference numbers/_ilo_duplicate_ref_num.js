


function onSave_prevent_duplicate_refnum(type,name){
 
  var refNum = nlapiGetFieldValue('tranid');
  var tranNum = nlapiGetFieldValue('transactionnumber');
  if (refNum != null && refNum != '') 
  {
   var vendor = nlapiGetFieldValue('entity');
   var filter = new Array();
   filter[0] = new nlobjSearchFilter('tranid',null,'is',refNum);
   filter[1] = new nlobjSearchFilter('mainline',null,'is','T');
   var column = new Array();
   column[0] = new nlobjSearchColumn('internalid');
   column[1] = new nlobjSearchColumn('tranid');
   var searchResults = nlapiSearchRecord('vendorbill',null, filter,column);
   if (searchResults != null && searchResults.length > 0)
   {
    alert('Reference# is already used: ' + searchResults[0].getValue('tranid'));
    return false;
   }
  }
 
 return true;  
}
