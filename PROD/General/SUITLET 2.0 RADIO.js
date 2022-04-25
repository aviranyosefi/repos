/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(serverWidget) {
 function onRequest(context) {
 var form = serverWidget.createForm({
 title: 'Thank you for your interest in Wolfe Electronics',
 hideNavBar: true
 });
 var htmlHeader = form.addField({
 id: 'custpage_header',
 type: serverWidget.FieldType.INLINEHTML,
 label: ' '
 }).updateLayoutType({
 layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
 }).updateBreakType({
 breakType: serverWidget.FieldBreakType.STARTROW
 }).defaultValue = '<p style=\'font-size:20px\'>We pride ourselves on providing the best' +
 ' services and customer satisfaction. Please take a moment to fill out our survey.</p><br><br>';
 var htmlInstruct = form.addField({
 id: 'custpage_p1',
 type: serverWidget.FieldType.INLINEHTML,
 label: ' '
 }).updateLayoutType({
 layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
 }).updateBreakType({
 breakType: serverWidget.FieldBreakType.STARTROW
 }).defaultValue = '<p style=\'font-size:14px\'>When answering questions on a scale of 1 to 10,' +
 ' 1 = Greatly Unsatisfied and 10 = Greatly Satisfied.</p><br><br>';
var productRating = form.addField({
 id: 'custpage_lblproductrating',
 type: serverWidget.FieldType.INLINEHTML,
 label: ' '
 }).updateLayoutType({
 layoutType: serverWidget.FieldLayoutType.NORMAL
 }).updateBreakType({
 breakType: serverWidget.FieldBreakType.STARTROW
 }).defaultValue = '<p style=\'font-size:14px\'>How would you rate your satisfaction with our products?</p>';
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '1',
 source: 'p1'
 }).updateLayoutType({
 layoutType: serverWidget.FieldLayoutType.STARTROW
 });
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '2',
 source: 'p2'
 }).updateLayoutType({
 layoutType: serverWidget.FieldLayoutType.MIDROW
 });
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '3',
 source: 'p3'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '4',
 source: 'p4'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '5',
 source: 'p5'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '6',
 source: 'p6'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '7',
 source: 'p7'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '8',
 source: 'p8'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '9',
 source: 'p9'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoproductrating',
 type: serverWidget.FieldType.RADIO,
 label: '10',
 source: 'p10'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.ENDROW});
 var serviceRating = form.addField({
 id: 'custpage_lblservicerating',
 type: serverWidget.FieldType.INLINEHTML,
 label: ' '
 }).updateLayoutType({
 layoutType: serverWidget.FieldLayoutType.NORMAL
 }).updateBreakType({
 breakType: serverWidget.FieldBreakType.STARTROW
 }).defaultValue = '<p style=\'font-size:14px\'>How would you rate your satisfaction with our services?</p>';
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '1',
 source: 'p1'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.STARTROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '2',
 source: 'p2'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '3',
 source: 'p3'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '4',
 source: 'p4'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '5',
 source: 'p5'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '6',
 source: 'p6'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '7',
 source: 'p7'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '8',
 source: 'p8'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '9',
 source: 'p9'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.MIDROW});
 form.addField({
 id: 'custpage_rdoservicerating',
 type: serverWidget.FieldType.RADIO,
 label: '10',
 source: 'p10'
 }).updateLayoutType({layoutType: serverWidget.FieldLayoutType.ENDROW});
  form.addSubmitButton({
 label: 'Submit'
 });
 form.addResetButton({
 label: 'Reset'
 });
 context.response.writePage(form);
 }
 return {
 onRequest: onRequest
 };
});

