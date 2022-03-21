/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Jun 2019     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function showAssistant(request, response) {

 /* first create assistant object and define its steps. */
 var assistant = nlapiCreateAssistant("Simple CSV Generator", true);
 assistant.setOrdered( true );
 nlapiLogExecution( 'DEBUG', "Create Assistant ", "Assistant Created" );
 assistant.addStep('searchparams', 'Setup Parameters').setHelpText("Setup the <b>parameters</b> for the transaction search.");
 assistant.addStep('filterresults', 'Filter Search Results').setHelpText("Below are the search results based on the parameters chosen in the previous step.");
 assistant.addStep('reviewresults', 'Review Search Results').setHelpText("Here you can review the results before creating the CSV");
 
 /* handle page load (GET) requests. */
 if (request.getMethod() == 'GET')
 {
	 /*.Check whether the assistant is finished */
	 if ( !assistant.isFinished() ) {
	 		 
	 // If initial step, set the Splash page and set the intial step
	 if ( assistant.getCurrentStep() == null ) {
		 assistant.setCurrentStep(assistant.getStep( "searchparams" ) );
	 }
	 

	 var step = assistant.getCurrentStep();
	 
	 // Build the page for a step by adding fields, field groups, and sublists to the assistant
	 if (step.getName() == "searchparams")  {
	
	 assistant.addFieldGroup("trantypegroup", "Transaction Type");
	 assistant.addField('trantypelabel','label','What type of transaction would you like to search?', null, 'trantypegroup').setLayoutType('startrow');
	 assistant.addField('trantype', 'radio','Invoice','invoice', 'trantypegroup').setLayoutType('startrow');
	 assistant.addField('trantype', 'radio','Credit Memo','creditmemo', 'trantypegroup').setLayoutType('startrow');
	 assistant.addField('trantype', 'radio','Sales Order','salesorder', 'trantypegroup').setLayoutType('startrow');
	 assistant.getField('trantype', 'invoice').setDefaultValue( 'invoice' );
	 assistant.addFieldGroup("tranfilters", "Transaction Filters");
	 assistant.addField("fromdate", "date", "From Date", null, "tranfilters").setMandatory( true );
	 assistant.addField("todate", "date", "To Date", null, "tranfilters").setMandatory( true );
	 assistant.addField("subsidiary", "select", "Subsidiary", 'SUBSIDIARY',"tranfilters").setMandatory( true );
	 assistant.addField("customer", "select", "Customer", 'CUSTOMER', "tranfilters").setLayoutType("normal", "startcol");
	 	}
	 
	 if (step.getName() == "filterresults")  {
			
		 var customerMessage = assistant.addField("customerwelcomemessage", "text", "Customer Center Welcome Message", null, null);
		 customerMessage.setDefaultValue('filter results step')

		 		}
	 
	 }

 response.writePage(assistant);
 }
 /* handle user submit (POST) requests. */
 else
 {
 assistant.setError( null );
 /* 1. if they clicked the finish button, mark setup as done and redirect to assistant page */
 if (assistant.getLastAction() == "finish")
 {
 assistant.setFinished( "You have completed the Simple CSV Generator Assistant." );
 assistant.sendRedirect( response );
 }
 /* 2. if they clicked the "cancel" button, take them to a different page (setup tab) altogeth
er as
 appropriate. */
 else if (assistant.getLastAction() == "cancel")
 {
 nlapiSetRedirectURL('tasklink', "CARD_-10");
 }
 /* 3. For all other actions (next, back, jump), process the step and redirect to assistant page. */
 else
 {
 if (assistant.getLastStep().getName() == "searchparams" && assistant.getLastAction() == "next" )
 {
//First next
	 var trantype = request.getParameter( 'trantype' );
	 var subsidiary = request.getParameter( 'subsidiary' );
	 var fromdate = request.getParameter( 'fromdate' );
	 var todate = request.getParameter( 'todate' );
	 var customer = request.getParameter( 'customer' );
	 
var initSearch = getInitialSearch(fromdate, todate, subsidiary, customer, trantype);
nlapiLogExecution('debug', 'initSearch - results', JSON.stringify(initSearch, null, 2))

 }
 if (assistant.getLastStep().getName() == "companypreferences" && assistant.getLastAction() == "next" )
 {
// // update the company preferences page
// var configCompPref = nlapiLoadConfiguration( 'companypreferences' );
// configCompPref.setFieldValue( 'CUSTOMERWELCOMEMESSAGE',
// request.getParameter( 'customerwelcomemessage' ) );
// nlapiSubmitConfiguration( configCompPref );
// // update the accounting preferences pages
// var configAcctPref = nlapiLoadConfiguration( 'accountingpreferences' );
// configAcctPref.setFieldValue( 'CREDLIMDAYS', request.getParameter( 'credlimdays' ) );
// nlapiSubmitConfiguration( configAcctPref );
 }

	  if( !assistant.hasError() )
	  assistant.setCurrentStep( assistant.getNextStep() );
	  assistant.sendRedirect( response );
	  }
	  }
	 

}
function getLinkoutURL( redirect, type )
{
 var url = redirect;
 if ( type == "record" )
 url = nlapiResolveURL('record', redirect);
 url += url.indexOf('?') == -1 ? '?' : '&';
 var context = nlapiGetContext();
 url += 'customwhence='+ escape(nlapiResolveURL('suitelet',context.getScriptId(), context.getDeploymentId()))
 return url;
} 

function getInitialSearch(fromdate, todate, subsidiary, customer, trantype) {
	
	
	if(trantype == 'invoice') {
		trantype = 'CustInvc'
	}
	if(trantype == 'creditmemo') {
		trantype = 'CustCred'
	}
	if(trantype == 'salesorder') {
		trantype = 'SalesOrd'
	}
        var results = [];
        var toReturn = [];

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('type', null, 'anyof', [trantype]);
        filters[1] = new nlobjSearchFilter('trandate', null, 'within', [fromdate, todate]);
        filters[2] = new nlobjSearchFilter('subsidiary', null, 'anyof', [subsidiary]);
        filters[3] = new nlobjSearchFilter('mainline', null, 'is', ['T'])
       // filters[4] = new nlobjSearchFilter('internalid', 'customermain', 'anyof', [customer]);
      


        var columns = new Array();
        columns[0] = new nlobjSearchColumn('tranid');
        columns[1] = new nlobjSearchColumn('trandate');
        //columns[2] = new nlobjSearchColumn('internalid', 'customermain');

        var search = nlapiCreateSearch('transaction', filters, columns);
        var resultset = search.runSearch();
        results = resultset.getResults(0, 1000);
        try{
        if (results != []) {
        

              results.forEach(function(line) {
                    
                    
                          
                          toReturn.push({
                                tranid : line.getValue('tranid'),
                               // customer : line.getValue('internalid', 'customermain'),
                                trandate : line.getValue('trandate'),

                          })



              });
        }
  }catch(err){
        
        return toReturn
        
        }
        return toReturn;
  

	
}