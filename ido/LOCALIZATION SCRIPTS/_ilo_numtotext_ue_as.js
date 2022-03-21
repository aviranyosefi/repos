/**
* Module Description
* 
 * Version    Date            Author           Remarks
* 1.00       03 Jan 2019     idor
*
*/

/**
* The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
* 
 * @param {String} type Operation types: create, edit, delete, xedit,
*                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
*                      pack, ship (IF only)
*                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
* @returns {Void}
*/
function num_to_text_afterSubmit(type){
      
      try{
            

          var rec = nlapiLoadRecord('vendorpayment', nlapiGetRecordId());
          var nexus_country = rec.getFieldValue('nexus_country');
          if (nexus_country == 'IL') {

          var agurot = '';
            var res_agurot = '';
            
            var bodyTotal = rec.getFieldValue('custbody_ilo_net_amount');
            var lineTotal = getTotalOGAmt();
            var check = bodyTotal

            
            var res = check.split(".");
            var current = getResult(res[0]);
            
            if(res[1] != '00') {
                  agurot = num_to_text_hundreds(res[1])
                  res_agurot = '�'+agurot[0].tens[0];
            }
      
            if(res_agurot == '') {
                  current = current + '�����';
            }
            if(res_agurot != '') {
                  current = current + '����� ' + res_agurot + ' ������';
            }
            
            rec.setFieldValue('custbody_ilo_total_words', current);
            
            var revAddress = reverseAddress();        
            
            rec.setFieldValue('custbody_ilo_reversed_address', revAddress);
            
            nlapiSubmitRecord(rec)
            
          }//  if (nexus_country == 'IL')

            }catch(err) {
                  nlapiLogExecution('error', 'err', err)
            }
      }


      function num_to_text_hundreds(num) {


          /* Array of units as words */
          var units = ['', '���', '�����', '����', '����', '���', '��', '���', '�����', '���', '���', '���-����', '�����-����', '����-����', '����-����', '���-����', '��-����', '���-����', '�����-����', '���-����'];

          /* Array of tens as words */
          var tens = ['', '', '�����', '������', '������', '�����', '����', '�����', '������', '�����'];

          var num = num;
          var hundreds;
          var _tens;
          var single;


          if (num.length == 3) {

               hundreds = num.split('');

              if (hundreds[0] == '1') {
                  hundreds[0] = '���';
              }
              if (hundreds[0] == '2') {
                  hundreds[0] = '������';
              }
              if ((hundreds[0] == '3') || (hundreds[0] == '4') || (hundreds[0] == '5') || (hundreds[0] == '6') || (hundreds[0] == '7') || (hundreds[0] == '8') || (hundreds[0] == '9')) {
                  hundreds[0] = units[hundreds[0]] + ' ����';
              }

              if (hundreds[1] == '1') {
                  if (hundreds[2] == '0') {
                      hundreds[1] = '�����';
                  }
                  if (hundreds[2] != '0') {

                      var overTenUnderTwenty = parseInt(hundreds[1] + hundreds[2])
                      hundreds[1] = '�' + units[overTenUnderTwenty];
                  }
              }

              if (hundreds[1] == '0') {

                  hundreds[1] = '';

                  if (hundreds[2] != '0') {

                      hundreds[2] = '�' + units[hundreds[2]];
                  }

              }

              if ((hundreds[1] == '2') || (hundreds[1] == '3') || (hundreds[1] == '4') || (hundreds[1] == '5') || (hundreds[1] == '6') || (hundreds[1] == '7') || (hundreds[1] == '8') || (hundreds[1] == '9')) {
                  if (hundreds[2] == '0') {
                      var twenty = tens[hundreds[1]];
                      hundreds[1] = '�' + twenty;
                  }
              }

              if ((hundreds[1] == '2') || (hundreds[1] == '3') || (hundreds[1] == '4') || (hundreds[1] == '5') || (hundreds[1] == '6') || (hundreds[1] == '7') || (hundreds[1] == '8') || (hundreds[1] == '9')) {
                  if (hundreds[2] != '0') {
                      var twenty = tens[hundreds[1]];
                      var underTenUnderTwenty = parseInt(hundreds[2])
                      hundreds[1] = twenty + ' �' + units[underTenUnderTwenty];
                  }
              }

          }



          if (num.length == 2) {
              _tens = num.split('');

                    if (_tens[0] == '1') {
                  if (_tens[1] == '0') {
                      _tens[0] = '�����';
                  }
                  if (_tens[1] != '0') {

                      var overTenUnderTwenty = parseInt(_tens[0] + _tens[1])
                      _tens[0] = '�' + units[overTenUnderTwenty];
                  }
              }


              if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
                  if (_tens[1] == '0') {
                      var twenty = tens[_tens[0]];
                      _tens[0] = twenty;
                  }
              }

              if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
                  if (_tens[1] != '0') {
                      var twenty = tens[_tens[0]];
                      var underTenUnderTwenty = parseInt(_tens[1])
                      _tens[0] = twenty + ' �' + units[underTenUnderTwenty];
                  }
              }
             
          }

          if (num.length == 1) {
               single = num.split('');
              var _single = parseInt(single[0])
              single[0] = units[_single];
          }



      var all = [];

      all.push({
            hundreds : hundreds,
            tens : _tens,
            singles : single
      })


      return all;
      }

      function cleanArray(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
          if (actual[i]) {
            newArray.push(actual[i]);
          }
        }
        return newArray;
      }


      function result_hundreds(query) {

      var clean;

      var a = num_to_text_hundreds(query);

      var results = a[0];

      if(results.hundreds != undefined) {

      clean = cleanArray(results.hundreds)

      }
      if(results.tens != undefined) {

      clean = results.tens
      }
      if(results.singles != undefined) {

      clean = results.singles
      }

      var sentence = clean.join(' '); 
      var res =  sentence.replace(/[0-9]/g, '');
      return res;
      }

      function num_to_text_thousands(num) {


          /* Array of units as words */
          var units = ['', '���', '�����', '����', '����', '���', '��', '���', '�����', '���', '���', '���-����', '�����-����', '����-����', '����-����', '���-����', '��-����', '���-����', '�����-����', '���-����'];

          /* Array of tens as words */
          var tens = ['', '', '�����', '������', '������', '�����', '����', '�����', '������', '�����'];

          var num = num;
          var thousands;
          var _tens;
          var single;


          if (num.length == 3) {

               thousands = num.split('');
              
               if((thousands[0] == '0') && (thousands[1] == '0') && (thousands[2] == '1')) {
                   thousands[2] = '��� '
               }
                        if((thousands[0] != '0') && (thousands[1] == '0') && (thousands[2] == '0')) {
                   thousands[2] = '��� '
               }

              if (thousands[0] == '1') {
                  thousands[0] = '���';
              }
              if (thousands[0] == '2') {
                  thousands[0] = '������';
              }
              if ((thousands[0] == '3') || (thousands[0] == '4') || (thousands[0] == '5') || (thousands[0] == '6') || (thousands[0] == '7') || (thousands[0] == '8') || (thousands[0] == '9')) {
                  thousands[0] = units[thousands[0]] + ' ����';
              }

              if (thousands[1] == '1') {
                  if (thousands[2] == '0') {
                      thousands[1] = '�����';
                  }
                  if (thousands[2] != '0') {

                      var overTenUnderTwenty = parseInt(thousands[1] + thousands[2])
                      thousands[1] = units[overTenUnderTwenty]+' ��� ';
                     
                  }

              }

              if ((thousands[1] == '0') && (thousands[0] == '0')) {

                  thousands[1] = '';

                  if (thousands[2] != '0') {

                 
                      if(thousands[2] == '2') {
                          thousands[2] = '������ '
                          
                      }

                      if ((thousands[2] == '3') || (thousands[2] == '4') || (thousands[2] == '5') || (thousands[2] == '6') || (thousands[2] == '7') || (thousands[2] == '9')) {
                          thousands[2] = units[thousands[2]]+'� ����� ';
                       
      }
      if (thousands[2] == '8') {
                              var eight = units[thousands[2]].slice(0, -1);
                          thousands[2] = eight+'� ����� ';
                         
      }


                  }

              }

              if ((thousands[1] == '2') || (thousands[1] == '3') || (thousands[1] == '4') || (thousands[1] == '5') || (thousands[1] == '6') || (thousands[1] == '7') || (thousands[1] == '8') || (thousands[1] == '9')) {
                  if (thousands[2] == '0') {
                      var twenty = tens[thousands[1]];
                      thousands[1] = '�' + twenty+' �����';

                  }

              }

              if ((thousands[1] == '2') || (thousands[1] == '3') || (thousands[1] == '4') || (thousands[1] == '5') || (thousands[1] == '6') || (thousands[1] == '7') || (thousands[1] == '8') || (thousands[1] == '9')) {
                  if (thousands[2] != '0') {
                      var twenty = tens[thousands[1]];
                      var underTenUnderTwenty = parseInt(thousands[2])
                      thousands[1] = twenty + ' �' + units[underTenUnderTwenty]+' ���';

                  }

              }

          }





          if (num.length == 2) {
              _tens = num.split('');

                    if (_tens[0] == '1') {
                  if (_tens[1] == '0') {
                      _tens[0] = '����';
                  }
                  if (_tens[1] != '0') {

                      var overTenUnderTwenty = parseInt(_tens[0] + _tens[1])
                      _tens[0] = '�' + units[overTenUnderTwenty];
                  }
              }


              if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
                  if (_tens[1] == '0') {
                      var twenty = tens[_tens[0]];
                
                      _tens[0] = twenty;
                  }
              }

              if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
                  if (_tens[1] != '0') {
                      var twenty = tens[_tens[0]];
                      var underTenUnderTwenty = parseInt(_tens[1])
                      _tens[0] = twenty + ' �' + units[underTenUnderTwenty];
                  }
              }
        
          }

          if (num.length == 1) {
               single = num.split('');
              var _single = parseInt(single[0])
                      if(_single == 1) {
                  single[0] = '���'
              }
                       if(_single == 2) {
                  single[0] = '������'
              }
                       if(_single == 3 || _single == 4 || _single == 5 || _single == 6 || _single == 7 || _single == 8 || _single == 9) {
                  single[0] = units[_single]+'� ����� '

              }

          }


      var all = [];

      all.push({
            thousands : thousands,
            tens : _tens,
            singles : single
      })


      return all;
      }

      function cleanArray(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
          if (actual[i]) {
            newArray.push(actual[i]);
          }
        }
        return newArray;
      }


      function result_thousands(query) {

      var clean;

      var a = num_to_text_thousands(query);

      var results = a[0];

      if(results.thousands != undefined) {

      clean = cleanArray(results.thousands)

      }
      if(results.tens != undefined) {

      clean = results.tens
      }
      if(results.singles != undefined) {

      clean = results.singles
      }

      var sentence = clean.join(' '); 
      var res =  sentence.replace(/[0-9]/g, '');
      //res = res+ ' ���'

      var end = res.replace(/\s{2,}/g, ' ');
      return end;
      }


      

function getResult(check) {
    var result = '';
    var result_a = ''
    var result_b = ''

      if(check.length == 4) {
            check = '00'+check;
      }
            if(check.length == 5) {
            check = '0'+check;
      }

var chunks = getChunks(check);

if(chunks.length == 1) {
var chunk_hundreds = chunks[0];
var b = result_hundreds(chunk_hundreds);
result_b = b;
}

if(chunks.length == 2) {
var chunk_thousands = chunks[0];
var chunk_hundreds = chunks[1];

result_a = result_thousands(chunk_thousands);
result_b = result_hundreds(chunk_hundreds);


}

result = result_a+result_b;

if(result_a == "") {
    result = result_b;
}

var res =  result.replace(/[0-9]/g, '');
var end = res.replace(/\s{2,}/g, ' ');
return end;
}


function getChunks(num) {

var chunks = splitString(num, 3);
return chunks;
}

function splitString (string, size) {
      var re = new RegExp('.{1,' + size + '}', 'g');
      return string.match(re);
}



function getTotalOGAmt() {
      try {

            var rec = nlapiLoadRecord('vendorpayment', nlapiGetRecordId());
            var lineCount = nlapiGetLineItemCount('apply');

            var totalOgamt = 0;
            var totOGAmtArr = [];

            for (var i = 0; i < lineCount; i++) {
                  var lineOGAmt = rec.getLineItemValue('apply', 'total', i + 1)
                  totOGAmtArr.push(lineOGAmt);
            }

            totalOgamt = totOGAmtArr.reduce(add, 0);
            function add(a, b) {
                  return parseFloat(a) + parseFloat(b);
            }
            return totalOgamt.toFixed(2);

      } catch (err) {

            var err = 'err';
            return err;
      }
}

function reverseAddress() {
      try {
            
            var rec = nlapiLoadRecord('vendorpayment', nlapiGetRecordId());

            var address = nlapiLookupField('vendor', rec.getFieldValue('entity'),'billaddress')
			var legalName = nlapiLookupField('vendor', rec.getFieldValue('entity'),'legalname')

            var arr = address.split(/\r?\n/);
			arr[0] = '`'+legalName
            var reversedAddress = '';

            for (var i = 0; i < arr.length; i++) {

                  var line = arr[i];

                  reversedAddress += reverse(line) + '\n'

            }

            var res = reversedAddress;
			var r = /\d+/g;
			var numInText = res.match(r)
			
			for(var x = 0; x<numInText.length; x++) {
			
			var reversedNum = reverse_a_number(numInText[x])

			res = res.replace(numInText[x], reversedNum)
			
			
			
			
			}
			


            if (res.indexOf('learsI') != -1) {

                  res = res.replace('learsI', 'Israel')
            }
			
			var finalCheck = res;
			
			finalCheck = finalCheck.replace(/[()]/g, ''); 
					
            return finalCheck;

      }

      catch (err) {
	  console.log(err)
            var normal_address = nlapiLookupField('vendor',rec.getFieldValue('entity'), 'billaddress')
            return normal_address;

      }
}

function reverse(s) {
      return s.split("").reverse().join("");
}

function reverse_a_number(n)
{
	n = n + "";
	return n.split("").reverse().join("");
}


