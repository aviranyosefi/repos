var id = site_id();
var last_prefix_no;
var prefix;
var field;
var ifUpdate = false;

function PAGE_INIT() {
    nlapiSetFieldValue('autoname', 'F')
    field = nlapiGetField('autoname')
    if (field != null) { field.setDisplayType('hidden'); }
    
}

function VALIDATE_FIELD(type , name) {

    if (name == 'custrecord_site_prefix') {
       
        prefix = nlapiGetFieldText('custrecord_site_prefix')
        if (prefix != null && prefix != "" && prefix != undefined) {
            // var id = site_id();
            var rec = nlapiLoadRecord('customrecord_site_prefix', id)
            if (rec != null && rec != "" && rec != undefined) {
                //var last_prefix_no;
                if (prefix == 'IRU') {
                    last_prefix_no = rec.getFieldValue('custrecord_iru_prefix')
                    field = 'custrecord_iru_prefix'
                }
                else if (prefix == 'IVC') {
                    last_prefix_no = rec.getFieldValue('custrecord_ivc_prefix')
                    field = 'custrecord_ivc_prefix'
                }
                else if (prefix == 'KU') {
                    last_prefix_no = rec.getFieldValue('custrecord_ku_prefix')
                    field = 'custrecord_ku_prefix'
                }
                else if (prefix == 'MEK') {
                    last_prefix_no = rec.getFieldValue('custrecord_mek_prefix')
                    field = 'custrecord_mek_prefix'
                }
                else if (prefix == 'MPL') {
                    last_prefix_no = rec.getFieldValue('custrecord_mpl_prefix')
                    field = 'custrecord_mpl_prefix'
                }
                else if (prefix == 'RAG') {
                    last_prefix_no = rec.getFieldValue('custrecord_rag_prefix')
                    field = 'custrecord_rag_prefix'
                }
                else if (prefix == 'UG') {
                    last_prefix_no = rec.getFieldValue('custrecord_ug_prefix')
                    field = 'custrecord_ug_prefix'
                }

                nlapiSetFieldValue('name', prefix + last_prefix_no)
                //nlapiSetFieldValue('altname', prefix + last_prefix_no)
                ifUpdate = true;
                return true;

            }
        }
    }
    else { return true;}


}


function SAVE_RECORD() {
    if (ifUpdate) {
        var name = nlapiGetFieldValue('altname')
        var linkType = nlapiGetFieldValue('custrecord_site_link_type')
        var customer = nlapiGetFieldValue('custrecord_site_customer')

        if (name != '' && linkType != '' && customer != '') {
            nlapiSubmitField('customrecord_site_prefix', id, field, parseInt(last_prefix_no) + 1);
            return true;
        }
        else return true;
    }
    else return true;
   
}




function site_id() {
    var search = nlapiCreateSearch('customrecord_site_prefix', null, null);
    var runSearch = search.runSearch();
    res = runSearch.getResults(0, 1)

    return res[0].id
}
