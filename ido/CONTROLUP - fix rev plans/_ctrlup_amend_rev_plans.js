/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Mar 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */




function amend_revplans(type) {
	
	var objArr = [{"internalid":"9858","enddate":"27/9/2019"},{"internalid":"10120","enddate":"30/4/2018"},{"internalid":"9859","enddate":"16/9/2019"},{"internalid":"9860","enddate":"19/2/2018"},{"internalid":"9861","enddate":"23/11/2019"},{"internalid":"10128","enddate":"3/5/2018"},{"internalid":"9862","enddate":"30/11/2018"},{"internalid":"10130","enddate":"28/5/2018"},{"internalid":"10132","enddate":"23/3/2018"},{"internalid":"9864","enddate":"31/8/2018"},{"internalid":"10134","enddate":"26/6/2018"},{"internalid":"9865","enddate":"28/9/2018"},{"internalid":"10137","enddate":"31/7/2018"},{"internalid":"10141","enddate":"30/11/2018"},{"internalid":"9868","enddate":"31/8/2018"},{"internalid":"10143","enddate":"26/10/2020"},{"internalid":"9869","enddate":"31/7/2018"},{"internalid":"9870","enddate":"5/8/2018"},{"internalid":"9871","enddate":"31/8/2018"},{"internalid":"10148","enddate":"26/6/2018"},{"internalid":"10150","enddate":"22/7/2018"},{"internalid":"9872","enddate":"31/8/2018"},{"internalid":"10153","enddate":"30/9/2018"},{"internalid":"10155","enddate":"27/6/2018"},{"internalid":"10158","enddate":"30/11/2018"},{"internalid":"9874","enddate":"31/7/2018"},{"internalid":"10167","enddate":"2/4/2018"},{"internalid":"9878","enddate":"28/2/2022"},{"internalid":"10177","enddate":"31/10/2020"},{"internalid":"9879","enddate":"18/7/2018"},{"internalid":"10179","enddate":"30/9/2020"},{"internalid":"9880","enddate":"30/4/2018"},{"internalid":"9886","enddate":"1/9/2018"},{"internalid":"10192","enddate":"31/10/2018"},{"internalid":"9887","enddate":"29/6/2018"},{"internalid":"9888","enddate":"30/6/2018"},{"internalid":"9890","enddate":"28/6/2020"},{"internalid":"10201","enddate":"30/11/2018"},{"internalid":"10203","enddate":"31/10/2018"},{"internalid":"9892","enddate":"31/7/2018"},{"internalid":"10205","enddate":"30/11/2020"},{"internalid":"9893","enddate":"30/6/2018"},{"internalid":"10210","enddate":"9/4/2018"},{"internalid":"10212","enddate":"31/3/2018"},{"internalid":"9896","enddate":"31/8/2018"},{"internalid":"10213","enddate":"26/3/2020"},{"internalid":"9897","enddate":"6/8/2018"},{"internalid":"10216","enddate":"30/4/2018"},{"internalid":"10218","enddate":"10/4/2018"},{"internalid":"10220","enddate":"30/3/2018"},{"internalid":"10221","enddate":"21/4/2018"},{"internalid":"10223","enddate":"26/5/2018"},{"internalid":"10301","enddate":"24/12/2019"},{"internalid":"10226","enddate":"31/3/2018"},{"internalid":"10302","enddate":"29/12/2019"},{"internalid":"10228","enddate":"31/3/2018"},{"internalid":"10230","enddate":"31/3/2018"},{"internalid":"10232","enddate":"30/9/2018"},{"internalid":"10233","enddate":"31/10/2018"},{"internalid":"10238","enddate":"17/12/2018"},{"internalid":"10242","enddate":"8/10/2018"},{"internalid":"10308","enddate":"10/2/2018"},{"internalid":"10244","enddate":"30/9/2018"},{"internalid":"10309","enddate":"30/4/2018"},{"internalid":"10247","enddate":"30/9/2018"},{"internalid":"10310","enddate":"31/12/2019"},{"internalid":"10249","enddate":"31/10/2018"},{"internalid":"10311","enddate":"9/9/2018"},{"internalid":"10312","enddate":"31/8/2018"},{"internalid":"10253","enddate":"10/9/2020"},{"internalid":"10313","enddate":"31/8/2018"},{"internalid":"10255","enddate":"20/10/2018"},{"internalid":"10257","enddate":"30/9/2018"},{"internalid":"10314","enddate":"30/9/2018"},{"internalid":"10259","enddate":"7/2/2018"},{"internalid":"10316","enddate":"15/9/2018"},{"internalid":"10317","enddate":"30/11/2018"},{"internalid":"10319","enddate":"31/8/2018"},{"internalid":"10320","enddate":"3/5/2018"},{"internalid":"10321","enddate":"4/5/2020"},{"internalid":"10277","enddate":"31/12/2018"},{"internalid":"10279","enddate":"25/11/2018"},{"internalid":"10284","enddate":"18/11/2019"},{"internalid":"10329","enddate":"30/4/2018"},{"internalid":"10290","enddate":"1/11/2020"},{"internalid":"10292","enddate":"31/10/2020"},{"internalid":"10335","enddate":"31/8/2018"},{"internalid":"10401","enddate":"31/1/2019"},{"internalid":"10336","enddate":"7/7/2018"},{"internalid":"10403","enddate":"31/3/2018"},{"internalid":"10337","enddate":"31/7/2018"},{"internalid":"10405","enddate":"30/6/2018"},{"internalid":"10338","enddate":"31/10/2018"},{"internalid":"10407","enddate":"20/5/2018"},{"internalid":"10339","enddate":"31/7/2020"},{"internalid":"10409","enddate":"5/5/2020"},{"internalid":"10340","enddate":"31/7/2018"},{"internalid":"10341","enddate":"15/8/2018"},{"internalid":"10342","enddate":"31/7/2018"},{"internalid":"10343","enddate":"9/11/2018"},{"internalid":"10344","enddate":"17/8/2018"},{"internalid":"10345","enddate":"16/8/2018"},{"internalid":"10346","enddate":"28/2/2018"},{"internalid":"10411","enddate":"19/5/2018"},{"internalid":"10347","enddate":"15/2/2018"},{"internalid":"10416","enddate":"31/5/2018"},{"internalid":"10349","enddate":"3/2/2018"},{"internalid":"10418","enddate":"31/3/2018"},{"internalid":"10352","enddate":"7/2/2018"},{"internalid":"10426","enddate":"31/5/2018"},{"internalid":"10354","enddate":"28/2/2018"},{"internalid":"10355","enddate":"25/3/2018"},{"internalid":"10356","enddate":"8/2/2018"},{"internalid":"10357","enddate":"9/2/2018"},{"internalid":"10359","enddate":"30/9/2018"},{"internalid":"10438","enddate":"11/10/2020"},{"internalid":"10360","enddate":"10/5/2018"},{"internalid":"10440","enddate":"23/11/2018"},{"internalid":"10442","enddate":"31/10/2018"},{"internalid":"10361","enddate":"31/7/2018"},{"internalid":"10444","enddate":"31/10/2018"},{"internalid":"10362","enddate":"10/8/2018"},{"internalid":"10446","enddate":"30/11/2018"},{"internalid":"10363","enddate":"30/9/2018"},{"internalid":"10448","enddate":"19/10/2020"},{"internalid":"10364","enddate":"10/5/2018"},{"internalid":"10450","enddate":"7/12/2018"},{"internalid":"10370","enddate":"31/5/2018"},{"internalid":"10462","enddate":"7/6/2018"},{"internalid":"10466","enddate":"25/5/2018"},{"internalid":"10373","enddate":"30/11/2018"},{"internalid":"10474","enddate":"31/10/2020"},{"internalid":"10476","enddate":"30/11/2018"},{"internalid":"10479","enddate":"2/12/2018"},{"internalid":"10481","enddate":"30/11/2018"},{"internalid":"10483","enddate":"30/11/2018"},{"internalid":"10381","enddate":"15/9/2018"},{"internalid":"10485","enddate":"30/11/2018"},{"internalid":"10382","enddate":"14/8/2020"},{"internalid":"10487","enddate":"24/1/2019"},{"internalid":"10383","enddate":"31/8/2018"},{"internalid":"10490","enddate":"16/11/2020"},{"internalid":"10384","enddate":"9/11/2018"},{"internalid":"10492","enddate":"7/12/2018"},{"internalid":"10385","enddate":"31/8/2018"},{"internalid":"10494","enddate":"5/12/2018"},{"internalid":"10386","enddate":"31/8/2018"},{"internalid":"10495","enddate":"17/12/2018"},{"internalid":"10497","enddate":"30/11/2018"},{"internalid":"10387","enddate":"30/9/2018"},{"internalid":"10501","enddate":"17/5/2018"},{"internalid":"10503","enddate":"20/4/2018"},{"internalid":"10505","enddate":"30/4/2018"},{"internalid":"10391","enddate":"10/8/2018"},{"internalid":"10507","enddate":"30/4/2018"},{"internalid":"10392","enddate":"21/9/2018"},{"internalid":"10509","enddate":"30/4/2018"},{"internalid":"10393","enddate":"7/9/2018"},{"internalid":"10394","enddate":"3/4/2018"},{"internalid":"10513","enddate":"12/4/2020"},{"internalid":"10395","enddate":"3/4/2018"},{"internalid":"10516","enddate":"11/5/2018"},{"internalid":"10519","enddate":"19/5/2018"},{"internalid":"10398","enddate":"31/3/2018"},{"internalid":"10399","enddate":"26/4/2018"},{"internalid":"10400","enddate":"25/3/2018"},{"internalid":"10601","enddate":"25/3/2018"},{"internalid":"10528","enddate":"20/12/2018"},{"internalid":"10602","enddate":"28/2/2018"},{"internalid":"10530","enddate":"31/12/2018"},{"internalid":"10532","enddate":"11/10/2020"},{"internalid":"10603","enddate":"28/2/2018"},{"internalid":"10604","enddate":"20/3/2018"},{"internalid":"10534","enddate":"4/12/2018"},{"internalid":"10605","enddate":"31/3/2018"},{"internalid":"10536","enddate":"30/11/2018"},{"internalid":"10538","enddate":"7/11/2018"},{"internalid":"10607","enddate":"31/7/2018"},{"internalid":"10540","enddate":"30/11/2018"},{"internalid":"10543","enddate":"30/11/2018"},{"internalid":"10609","enddate":"31/5/2018"},{"internalid":"10545","enddate":"31/10/2020"},{"internalid":"10610","enddate":"23/5/2022"},{"internalid":"10547","enddate":"30/11/2018"},{"internalid":"10549","enddate":"30/11/2018"},{"internalid":"10612","enddate":"31/5/2018"},{"internalid":"10554","enddate":"11/7/2019"},{"internalid":"10615","enddate":"4/7/2018"},{"internalid":"10616","enddate":"31/5/2018"},{"internalid":"10618","enddate":"31/8/2018"},{"internalid":"10571","enddate":"30/11/2018"},{"internalid":"10573","enddate":"12/12/2018"},{"internalid":"10576","enddate":"5/11/2020"},{"internalid":"10583","enddate":"26/1/2019"},{"internalid":"10589","enddate":"29/11/2020"},{"internalid":"10591","enddate":"30/11/2018"},{"internalid":"10593","enddate":"31/12/2018"},{"internalid":"10596","enddate":"31/12/2018"},{"internalid":"10598","enddate":"30/4/2019"},{"internalid":"10628","enddate":"12/5/2018"},{"internalid":"10629","enddate":"30/8/2018"},{"internalid":"10703","enddate":"9/5/2018"},{"internalid":"10705","enddate":"31/5/2018"},{"internalid":"10630","enddate":"7/9/2018"},{"internalid":"10631","enddate":"22/8/2018"},{"internalid":"10632","enddate":"18/9/2018"},{"internalid":"10633","enddate":"31/10/2018"},{"internalid":"10713","enddate":"30/6/2018"},{"internalid":"10634","enddate":"31/8/2018"},{"internalid":"10715","enddate":"30/4/2018"},{"internalid":"10635","enddate":"28/9/2018"},{"internalid":"10717","enddate":"16/6/2018"},{"internalid":"10636","enddate":"31/8/2018"},{"internalid":"10719","enddate":"18/5/2018"},{"internalid":"10637","enddate":"31/8/2018"},{"internalid":"10721","enddate":"31/5/2018"},{"internalid":"10640","enddate":"21/10/2018"},{"internalid":"10727","enddate":"31/12/2018"},{"internalid":"10729","enddate":"13/11/2018"},{"internalid":"10642","enddate":"7/3/2018"},{"internalid":"10732","enddate":"9/12/2018"},{"internalid":"10643","enddate":"30/4/2018"},{"internalid":"10644","enddate":"8/3/2022"},{"internalid":"10736","enddate":"17/12/2020"},{"internalid":"10645","enddate":"14/4/2018"},{"internalid":"10738","enddate":"20/1/2019"},{"internalid":"10646","enddate":"19/5/2018"},{"internalid":"10740","enddate":"15/11/2020"},{"internalid":"10742","enddate":"30/11/2018"},{"internalid":"10744","enddate":"31/1/2019"},{"internalid":"10746","enddate":"30/11/2020"},{"internalid":"10650","enddate":"19/3/2020"},{"internalid":"10749","enddate":"30/11/2018"},{"internalid":"10651","enddate":"26/4/2018"},{"internalid":"10652","enddate":"20/6/2018"},{"internalid":"10653","enddate":"31/3/2018"},{"internalid":"10654","enddate":"13/9/2018"},{"internalid":"10655","enddate":"31/5/2018"},{"internalid":"10657","enddate":"31/5/2018"},{"internalid":"10767","enddate":"30/4/2018"},{"internalid":"10659","enddate":"13/9/2018"},{"internalid":"10772","enddate":"30/8/2018"},{"internalid":"10661","enddate":"31/8/2018"},{"internalid":"10774","enddate":"31/12/2018"},{"internalid":"10662","enddate":"30/9/2018"},{"internalid":"10663","enddate":"30/9/2018"},{"internalid":"10664","enddate":"31/5/2018"},{"internalid":"10665","enddate":"31/8/2018"},{"internalid":"10791","enddate":"30/11/2018"},{"internalid":"10671","enddate":"7/2/2018"},{"internalid":"10793","enddate":"2/12/2018"},{"internalid":"10672","enddate":"30/6/2018"},{"internalid":"10795","enddate":"13/12/2018"},{"internalid":"10798","enddate":"31/12/2018"},{"internalid":"10675","enddate":"23/11/2022"},{"internalid":"10676","enddate":"31/8/2018"},{"internalid":"10804","enddate":"31/5/2018"},{"internalid":"10677","enddate":"3/9/2020"},{"internalid":"10806","enddate":"5/7/2018"},{"internalid":"10808","enddate":"31/5/2020"},{"internalid":"10810","enddate":"17/8/2018"},{"internalid":"10680","enddate":"10/9/2020"},{"internalid":"10812","enddate":"7/6/2018"},{"internalid":"10681","enddate":"31/8/2018"},{"internalid":"10821","enddate":"6/6/2018"},{"internalid":"10823","enddate":"27/6/2018"},{"internalid":"10825","enddate":"26/1/2019"},{"internalid":"10687","enddate":"19/9/2018"},{"internalid":"10688","enddate":"20/10/2018"},{"internalid":"10831","enddate":"18/2/2019"},{"internalid":"10689","enddate":"31/5/2018"},{"internalid":"10835","enddate":"30/11/2018"},{"internalid":"10694","enddate":"31/3/2018"},{"internalid":"10696","enddate":"30/4/2018"},{"internalid":"10697","enddate":"19/5/2018"},{"internalid":"10698","enddate":"15/4/2018"},{"internalid":"10845","enddate":"31/12/2018"},{"internalid":"10901","enddate":"30/6/2018"},{"internalid":"10848","enddate":"22/12/2018"},{"internalid":"10903","enddate":"22/6/2018"},{"internalid":"10904","enddate":"8/9/2018"},{"internalid":"10906","enddate":"31/8/2020"},{"internalid":"10907","enddate":"30/11/2018"},{"internalid":"10908","enddate":"30/9/2018"},{"internalid":"10866","enddate":"30/4/2018"},{"internalid":"10867","enddate":"19/12/2020"},{"internalid":"10909","enddate":"8/6/2018"},{"internalid":"10910","enddate":"14/9/2018"},{"internalid":"10872","enddate":"12/12/2018"},{"internalid":"10911","enddate":"31/8/2018"},{"internalid":"10912","enddate":"31/10/2018"},{"internalid":"10881","enddate":"31/12/2018"},{"internalid":"10883","enddate":"8/12/2018"},{"internalid":"10885","enddate":"30/11/2020"},{"internalid":"10918","enddate":"13/12/2018"},{"internalid":"10923","enddate":"28/2/2018"},{"internalid":"10898","enddate":"15/6/2018"},{"internalid":"10924","enddate":"30/9/2018"},{"internalid":"10900","enddate":"31/7/2018"},{"internalid":"10925","enddate":"24/9/2020"},{"internalid":"11002","enddate":"9/6/2018"},{"internalid":"11004","enddate":"30/6/2018"},{"internalid":"10927","enddate":"25/9/2020"},{"internalid":"11006","enddate":"30/6/2018"},{"internalid":"10928","enddate":"13/10/2018"},{"internalid":"11008","enddate":"15/6/2020"},{"internalid":"10929","enddate":"30/9/2018"},{"internalid":"11012","enddate":"13/7/2018"},{"internalid":"10930","enddate":"30/9/2018"},{"internalid":"11014","enddate":"22/6/2018"},{"internalid":"10932","enddate":"31/10/2018"},{"internalid":"11016","enddate":"30/6/2018"},{"internalid":"11018","enddate":"26/6/2018"},{"internalid":"10933","enddate":"29/9/2018"},{"internalid":"11020","enddate":"25/6/2020"},{"internalid":"10934","enddate":"31/10/2018"},{"internalid":"11026","enddate":"30/11/2018"},{"internalid":"10937","enddate":"25/3/2018"},{"internalid":"10941","enddate":"3/5/2018"},{"internalid":"11035","enddate":"31/12/2018"},{"internalid":"11039","enddate":"30/11/2020"},{"internalid":"10946","enddate":"31/7/2018"},{"internalid":"11048","enddate":"30/11/2018"},{"internalid":"11050","enddate":"16/8/2019"},{"internalid":"10950","enddate":"27/7/2018"},{"internalid":"10951","enddate":"20/9/2018"},{"internalid":"10952","enddate":"26/9/2018"},{"internalid":"11061","enddate":"31/3/2018"},{"internalid":"11063","enddate":"31/1/2019"},{"internalid":"11070","enddate":"29/12/2018"},{"internalid":"11072","enddate":"20/12/2020"},{"internalid":"11074","enddate":"22/12/2018"},{"internalid":"10954","enddate":"28/9/2018"},{"internalid":"11080","enddate":"25/3/2019"},{"internalid":"10956","enddate":"23/9/2018"},{"internalid":"11081","enddate":"5/4/2018"},{"internalid":"10957","enddate":"24/11/2018"},{"internalid":"10958","enddate":"3/10/2018"},{"internalid":"10959","enddate":"31/8/2018"},{"internalid":"11089","enddate":"31/5/2020"},{"internalid":"11091","enddate":"9/7/2018"},{"internalid":"11098","enddate":"31/8/2018"},{"internalid":"10965","enddate":"19/12/2018"},{"internalid":"11100","enddate":"5/8/2018"},{"internalid":"11102","enddate":"30/6/2018"},{"internalid":"11104","enddate":"30/6/2018"},{"internalid":"11106","enddate":"30/6/2018"},{"internalid":"10969","enddate":"11/10/2020"},{"internalid":"10970","enddate":"30/6/2018"},{"internalid":"11110","enddate":"31/7/2018"},{"internalid":"11112","enddate":"30/6/2018"},{"internalid":"11118","enddate":"13/12/2018"},{"internalid":"10974","enddate":"21/10/2018"},{"internalid":"10975","enddate":"28/10/2018"},{"internalid":"10977","enddate":"27/10/2018"},{"internalid":"11126","enddate":"21/12/2018"},{"internalid":"10978","enddate":"29/12/2018"},{"internalid":"10979","enddate":"29/10/2018"},{"internalid":"10980","enddate":"18/11/2018"},{"internalid":"10981","enddate":"30/11/2018"},{"internalid":"11135","enddate":"31/12/2018"},{"internalid":"11137","enddate":"31/1/2019"},{"internalid":"11142","enddate":"28/9/2018"},{"internalid":"11154","enddate":"3/9/2018"},{"internalid":"11156","enddate":"21/3/2018"},{"internalid":"10992","enddate":"31/5/2018"},{"internalid":"10993","enddate":"30/4/2018"},{"internalid":"10996","enddate":"30/4/2022"},{"internalid":"11168","enddate":"26/5/2018"},{"internalid":"10999","enddate":"30/4/2020"},{"internalid":"11304","enddate":"25/3/2018"},{"internalid":"11305","enddate":"3/7/2018"},{"internalid":"11401","enddate":"9/6/2019"},{"internalid":"11406","enddate":"31/7/2018"},{"internalid":"11428","enddate":"15/12/2018"},{"internalid":"11439","enddate":"9/2/2019"},{"internalid":"11449","enddate":"15/6/2019"},{"internalid":"11451","enddate":"17/8/2018"},{"internalid":"11473","enddate":"5/12/2018"},{"internalid":"11479","enddate":"31/8/2018"},{"internalid":"11481","enddate":"31/7/2020"},{"internalid":"11484","enddate":"15/8/2018"},{"internalid":"11494","enddate":"16/9/2018"},{"internalid":"11496","enddate":"6/8/2018"},{"internalid":"11498","enddate":"31/8/2018"},{"internalid":"11500","enddate":"26/7/2018"},{"internalid":"11504","enddate":"28/2/2018"},{"internalid":"11506","enddate":"4/4/2018"},{"internalid":"11512","enddate":"28/6/2018"},{"internalid":"11514","enddate":"29/6/2018"},{"internalid":"11515","enddate":"9/8/2018"},{"internalid":"11516","enddate":"31/8/2018"},{"internalid":"11517","enddate":"30/6/2018"},{"internalid":"11519","enddate":"26/7/2018"},{"internalid":"11520","enddate":"29/6/2020"},{"internalid":"11521","enddate":"31/7/2018"},{"internalid":"11523","enddate":"30/6/2018"},{"internalid":"11524","enddate":"7/12/2019"},{"internalid":"11525","enddate":"10/2/2018"},{"internalid":"11526","enddate":"18/2/2018"},{"internalid":"11528","enddate":"31/12/2019"},{"internalid":"11529","enddate":"31/12/2019"},{"internalid":"11530","enddate":"1/2/2018"},{"internalid":"11531","enddate":"31/1/2019"},{"internalid":"11532","enddate":"25/3/2018"},{"internalid":"11533","enddate":"31/1/2020"},{"internalid":"11539","enddate":"27/9/2018"},{"internalid":"11540","enddate":"1/5/2018"},{"internalid":"11541","enddate":"26/4/2018"},{"internalid":"11543","enddate":"31/5/2018"},{"internalid":"11544","enddate":"31/5/2018"},{"internalid":"11545","enddate":"26/5/2018"},{"internalid":"11546","enddate":"29/9/2018"},{"internalid":"11547","enddate":"30/6/2020"},{"internalid":"11548","enddate":"7/5/2018"},{"internalid":"11551","enddate":"7/12/2018"},{"internalid":"11557","enddate":"31/8/2018"},{"internalid":"11559","enddate":"27/9/2018"},{"internalid":"11560","enddate":"30/6/2018"},{"internalid":"11563","enddate":"12/7/2018"},{"internalid":"11567","enddate":"31/7/2018"},{"internalid":"11571","enddate":"16/9/2018"},{"internalid":"11573","enddate":"2/2/2018"},{"internalid":"11574","enddate":"25/2/2018"},{"internalid":"11575","enddate":"3/2/2020"},{"internalid":"11576","enddate":"7/6/2019"},{"internalid":"11578","enddate":"7/2/2018"},{"internalid":"11579","enddate":"8/2/2018"},{"internalid":"11583","enddate":"28/2/2018"},{"internalid":"11584","enddate":"7/8/2018"},{"internalid":"11586","enddate":"29/9/2018"},{"internalid":"11587","enddate":"31/5/2018"},{"internalid":"11588","enddate":"30/6/2018"},{"internalid":"11590","enddate":"16/9/2018"},{"internalid":"11591","enddate":"11/9/2018"},{"internalid":"11592","enddate":"12/6/2018"},{"internalid":"11593","enddate":"2/10/2018"},{"internalid":"11594","enddate":"31/7/2018"},{"internalid":"11595","enddate":"30/9/2018"},{"internalid":"11596","enddate":"23/12/2018"},{"internalid":"11710","enddate":"14/8/2020"},{"internalid":"11711","enddate":"14/8/2018"},{"internalid":"11713","enddate":"29/9/2018"},{"internalid":"11714","enddate":"31/7/2018"},{"internalid":"11715","enddate":"31/8/2018"},{"internalid":"11716","enddate":"31/8/2018"},{"internalid":"11717","enddate":"10/8/2018"},{"internalid":"11719","enddate":"28/2/2018"},{"internalid":"11721","enddate":"31/8/2018"},{"internalid":"11722","enddate":"28/2/2018"},{"internalid":"11723","enddate":"1/9/2018"},{"internalid":"11724","enddate":"31/3/2018"},{"internalid":"11731","enddate":"6/3/2018"},{"internalid":"11732","enddate":"30/9/2018"},{"internalid":"11733","enddate":"31/8/2020"},{"internalid":"11735","enddate":"30/9/2018"},{"internalid":"11736","enddate":"2/7/2020"},{"internalid":"11737","enddate":"30/9/2018"},{"internalid":"11738","enddate":"31/8/2020"},{"internalid":"11739","enddate":"24/6/2018"},{"internalid":"11740","enddate":"29/9/2018"},{"internalid":"11742","enddate":"31/8/2018"},{"internalid":"11743","enddate":"30/4/2018"},{"internalid":"11747","enddate":"30/11/2020"},{"internalid":"11755","enddate":"31/8/2018"},{"internalid":"11759","enddate":"10/9/2018"},{"internalid":"11760","enddate":"15/9/2018"},{"internalid":"11762","enddate":"31/10/2018"},{"internalid":"11763","enddate":"3/8/2018"},{"internalid":"11764","enddate":"30/9/2018"},{"internalid":"11765","enddate":"31/10/2018"},{"internalid":"11768","enddate":"31/3/2018"},{"internalid":"11771","enddate":"5/5/2018"},{"internalid":"11772","enddate":"29/2/2020"},{"internalid":"11773","enddate":"15/4/2018"},{"internalid":"11774","enddate":"30/4/2018"},{"internalid":"11775","enddate":"31/5/2018"},{"internalid":"11777","enddate":"27/5/2018"},{"internalid":"11778","enddate":"30/4/2018"},{"internalid":"11781","enddate":"30/9/2018"},{"internalid":"11782","enddate":"2/8/2018"},{"internalid":"11784","enddate":"31/8/2018"},{"internalid":"11786","enddate":"31/7/2018"},{"internalid":"11788","enddate":"31/5/2020"},{"internalid":"11791","enddate":"2/6/2018"},{"internalid":"11793","enddate":"31/7/2018"},{"internalid":"11902","enddate":"5/10/2018"},{"internalid":"11903","enddate":"21/10/2018"},{"internalid":"11904","enddate":"6/9/2018"},{"internalid":"11905","enddate":"31/10/2018"},{"internalid":"11907","enddate":"20/9/2018"},{"internalid":"11908","enddate":"31/10/2020"},{"internalid":"11909","enddate":"29/9/2018"},{"internalid":"11910","enddate":"31/8/2018"},{"internalid":"11911","enddate":"30/9/2018"},{"internalid":"11912","enddate":"31/8/2018"},{"internalid":"11913","enddate":"29/10/2018"},{"internalid":"11916","enddate":"20/5/2018"},{"internalid":"11917","enddate":"5/4/2018"},{"internalid":"11918","enddate":"5/6/2018"},{"internalid":"11919","enddate":"5/5/2020"},{"internalid":"11924","enddate":"30/4/2018"},{"internalid":"11925","enddate":"10/5/2018"},{"internalid":"11926","enddate":"30/4/2018"},{"internalid":"11927","enddate":"8/10/2018"},{"internalid":"11929","enddate":"31/8/2020"},{"internalid":"11930","enddate":"30/9/2018"},{"internalid":"11931","enddate":"30/6/2018"},{"internalid":"11933","enddate":"31/5/2022"},{"internalid":"11934","enddate":"31/8/2022"},{"internalid":"11937","enddate":"7/6/2020"},{"internalid":"11947","enddate":"28/9/2018"},{"internalid":"11948","enddate":"3/7/2018"},{"internalid":"11949","enddate":"30/9/2018"},{"internalid":"11950","enddate":"29/10/2018"},{"internalid":"11951","enddate":"25/9/2018"},{"internalid":"11952","enddate":"20/10/2018"},{"internalid":"11953","enddate":"20/12/2018"},{"internalid":"11954","enddate":"26/9/2022"},{"internalid":"11956","enddate":"18/11/2018"},{"internalid":"11957","enddate":"31/10/2018"},{"internalid":"11960","enddate":"30/9/2018"},{"internalid":"11961","enddate":"29/2/2020"},{"internalid":"11963","enddate":"31/3/2018"},{"internalid":"11964","enddate":"28/4/2018"},{"internalid":"11965","enddate":"30/4/2018"},{"internalid":"11966","enddate":"1/4/2018"},{"internalid":"11967","enddate":"31/1/2019"},{"internalid":"11968","enddate":"21/4/2018"},{"internalid":"11969","enddate":"26/5/2018"},{"internalid":"11970","enddate":"10/5/2018"},{"internalid":"11972","enddate":"5/4/2020"},{"internalid":"11973","enddate":"28/7/2018"},{"internalid":"11974","enddate":"14/6/2018"},{"internalid":"11975","enddate":"19/9/2018"},{"internalid":"11977","enddate":"31/5/2020"},{"internalid":"11978","enddate":"15/6/2020"},{"internalid":"11980","enddate":"20/7/2018"},{"internalid":"11981","enddate":"10/7/2018"},{"internalid":"11982","enddate":"7/7/2018"},{"internalid":"11983","enddate":"22/6/2018"},{"internalid":"11985","enddate":"30/9/2018"},{"internalid":"11986","enddate":"23/9/2018"},{"internalid":"11997","enddate":"31/10/2018"},{"internalid":"11998","enddate":"31/10/2018"},{"internalid":"11999","enddate":"30/9/2018"},{"internalid":"12001","enddate":"25/10/2018"},{"internalid":"12002","enddate":"30/9/2020"},{"internalid":"12004","enddate":"30/11/2018"},{"internalid":"12006","enddate":"31/10/2019"},{"internalid":"12007","enddate":"31/10/2018"},{"internalid":"12008","enddate":"12/12/2018"},{"internalid":"12009","enddate":"30/6/2018"},{"internalid":"12011","enddate":"30/6/2018"},{"internalid":"12012","enddate":"2/5/2018"},{"internalid":"12013","enddate":"28/6/2018"},{"internalid":"12014","enddate":"13/6/2018"},{"internalid":"12015","enddate":"31/5/2018"},{"internalid":"12016","enddate":"11/5/2018"},{"internalid":"12017","enddate":"30/4/2018"},{"internalid":"12019","enddate":"31/5/2018"},{"internalid":"12020","enddate":"10/6/2018"},{"internalid":"12021","enddate":"30/5/2018"},{"internalid":"12023","enddate":"22/6/2022"},{"internalid":"12028","enddate":"30/6/2018"},{"internalid":"5713","enddate":"2/5/2019"},{"internalid":"5715","enddate":"30/4/2018"},{"internalid":"5758","enddate":"13/8/2018"},{"internalid":"5760","enddate":"18/7/2019"},{"internalid":"5762","enddate":"15/1/2022"},{"internalid":"5763","enddate":"3/10/2019"},{"internalid":"5800","enddate":"16/9/2019"},{"internalid":"6101","enddate":"16/9/2019"},{"internalid":"6105","enddate":"30/11/2018"},{"internalid":"6106","enddate":"31/12/2019"},{"internalid":"6107","enddate":"8/3/2018"},{"internalid":"6109","enddate":"13/12/2019"},{"internalid":"6149","enddate":"3/1/2020"},{"internalid":"6151","enddate":"1/1/2020"},{"internalid":"6153","enddate":"1/1/2020"},{"internalid":"6154","enddate":"14/5/2019"},{"internalid":"6502","enddate":"6/2/2018"},{"internalid":"6543","enddate":"25/3/2018"},{"internalid":"6544","enddate":"31/8/2018"},{"internalid":"6546","enddate":"2/9/2018"},{"internalid":"6548","enddate":"6/5/2018"},{"internalid":"6549","enddate":"23/6/2018"},{"internalid":"6554","enddate":"31/3/2018"},{"internalid":"6595","enddate":"11/2/2020"},{"internalid":"6598","enddate":"25/5/2018"},{"internalid":"6840","enddate":"28/2/2018"},{"internalid":"6841","enddate":"25/2/2018"},{"internalid":"6843","enddate":"25/3/2018"},{"internalid":"6845","enddate":"9/2/2018"},{"internalid":"6846","enddate":"31/3/2018"},{"internalid":"6849","enddate":"30/3/2018"},{"internalid":"6885","enddate":"9/2/2018"},{"internalid":"6887","enddate":"1/2/2019"},{"internalid":"6889","enddate":"2/12/2018"},{"internalid":"7071","enddate":"23/12/2018"},{"internalid":"6890","enddate":"22/12/2018"},{"internalid":"7075","enddate":"23/12/2018"},{"internalid":"6891","enddate":"31/3/2018"},{"internalid":"7078","enddate":"4/7/2019"},{"internalid":"6892","enddate":"30/3/2018"},{"internalid":"6894","enddate":"7/3/2018"},{"internalid":"6896","enddate":"9/4/2018"},{"internalid":"6897","enddate":"10/2/2019"},{"internalid":"7090","enddate":"7/6/2019"},{"internalid":"7363","enddate":"9/6/2019"},{"internalid":"7368","enddate":"27/6/2018"},{"internalid":"7378","enddate":"22/7/2019"},{"internalid":"7486","enddate":"7/11/2019"},{"internalid":"7488","enddate":"19/2/2018"},{"internalid":"7702","enddate":"4/2/2018"},{"internalid":"7817","enddate":"24/2/2018"},{"internalid":"7818","enddate":"26/3/2018"},{"internalid":"7820","enddate":"19/4/2018"},{"internalid":"7823","enddate":"13/6/2020"},{"internalid":"7787","enddate":"3/1/2020"},{"internalid":"7789","enddate":"4/1/2020"},{"internalid":"7793","enddate":"28/2/2018"},{"internalid":"7795","enddate":"25/2/2019"},{"internalid":"7861","enddate":"16/8/2018"},{"internalid":"7863","enddate":"10/3/2018"},{"internalid":"7865","enddate":"6/10/2018"},{"internalid":"7867","enddate":"23/11/2020"},{"internalid":"8064","enddate":"31/1/2020"},{"internalid":"7869","enddate":"21/12/2018"},{"internalid":"8068","enddate":"31/5/2019"},{"internalid":"7870","enddate":"6/1/2019"},{"internalid":"8073","enddate":"28/2/2018"},{"internalid":"8081","enddate":"25/3/2018"},{"internalid":"8084","enddate":"7/2/2018"},{"internalid":"8209","enddate":"3/1/2019"},{"internalid":"8212","enddate":"25/3/2019"},{"internalid":"8214","enddate":"15/3/2019"},{"internalid":"8216","enddate":"25/3/2019"},{"internalid":"8218","enddate":"25/3/2018"},{"internalid":"8154","enddate":"19/5/2018"},{"internalid":"8158","enddate":"30/3/2018"},{"internalid":"8162","enddate":"21/4/2018"},{"internalid":"8164","enddate":"20/3/2018"},{"internalid":"8168","enddate":"15/4/2018"},{"internalid":"8170","enddate":"7/7/2018"},{"internalid":"8177","enddate":"10/9/2018"},{"internalid":"8179","enddate":"5/10/2020"},{"internalid":"8244","enddate":"9/3/2018"},{"internalid":"8245","enddate":"9/3/2018"},{"internalid":"8246","enddate":"31/3/2018"},{"internalid":"8247","enddate":"25/3/2018"},{"internalid":"8249","enddate":"20/3/2018"},{"internalid":"8250","enddate":"30/4/2018"},{"internalid":"8251","enddate":"22/6/2018"},{"internalid":"8256","enddate":"30/9/2018"},{"internalid":"8258","enddate":"26/11/2020"},{"internalid":"8259","enddate":"29/8/2018"},{"internalid":"8261","enddate":"25/6/2018"},{"internalid":"8262","enddate":"31/10/2018"},{"internalid":"8350","enddate":"13/2/2018"},{"internalid":"8264","enddate":"28/10/2018"},{"internalid":"8265","enddate":"24/7/2018"},{"internalid":"8354","enddate":"14/2/2018"},{"internalid":"8266","enddate":"30/9/2018"},{"internalid":"8267","enddate":"31/5/2020"},{"internalid":"8270","enddate":"4/4/2018"},{"internalid":"8366","enddate":"25/1/2020"},{"internalid":"8370","enddate":"25/3/2018"},{"internalid":"8372","enddate":"2/2/2018"},{"internalid":"8276","enddate":"30/9/2018"},{"internalid":"8279","enddate":"30/11/2018"},{"internalid":"8281","enddate":"31/10/2022"},{"internalid":"8282","enddate":"14/3/2019"},{"internalid":"8283","enddate":"19/11/2018"},{"internalid":"8284","enddate":"31/10/2018"},{"internalid":"8285","enddate":"31/10/2018"},{"internalid":"8286","enddate":"17/11/2018"},{"internalid":"8287","enddate":"23/11/2018"},{"internalid":"8288","enddate":"31/10/2018"},{"internalid":"8291","enddate":"29/2/2020"},{"internalid":"8292","enddate":"29/2/2020"},{"internalid":"8295","enddate":"27/3/2020"},{"internalid":"8603","enddate":"30/6/2018"},{"internalid":"8606","enddate":"30/9/2018"},{"internalid":"8607","enddate":"28/2/2019"},{"internalid":"8608","enddate":"26/11/2020"},{"internalid":"8611","enddate":"31/10/2018"},{"internalid":"8612","enddate":"29/10/2018"},{"internalid":"8613","enddate":"28/11/2018"},{"internalid":"8615","enddate":"30/10/2018"},{"internalid":"8618","enddate":"30/9/2020"},{"internalid":"8624","enddate":"30/11/2018"},{"internalid":"8628","enddate":"31/10/2020"},{"internalid":"8629","enddate":"25/11/2018"},{"internalid":"8631","enddate":"30/11/2018"},{"internalid":"8632","enddate":"1/11/2018"},{"internalid":"8634","enddate":"31/12/2018"},{"internalid":"8635","enddate":"31/10/2019"},{"internalid":"8636","enddate":"30/11/2020"},{"internalid":"8637","enddate":"30/11/2018"},{"internalid":"8638","enddate":"31/3/2020"},{"internalid":"8643","enddate":"30/4/2018"},{"internalid":"8644","enddate":"31/5/2018"},{"internalid":"8647","enddate":"30/4/2018"},{"internalid":"8648","enddate":"9/5/2018"},{"internalid":"8650","enddate":"10/2/2019"},{"internalid":"8651","enddate":"16/11/2018"},{"internalid":"8652","enddate":"30/11/2018"},{"internalid":"8653","enddate":"30/9/2020"},{"internalid":"8654","enddate":"10/3/2020"},{"internalid":"8655","enddate":"31/10/2020"},{"internalid":"8749","enddate":"25/3/2018"},{"internalid":"8658","enddate":"31/10/2018"},{"internalid":"8661","enddate":"30/11/2018"},{"internalid":"8757","enddate":"31/3/2018"},{"internalid":"8662","enddate":"30/11/2018"},{"internalid":"8761","enddate":"6/12/2018"},{"internalid":"8763","enddate":"28/2/2018"},{"internalid":"8666","enddate":"1/6/2018"},{"internalid":"8669","enddate":"31/5/2018"},{"internalid":"8673","enddate":"30/11/2018"},{"internalid":"8691","enddate":"30/4/2020"},{"internalid":"8692","enddate":"28/7/2018"},{"internalid":"8694","enddate":"1/5/2018"},{"internalid":"8695","enddate":"5/7/2018"},{"internalid":"8696","enddate":"30/6/2018"},{"internalid":"8697","enddate":"31/5/2018"},{"internalid":"8698","enddate":"30/11/2020"},{"internalid":"8699","enddate":"18/11/2019"},{"internalid":"8700","enddate":"16/11/2018"},{"internalid":"8834","enddate":"28/2/2018"},{"internalid":"8839","enddate":"1/3/2018"},{"internalid":"8848","enddate":"9/2/2019"},{"internalid":"8852","enddate":"8/4/2019"},{"internalid":"8856","enddate":"9/3/2018"},{"internalid":"8911","enddate":"20/12/2018"},{"internalid":"8913","enddate":"24/4/2018"},{"internalid":"8916","enddate":"31/7/2018"},{"internalid":"8919","enddate":"30/4/2018"},{"internalid":"8921","enddate":"31/12/2018"},{"internalid":"8924","enddate":"11/12/2018"},{"internalid":"8925","enddate":"3/1/2019"},{"internalid":"8926","enddate":"30/11/2018"},{"internalid":"8927","enddate":"30/11/2018"},{"internalid":"8928","enddate":"31/1/2019"},{"internalid":"8931","enddate":"21/12/2018"},{"internalid":"8933","enddate":"10/6/2018"},{"internalid":"8934","enddate":"31/7/2018"},{"internalid":"8936","enddate":"16/6/2018"},{"internalid":"8937","enddate":"31/5/2018"},{"internalid":"8938","enddate":"16/6/2018"},{"internalid":"8939","enddate":"8/5/2018"},{"internalid":"8943","enddate":"17/8/2018"},{"internalid":"8944","enddate":"15/6/2018"},{"internalid":"8945","enddate":"31/5/2018"},{"internalid":"8946","enddate":"31/12/2018"},{"internalid":"8949","enddate":"9/12/2018"},{"internalid":"8950","enddate":"7/12/2020"},{"internalid":"8952","enddate":"30/11/2018"},{"internalid":"8954","enddate":"16/12/2018"},{"internalid":"8955","enddate":"4/12/2018"},{"internalid":"8957","enddate":"21/11/2020"},{"internalid":"8966","enddate":"31/10/2018"},{"internalid":"8969","enddate":"30/11/2018"},{"internalid":"8970","enddate":"23/12/2018"},{"internalid":"8971","enddate":"17/12/2020"},{"internalid":"8972","enddate":"2/12/2018"},{"internalid":"8973","enddate":"30/11/2020"},{"internalid":"8974","enddate":"4/12/2018"},{"internalid":"8975","enddate":"30/11/2018"},{"internalid":"8980","enddate":"7/6/2018"},{"internalid":"8984","enddate":"31/5/2018"},{"internalid":"8985","enddate":"16/6/2018"},{"internalid":"8987","enddate":"31/5/2020"},{"internalid":"8988","enddate":"6/8/2018"},{"internalid":"8989","enddate":"30/6/2018"},{"internalid":"8990","enddate":"30/6/2018"},{"internalid":"8992","enddate":"7/7/2018"},{"internalid":"8993","enddate":"23/11/2019"},{"internalid":"8994","enddate":"4/12/2020"},{"internalid":"8995","enddate":"31/12/2018"},{"internalid":"8996","enddate":"24/12/2018"},{"internalid":"8997","enddate":"27/11/2020"},{"internalid":"8998","enddate":"22/12/2018"},{"internalid":"8999","enddate":"7/12/2018"},{"internalid":"9000","enddate":"30/11/2018"},{"internalid":"9401","enddate":"5/12/2018"},{"internalid":"9404","enddate":"5/11/2020"},{"internalid":"9416","enddate":"2/2/2019"},{"internalid":"9417","enddate":"31/12/2018"},{"internalid":"9418","enddate":"30/11/2022"},{"internalid":"9419","enddate":"15/1/2019"},{"internalid":"9421","enddate":"3/1/2019"},{"internalid":"9422","enddate":"17/1/2019"},{"internalid":"9424","enddate":"28/12/2018"},{"internalid":"9425","enddate":"31/12/2018"},{"internalid":"9426","enddate":"20/12/2020"},{"internalid":"9427","enddate":"20/12/2018"},{"internalid":"9429","enddate":"31/5/2018"},{"internalid":"9432","enddate":"30/8/2018"},{"internalid":"9433","enddate":"31/8/2018"},{"internalid":"9434","enddate":"21/6/2018"},{"internalid":"9435","enddate":"21/6/2018"},{"internalid":"9436","enddate":"31/7/2018"},{"internalid":"9437","enddate":"15/7/2018"},{"internalid":"9438","enddate":"18/7/2018"},{"internalid":"9440","enddate":"30/11/2018"},{"internalid":"9442","enddate":"30/11/2020"},{"internalid":"9443","enddate":"4/12/2020"},{"internalid":"9444","enddate":"4/12/2018"},{"internalid":"9445","enddate":"30/11/2018"},{"internalid":"9446","enddate":"30/11/2018"},{"internalid":"9681","enddate":"4/5/2018"},{"internalid":"9447","enddate":"30/12/2018"},{"internalid":"9448","enddate":"16/12/2018"},{"internalid":"9449","enddate":"14/12/2018"},{"internalid":"9450","enddate":"8/12/2018"},{"internalid":"9451","enddate":"7/12/2018"},{"internalid":"9461","enddate":"13/11/2018"},{"internalid":"9466","enddate":"29/9/2018"},{"internalid":"9469","enddate":"31/12/2018"},{"internalid":"9472","enddate":"31/8/2018"},{"internalid":"9474","enddate":"30/6/2018"},{"internalid":"9475","enddate":"30/6/2018"},{"internalid":"9476","enddate":"1/9/2018"},{"internalid":"9478","enddate":"31/7/2018"},{"internalid":"9481","enddate":"31/8/2018"},{"internalid":"9482","enddate":"29/6/2020"},{"internalid":"9484","enddate":"26/7/2018"},{"internalid":"9485","enddate":"12/12/2018"},{"internalid":"9755","enddate":"4/6/2018"},{"internalid":"9486","enddate":"16/12/2018"},{"internalid":"9487","enddate":"14/12/2018"},{"internalid":"9488","enddate":"30/1/2019"},{"internalid":"9489","enddate":"16/12/2018"},{"internalid":"9490","enddate":"23/12/2018"},{"internalid":"9491","enddate":"30/11/2020"},{"internalid":"9492","enddate":"19/12/2020"},{"internalid":"9493","enddate":"30/11/2018"},{"internalid":"9496","enddate":"31/12/2018"},{"internalid":"9497","enddate":"21/12/2018"},{"internalid":"9819","enddate":"15/3/2019"},{"internalid":"9820","enddate":"5/4/2019"},{"internalid":"9821","enddate":"25/3/2018"},{"internalid":"9822","enddate":"28/2/2019"},{"internalid":"9823","enddate":"4/7/2019"},{"internalid":"9824","enddate":"20/5/2019"},{"internalid":"9825","enddate":"12/5/2018"},{"internalid":"9947","enddate":"22/2/2018"},{"internalid":"9828","enddate":"31/10/2018"},{"internalid":"9829","enddate":"31/7/2018"},{"internalid":"9830","enddate":"31/8/2018"},{"internalid":"9831","enddate":"21/12/2020"},{"internalid":"9832","enddate":"23/12/2018"},{"internalid":"9835","enddate":"4/2/2018"},{"internalid":"9853","enddate":"13/6/2019"},{"internalid":"9854","enddate":"13/8/2018"},{"internalid":"9855","enddate":"20/7/2019"},{"internalid":"9856","enddate":"15/1/2022"},{"internalid":"10115","enddate":"13/3/2018"},{"internalid":"9857","enddate":"4/9/2018"},{"internalid":"10117","enddate":"18/3/2018"},{"internalid":"10118","enddate":"31/5/2018"}]

for(var i = 0; i<objArr.length; i++) {
	
	
	nlapiSubmitField('revenueplan', objArr[i].internalid, 'revrecenddate', objArr[i].enddate);
	
	nlapiLogExecution('debug', 'curr_index', i)
	
			 var ctx = nlapiGetContext();
			var remainingUsage = ctx.getRemainingUsage();
			if (remainingUsage < 200) {
               var state = nlapiYieldScript();
               if (state.status == 'FAILURE') {
                   nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script customer statement scheduled');
               }
               else if (state.status == 'RESUME') {
                   nlapiLogExecution("AUDIT", 'customer statements galooli', "Resuming script due to: " + state.reason + ",  " + state.size);
               }
           }
}

}
