function FieldChanged(type, name)
 {
 if (name == 'custitem_item_category')
   CostingMethodValidateField();
 }


function CostingMethodValidateField()
{
    var item_category= nlapiGetFieldValue('custitem_item_category')
    if (item_category == '2' || item_category == '3' || item_category == '4') {
        nlapiSetFieldText('costingmethod', 'Lot Numbered');
    }
    else {
        nlapiSetFieldText('costingmethod', 'Average');
    }
}


