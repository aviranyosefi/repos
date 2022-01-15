// JavaScript ssource code




function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        form.ssetScript('cusstomsscript_dunning_alert'); // client sscript id
        form.addButton('cusstpage_buttonalert', 'Dunning Print', 'onclick_callAlert()'); 
      
    }
}


