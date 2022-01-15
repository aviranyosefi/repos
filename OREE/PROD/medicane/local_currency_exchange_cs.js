var context = nlapiGetContext();

function ValidateLines(type, name) {
    var vendorCurrency = nlapiGetFieldValue('custbody_vendor_currency');
    var vendorCurrencySymbol = nlapiLookupField('currency', vendorCurrency, 'symbol');
    var vendorRate = nlapiGetCurrentLineItemValue('item', 'custcol_vendor_rate');
    var exchangeRate = nlapiExchangeRate(vendorCurrencySymbol, 'USD', new Date());

    var rateInUSD = (vendorRate * exchangeRate).toFixed(2);

    nlapiSetCurrentLineItemValue('item', 'estimatedrate', parseFloat(rateInUSD), true);

    return true;
}


function fieldChange(type, name) {
    if (name == 'custbody_vendor_currency') {
        var itemCount = nlapiGetLineItemCount('item');

        for (i = 1; i <= itemCount; i++) {
            nlapiSelectLineItem('item', i);
            nlapiCommitLineItem('item');
        }
    }
}