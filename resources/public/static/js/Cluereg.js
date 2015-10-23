function set_return_specific(id, name) {
	window.opener.document.EditView.clueregname.value = name;
	window.opener.document.EditView.clueregsid.value = id;
	///Field Rule
	if(window.opener.set_flsrules_module_info != undefined) {
		var relyonmod = window.opener.document.EditView.module.value;
		var controlmod = document.selectall.pmodule.value;
		window.opener.set_flsrules_module_info(relyonmod,controlmod,id);
	}
}

function set_return(id, name) {
	window.opener.document.EditView.clueregname.value = name;
	window.opener.document.EditView.clueregsid.value = id;
	///Field Rule
	if(window.opener.set_flsrules_module_info != undefined) {
		var relyonmod = window.opener.document.EditView.module.value;
		var controlmod = document.selectall.pmodule.value;
		window.opener.set_flsrules_module_info(relyonmod,controlmod,id);
	}
}


function settotalnoofrows() {
	var max_row_count = document.getElementById('proTab').rows.length;
        max_row_count = eval(max_row_count)-2;

	//set the total number of products
	document.EditView.totalProductCount.value = max_row_count;	
}

function productPickList(currObj,module, row_no,vendor_id) {
	var trObj=currObj.parentNode.parentNode
	var rowId=row_no;//parseInt(trObj.id.substr(trObj.id.indexOf("w")+1,trObj.id.length))
	popuptype = 'inventory_prod';	
	window.open("index.php?module=Products&action=Popup&html=Popup_picker&form=HelpDeskEditView&popuptype="+popuptype+"&curr_row="+rowId,"productWin","width=740,height=565,resizable=0,scrollbars=0,status=1,top=150,left=200");
}

function priceBookPickList(currObj, row_no) {
	var trObj=currObj.parentNode.parentNode
	var rowId=row_no;//parseInt(trObj.id.substr(trObj.id.indexOf("w")+1,trObj.id.length))
	window.open("index.php?module=PriceBooks&action=Popup&html=Popup_picker&form=EditView&popuptype=inventory_pb&fldname=listPrice"+rowId+"&productid="+getObj("hdnProductId"+rowId).value,"priceBookWin","width=640,height=565,resizable=0,scrollbars=0,top=150,left=200");
}


function getProdListBody() {
	if (browser_ie) {
		var prodListBody=getObj("productList").children[0].children[0]
	} else if (browser_nn4 || browser_nn6) {
		if (getObj("productList").childNodes.item(0).tagName=="TABLE") {
			var prodListBody=getObj("productList").childNodes.item(0).childNodes.item(0)
		} else {
			var prodListBody=getObj("productList").childNodes.item(1).childNodes.item(1)
		}
	}
	return prodListBody;
}


function deleteRow(module,i)
{
	rowCnt--;
	var tableName = document.getElementById('proTab');
	var prev = tableName.rows.length;
//	document.getElementById('proTab').deleteRow(i);
	document.getElementById("row"+i).style.display = 'none';
	document.getElementById("hdnProductId"+i).value = "";
	//document.getElementById("productName"+i).value = "";
	document.getElementById('deleted'+i).value = 1;    
}



//Method changed as per advice by jon http://forums.vtiger.com/viewtopic.php?t=4162
function roundValue(val) {
   val = parseFloat(val);
   val = Math.round(val*10000)/10000;
   val = val.toString();
   
   if (val.indexOf(".")<0) {
      //val+=".00"
   } else {
      var dec=val.substring(val.indexOf(".")+1,val.length)
      if (dec.length>4)
         val=val.substring(0,val.indexOf("."))+"."+dec.substring(0,4)
      else if (dec.length==1)
         val=val+"0"
   }
   
   
   return val;
} 

//This function is used to validate the Inventory modules 
function validateInventory() 
{
	if(!formValidate())
		return false;
	
	var max_row_count = document.getElementById('proTab').rows.length;
	max_row_count = eval(max_row_count)-2;//As the table has two header rows, we will reduce two from table row length
    if(max_row_count == 0)
	{
		alert(alert_arr.NO_PRODUCT_SELECTED);
		return false;
	}
	if(!FindDuplicate())
		return false;
	for (var i=1;i<=max_row_count;i++) 
	{
		//if the row is deleted then avoid validate that row values
		if(document.getElementById("deleted"+i).value == 1)
			continue;
		if (!emptyCheck("productName"+i,alert_arr.LBL_PRODUCT,"text")) return false;
		if (!emptyCheck("qty"+i,alert_arr.LBL_QTY,"text")) return false;
		if (!numValidate("qty"+i,alert_arr.LBL_QTY,"any")) return false;
		if (!numConstComp("qty"+i,alert_arr.LBL_QTY,"G","0")) return false;
		if (!emptyCheck("listPrice"+i,alert_arr.LBL_LISTPRICE,"text")) return false;
		if (!numValidate("listPrice"+i,alert_arr.LBL_LISTPRICE,"any")) return false;          
	}
	calcGrandTotal();
	return true;
}

function FindDuplicate()
{
	var max_row_count = document.getElementById('proTab').rows.length;
    max_row_count = eval(max_row_count)-2;//As the table has two header rows, we will reduce two from row length
	var product_id = new Array(max_row_count-1);
	var product_name = new Array(max_row_count-1);
	product_id[1] = getObj("hdnProductId"+1).value;
	product_name[1] = getObj("productName"+1).value;
	for (var i=1;i<=max_row_count;i++)
	{
		for(var j=i+1;j<=max_row_count;j++)
		{
			if(i == 1)
			{
				product_id[j] = getObj("hdnProductId"+j).value;
			}
			if(product_id[i] == product_id[j] && product_id[i] != '')
			{
				alert(alert_arr.SELECTED_MORE_THAN_ONCE);
				return false;
			}
		}
	}
    return true;
}

function fnshow_Hide(Lay){
    var tagName = document.getElementById(Lay);
   	if(tagName.style.display == 'none')
   		tagName.style.display = 'block';
	else
		tagName.style.display = 'none';
}



function calcTotal() {
	calcGrandTotal();
}

function calcGrandTotal() {
	var total = 0;
	var max_row_count = document.getElementById('proTab').rows.length;
	max_row_count = eval(max_row_count)-2;//Because the table has two header rows. so we will reduce two from row length

	for (var i=1;i<=max_row_count;i++) 
	{
		if(document.getElementById('deleted'+i).value == 0)
		{			
			if (document.getElementById('qty'+i).value == "") 
				document.getElementById("qty"+i).value = 0;
			var producttotal = eval(getObj("qty"+i).value*getObj("listPrice"+i).value);
			getObj("productTotal"+i).innerHTML=roundValue(producttotal.toString());
			total += producttotal;
		}
	}

	document.getElementById("grandTotal").innerHTML = roundValue(total.toString());
	document.getElementById("total").value = roundValue(total.toString());
}

function massDelete(module,viewname)
{
		var select_options  =  document.getElementsByName('selected_id');
		var x = select_options.length;
		var viewid =getviewId();		
		idstring = "";

        xx = 0;
        for(i = 0; i < x ; i++)
        {
        	if(select_options[i].checked)
            {
            	idstring = select_options[i].value +";"+idstring
                xx++
            }
        }
        if (xx != 0)
        {
            document.getElementById('idlist').value=idstring;
        }
        else
        {
            alert(alert_arr.SELECT);
            return false;
        }
		if(confirm(alert_arr.DELETE))
		{
			
			$("status").style.display="inline";
			new Ajax.Request(
          	  	      'index.php',
			      	{queue: {position: 'end', scope: 'command'},
		                        method: 'post',
                		        postBody:"module=Users&action=massdelete&return_module="+module+"&viewname="+viewid+"&idlist="+idstring+"&viewname="+viewname,
		                        onComplete: function(response) {
        	        	                $("status").style.display="none";
                	        	        result = response.responseText.split('&#&#&#');
                        	        	$("ListViewContents").innerHTML= result[2];
	                        	        if(result[1] != '')
                                        		alert(result[1]);
		                        }
              			 }
       			);
		}
		else
		{
			return false;
		}

}


function selectProductRows(form)
{
	window.open("index.php?module=Products&action=PopupForModules&html=Popup_picker&popuptype=inventory_prods&select=enable&modules=Clueregs","productWin","width=740,height=565,resizable=1,scrollbars=1,status=1,top=150,left=200");	
}




function setSelectedProductRow()
{
	var idlist = document.selectall.idlist.value;
	var id_arr = idlist.split(';');
	x = document.selectall.selected_id.length;
	if ( x != undefined) {
		for(var i = 0; i < x ; i++)
		{
			for (var j = 0; j < id_arr.length; j++) {
			        
				if(document.selectall.selected_id[i].value == id_arr[j])
				{
					document.selectall.selected_id[i].checked = true;
				}								
			}
			
		}
	} else {
	        if(document.selectall.selected_id != undefined) {
			for (var j = 0; j < id_arr.length; j++) {			        
				if(document.selectall.selected_id.value == id_arr[j])
				{
					document.selectall.selected_id.checked = true;
				}								
			}
		}
	}
}
function UpdateIDString()
{
	x = document.selectall.selected_id.length;
	var y=0;
	var idstring = document.selectall.idlist.value;
	namestr = "";
	if ( x == undefined)
	{
		if(document.selectall.selected_id != undefined) {
		        //单条记录
		        if(document.selectall.selected_id.checked) {
				var idvalue = document.selectall.selected_id.value;
				var id_arr = idstring.split(';');
				var flag = false;
				for (var j = 0; j < id_arr.length; j++) {
					if(idvalue == id_arr[j])
					{
						flag = true;
						break;
					}
				}
				if(!flag) {
					var repeated = false;
					var selectedProductsLength = opener.window.document.forms['EditView'].elements.length;
					for(var m=0;m<selectedProductsLength;m++) {
						if(opener.window.document.forms['EditView'].elements[m].name.indexOf('hdnProductId') > -1) {
							tmpProductID = opener.window.document.forms['EditView'].elements[m].name;
							tmpProductIndex = tmpProductID.substring(12);

							if(opener.window.document.forms['EditView'].elements["deleted"+tmpProductIndex].value == 0 && opener.window.document.forms['EditView'].elements[m].value == idvalue) {
								alert(alert_arr.PRODUCT_SELECTED);
								document.selectall.selected_id.checked = false;
								repeated = true;
								break;
							}
						}
					}
					if(!repeated) {
						if(idstring != "") {
							idstring = idstring + ";" + idvalue;
						} else {
							idstring = idvalue;
						}
					}
				}

			} else {
				var idvalue = document.selectall.selected_id.value+";";
				idstring = idstring.replace(idvalue,"");
			}
			y=y+1;

		}
		//return false;
	}
	else
	{
	        //多条记录
		y=0;
		for(i = 0; i < x ; i++)
		{
			if(document.selectall.selected_id[i].checked)
			{
			    var idvalue = document.selectall.selected_id[i].value;
				var id_arr = idstring.split(';');
				var flag = false;
				for (var j = 0; j < id_arr.length; j++) {
					if(idvalue == id_arr[j])
					{
						flag = true;
						break;
					}
				}
				if(!flag) {
					var repeated = false;
					var selectedProductsLength = opener.window.document.forms['EditView'].elements.length;
					for(var m=0;m<selectedProductsLength;m++) {
						if(opener.window.document.forms['EditView'].elements[m].name.indexOf('hdnProductId') > -1) {
							tmpProductID = opener.window.document.forms['EditView'].elements[m].name;
							tmpProductIndex = tmpProductID.substring(12);

							if(opener.window.document.forms['EditView'].elements["deleted"+tmpProductIndex].value == 0 && opener.window.document.forms['EditView'].elements[m].value == idvalue) {
								alert(alert_arr.PRODUCT_SELECTED);
								document.selectall.selected_id[i].checked = false;
								repeated = true;
								break;
							}
						}
					}
					if(!repeated) {
						if(idstring != "") {
							idstring = idstring + ";" + idvalue;
						} else {
							idstring = idvalue;
						}
					}
				}

			} else {
				var idvalue = document.selectall.selected_id[i].value+";";
				idstring = idstring.replace(idvalue,"");
			}
			y=y+1;
		}
	}
	if (y != 0)
	{
		document.selectall.idlist.value = idstring;
	}
	else
	{
		alert(alert_arr.SELECT);
		return false;
	}
	//alert(idstring);

}
function addMultiProductRow(module)
{
	UpdateIDString();
	var idlist = document.selectall.idlist.value;
	new Ajax.Request(
		  'index.php',
		  {queue: {position: 'end', scope: 'command'},
					method: 'post',
					postBody:"module=Products&action=ProductsAjax&file=getProductsByModule&ajax=true&idlist="+ encodeURIComponent(idlist)+"&basemodule="+encodeURIComponent(module),
					onComplete: function(response) {
							result = response.responseText;
							productarr = JSON.parse(result);
							for (var j = eval(productarr.length-1); j > -1; j--) {
								addProductRow(productarr[j]);
							}
							window.close();

					}
			 }
    );
}

function addProductRow(productrow)
{
	var fieldlist = productrow["fieldlist"];
	var module = window.opener.document.EditView.module.value;
	var tableName = window.opener.document.getElementById('proTab');
	var prev = tableName.rows.length;
	var count = eval(prev)-1;
	var row = tableName.insertRow(prev);
	row.id = "row"+count;
	row.style.verticalAlign = "top";
	var colone = row.insertCell(0);
	colone.className = "crmTableRow small";
	colone.innerHTML='<img src="themes/softed/images/delete.gif" border="0" onclick="deleteRow(\''+module+'\','+count+')"><input id="deleted'+count+'" name="deleted'+count+'" type="hidden" value="0">';
	var coli;
	for (var i=0;i<fieldlist.length;i++) {
		rowvalue = productrow[fieldlist[i]];
		if(rowvalue == null) rowvalue = "";
		coli = row.insertCell(i+1);
		if(fieldlist[i] == "productname") {
			coli.className = "crmTableRow small";
			coli.innerHTML= '<input id="productName'+count+'" name="productName'+count+'" class="small" value="' + rowvalue + '" readonly="readonly" type="text"><input id="hdnProductId'+count+'" name="hdnProductId'+count+'" value="'+ productrow["productid"] +'" type="hidden">';
		} else {
			coli.className = "crmTableRow small tdnowrap";
			coli.innerHTML= '&nbsp;' + rowvalue;
		}
	}
	i = i + 1;
	coli = row.insertCell(i);
	coli.className = "crmTableRow small";
	coli.innerHTML='<input id="qty'+count+'" name="qty'+count+'" type="text" class="small " style="width:50px" onfocus="this.className=\'detailedViewTextBoxOn\'" onBlur="FindDuplicate(); settotalnoofrows();calcTotal();" value=""/>';
	i = i + 1;
    coli = row.insertCell(i);
	//listprice
	coli.className = "crmTableRow small";
	coli.innerHTML= '<input id="listPrice'+count+'" name="listPrice'+count+'" type="text" class="small " style="width:70px" onfocus="this.className=\'detailedViewTextBoxOn\'" onBlur="FindDuplicate(); settotalnoofrows();calcTotal();" value="'+ productrow["listprice"] +'"/>&nbsp;<a href="javascript:;;" onclick="priceBookPickList(this,'+count+')"><img border=0 src="themes/softed/images/pricebook.gif">';

	//comments
	i = i + 1;
    coli = row.insertCell(i);
	coli.className = "crmTableRow small";
	coli.innerHTML='<input id="comment'+count+'" name="comment'+count+'" class=small style="width:100px">';

    i = i + 1;
    coli = row.insertCell(i);
	coli.className = "crmTableRow small";
	temp = '<table width="100%" cellpadding="0" cellpadding="5"><tr><td style="padding:5px;" id="productTotal'+count+'" align="right">0.00</td></tr>';
	temp += '</table>';
	temp += '<span style="display:none" id="netPrice'+count+'"><b>&nbsp;</b></span>';
	coli.innerHTML = temp;
}
// Function to Get the price for all the products of an Inventory based on the Currency choosen by the User
function updatePrices() {
	
	var prev_cur = document.getElementById('prev_selected_currency_name');
	var inventory_currency = document.EditView.currency;
	if(confirm(alert_arr.MSG_CHANGE_CURRENCY_REVISE_UNIT_PRICE)) {	
		var current_currency = "";
		var prev_currency = "";
		if (prev_cur != null && inventory_currency != null) {
			current_currency = inventory_currency.value;
			prev_currency = prev_cur.value;
			prev_cur.value = inventory_currency.value;
			//Retrieve all the prices for all the products in currently selected currency
			new Ajax.Request(
				'index.php',
				{queue: {position: 'end', scope: 'command'},
					method: 'post',
					postBody: 'module=Products&action=ProductsAjax&file=InventoryPriceAjax&current_currency='+current_currency+'&prev_currency='+prev_currency,
					onComplete: function(response)
						{
							//alert(response.responseText);
							if(trim(response.responseText).indexOf('SUCCESS') == 0) {
								var res = trim(response.responseText).split("$");
								updatePriceValues(res[1]);							
							} else {
								alert(alert_arr.ERROR);
							}			
						}
				}
			);
		}
	} else {
		if (prev_cur != null && inventory_currency != null)
			inventory_currency.value = prev_cur.value;
	}
}

// Function to Update the price for the products in the Inventory Edit View based on the Currency choosen by the User.
function updatePriceValues(rate) {
	
	if (rate == null || rate == '') return;	
	var productsListElem = document.getElementById('proTab');
	if (productsListElem == null) return;
	
	var max_row_count = productsListElem.rows.length;
	max_row_count = eval(max_row_count)-2;//Because the table has two header rows. so we will reduce two from row length

    var products_list = "";
	for(var i=1;i<=max_row_count;i++)
	{
		var list_price_elem = document.getElementById("listPrice"+i);
		list_price_elem.value = roundValue(eval(list_price_elem.value*rate));
                changeDiscountValue(3,getObj("listPrice"+i));
	}
    calcTotal();
}

function fnvshobj(obj,Lay,id,temp){
    getLine(id,temp);
    var tagName = document.getElementById(Lay);
	if(typeof(tagName) == 'undefined') {
		return;
	}
    var leftSide = findPosX(obj);
    var topSide = findPosY(obj);
    var maxW = tagName.style.width;
    var widthM = maxW.substring(0,maxW.length-2);
    var getVal = eval(leftSide) + eval(widthM);
    if(getVal  > document.body.clientWidth ){
        leftSide = eval(leftSide) - eval(widthM);
        tagName.style.left = leftSide + 400+ 'px';
		//tagName.style.left="auto";
    }
    else
	    // tagName.style.left="auto";
        tagName.style.left= leftSide  + 400 + 'px';
    tagName.style.top= topSide + 'px';
    tagName.style.display = 'block';
    tagName.style.visibility = "visible";
	
}

function getLine(id,temp){
    $("status").style.display="inline";
	var viewname=document.getElementById("viewname").value;
	new Ajax.Request(
		'index.php',
		{queue: {position: 'end', scope: 'command'},
			method: 'post',
			postBody:"module=Clueregs&action=ClueregsAjax&file=GetDetail&ajax=true&start=1&clueregsid="+id+"&edit="+temp+"&viewname="+viewname,
			onComplete: function(response) {
			$("status").style.display="none";			
		 	result= response.responseText.split('&#&#&#');
            document.getElementById("serialinfodiv").innerHTML=result;	
			}
		}
	);
}
function changeCheck(){
    var ch=document.getElementsByName("statu");
	for(var i=0;i<ch.length;i++){
	     ch[i].checked=false;
	}
}
function huifang(){
   myform.description.focus();
   document.getElementsByTagName('clueregsdiv')[0].scrollTop=document.getElementsByTagName('clueregsdiv')[0].scrollHeight;
}

function confirmSetAccount(url,accountid){
	if(accountid!=0){
		alert("该线索已转成学员,不能重复操作");
		return ;
	}
    if(confirm("确认转为学员")){
	  				window.location.href=url;
	}
}

function displayCalendar(inputFieldID,buttonObj,displayTime,timeInput)
{	
    var format = "yyyy-mm-dd";
	if(displayTime) {
		calendarDisplayTime=true;
		format = format + " hh:ii"

	} else { 
		calendarDisplayTime = false;
	}
	var inputField = document.getElementById(inputFieldID);
	

	if(inputField.value.length>6){ //dates must have at least 6 digits...
       if(!inputField.value.match(/^[0-9]*?$/gi)){
       	
			var items = inputField.value.split(/[^0-9]/gi);
			var positionArray = new Object();
			positionArray.m = format.indexOf('mm');
			if(positionArray.m==-1)positionArray.m = format.indexOf('m');
			positionArray.d = format.indexOf('dd');
			if(positionArray.d==-1)positionArray.d = format.indexOf('d');
			positionArray.y = format.indexOf('yyyy');
			positionArray.h = format.indexOf('hh');
			positionArray.i = format.indexOf('ii');
			
			this.initialHour = '00';
			this.initialMinute = '00';				
			var elements = ['y','m','d','h','i'];
			var properties = ['currentYear','currentMonth','inputDay','currentHour','currentMinute'];
			var propertyLength = [4,2,2,2,2];
			for(var i=0;i<elements.length;i++) {
				if(positionArray[elements[i]]>=0) {
					window[properties[i]] = inputField.value.substr(positionArray[elements[i]],propertyLength[i])/1;
				}					
			}			
			currentMonth--;
		}else{
			var monthPos = format.indexOf('mm');
			currentMonth = inputField.value.substr(monthPos,2)/1 -1;
			var yearPos = format.indexOf('yyyy');
			currentYear = inputField.value.substr(yearPos,4);
			var dayPos = format.indexOf('dd');
			tmpDay = inputField.value.substr(dayPos,2);

			var hourPos = format.indexOf('hh');
			if(hourPos>=0){
				tmpHour = inputField.value.substr(hourPos,2);
				currentHour = tmpHour;
				if(currentHour.length==1) currentHour = '0'
			}else{
				currentHour = '00';
			}
			var minutePos = format.indexOf('ii');
			if(minutePos>=0){
				tmpMinute = inputField.value.substr(minutePos,2);
				currentMinute = tmpMinute;
			}else{
				currentMinute = '00';
			}
		}
	}else{
		var d = new Date();
		currentMonth = d.getMonth();
		currentYear = d.getFullYear();
		currentHour = '08';
		currentMinute = '00';
		inputDay = d.getDate()/1;
	}

	inputYear = currentYear;
	inputMonth = currentMonth;

	
	if(!calendarDiv){
		initCalendar();
	}else{
		if(calendarDiv.style.display=='block'){
			closeCalendar();
			return false;
		}
		writeCalendarContent();
	}



	returnFormat = format;
	returnDateTo = inputField;
	positionCalendar(buttonObj);
	calendarDiv.style.visibility = 'visible';
	calendarDiv.style.display = 'block';	
	calendarDiv.style.left=calendarDiv.style.left+'740px';
	calendarDiv.style.top=calendarDiv.style.top+"280px";
	if(iframeObj){
		iframeObj.style.display = '';
		iframeObj.style.height = '140px';
		iframeObj.style.width = '300px';
		
	
				iframeObj2.style.display = '';
		iframeObj2.style.height = '140px';
		iframeObj2.style.width = '300px';
		iframeObj2.style.left = '400px';
		
	}
	setTimeProperties();
	updateYearDiv();
	updateMonthDiv();
	updateMinuteDiv();
	updateHourDiv();

}

function setTimeProperties()
{
	if(!calendarDisplayTime){
		document.getElementById('timeBar').style.display='none';
		document.getElementById('timeBar').style.visibility='hidden';
		document.getElementById('todaysDateString').style.width = '100%';


	}else{
		document.getElementById('timeBar').style.display='block';
		document.getElementById('timeBar').style.visibility='visible';
		document.getElementById('hourDropDown').style.top = document.getElementById('calendar_minute_txt').parentNode.offsetHeight + calendarContentDiv.offsetHeight + document.getElementById('topBar').offsetHeight + 'px';
		document.getElementById('minuteDropDown').style.top = document.getElementById('calendar_minute_txt').parentNode.offsetHeight + calendarContentDiv.offsetHeight + document.getElementById('topBar').offsetHeight + 'px';
		document.getElementById('minuteDropDown').style.right = '50px';
		document.getElementById('hourDropDown').style.right = '50px';
		document.getElementById('todaysDateString').style.width = '115px';
	
	}
}


function checkEmpty(obj,clueregsdiv,clueregsid,temp){
   
   var description=document.getElementById("description").value;
   if(description=='' || description==null){
     alert("鍐呭涓嶈兘涓虹┖");
	 myform.description.focus();
	 return false;
   }
   document.myform.submit();
   return true;
}

function changeCheckedStatu(){
   var ch=document.getElementsByName("cf_1959");
	for(var i=0;i<ch.length;i++){
	    if(ch[i].checked){
	       ch[i].checked=false;
		 }
	}
	ch[0].checked=true;
}
function saveTrackRecords(clueregsid){
     var current_time=document.getElementById("time").value;//联系时间
	 var cf_1959=document.getElementsByName("cf_1959");//意向信息
	 var statu=document.getElementsByName("statu");//意向 补充信息
	 var cf_1980=document.getElementsByName("cf_1980");//联系方式
	 var description=document.getElementById("description").value;//描述
	 var nextdate=document.getElementById("nextdate").value;//下次联系时间
	 var clueregname=document.getElementById("clueregname").value;
	 var str1,str2,sta;
	 for(var i=0;i<cf_1959.length;i++){
	    if(cf_1959.item(i).checked){
		    str1=cf_1959.item(i).getAttribute("value");  
		}
	}
	for(var j=0;j<statu.length;j++){
		if(statu.item(j).checked){
		    sta=statu.item(j).getAttribute("value");
			break;
		}else{continue;}
	 }if(j>=statu.length){sta='';}
	 for(var m=0;m<cf_1980.length;m++){
		if(cf_1980.item(m).checked){
		    str2=cf_1980.item(m).getAttribute("value");
			break;
		}else {continue;}
	 }if(m>=cf_1980.length){str2='';}
	 new Ajax.Request(
	    'index.php',
		{   queue:{position:'end',scope:'command'},
			method:'post',
			postBody:"module=Clueregs&action=ClueregsAjax&file=SaveRecords&ajax=true&start=1&clueregsid="+clueregsid+"&cf_1959="+str1+"&statu="+sta+"&cf_1980="+str2+"&description="+description+"&nextdate="+nextdate+"&clueregname="+clueregname,
			onComplete: function(response) {
				$("status").style.display="none";			
				result= response.responseText.split('&#&#&#');
	
			}
		}
	);
}

function saveModify(){
    var record=document.getElementById("record").value;
	var mode='edit';
	var clueregname=document.getElementById("clueregname").value;//线索名称
	var clueregsid=document.getElementById("clueregsid").value;//线索id
	var keycontact=document.getElementById("keycontact").value;//首要联系人
	var cf_861=document.getElementById("cf_861").value;//
	var serialnum=document.getElementById("serialnum").value;
	var othercontact=document.getElementById("othercontact").value;
	var cf_869=document.getElementById("cf_869").value;
	var keymobile=document.getElementById("keymobile").value;
	var phone=document.getElementById("phone").value;
	var cf_867=document.getElementById("cf_867").value;
	var birthdate=document.getElementById("birthdate").value;
	var email=document.getElementById("email").value;
	var units=document.getElementById("units").value;
	var cf_1969=document.getElementById("cf_1969").value;
	var leadsource=document.getElementById("leadsource").value;
	var nextdate=document.getElementById("nextdate").value;
	var industry=document.getElementById("industry").value;
	var cf_2109=document.getElementById("cf_2109").value;
	
	var cf_1959=document.getElementById("cf_1959").value;
	var address=document.getElementById("address").value;
	var description=document.getElementById("description").value;
	var module=document.getElementById("module").value;
	var action=document.getElementById("action").value;
	var return_id=document.getElementById("return_id").value;
	var return_action=document.getElementById("return_action").value;
	var return_module=document.getElementById("return_module").value;
	var return_viewname=document.getElementById("return_viewname").value;
	var parenttab=document.getElementById("parenttab").value;	
	var url='record='+record+'&mode='+mode+'&clueregname='+clueregname+'&cf_2109='+cf_2109+'&clueregsid='+clueregsid+'&keycontact='+keycontact+'&cf_861='+cf_861+'&serialnum='+serialnum+'&othercontact='+othercontact+'&cf_869='+cf_869+'&keymobile='+keymobile+'&phone='+phone+'&cf_867='+cf_867+'&birthdate='+birthdate+'&email='+email+'&units='+units+'&cf_1969='+cf_1969+'&leadsource='+leadsource+'&nextdate='+nextdate+'&industry='+industry+'&cf_1959='+cf_1959+'&address='+address+'&description='+description+'&return_id='+return_id+'&return_action='+return_action+'&return_module='+return_module+'&return_viewname='+return_viewname+'&parenttab='+parenttab;
	new Ajax.Request(
		'index.php',
			{queue:{position:'end',scope:'command'},
				method:'post',
				postBody:'module=Clueregs&action=ClueregsAjax&file=Save&ajax=true&start=1&'+url,
				onComplete:function(response){
					$("status").style.display="none";
					result= response.responseText.split('&#&#&#');
					
				}
			}
	);
}

function BatchfnDropDown(obj,Lay){
    var tagName = document.getElementById(Lay); 
	if(typeof tagName == 'undefined') {
		return;
	}
    var leftSide = findPosX(obj);
    var topSide = findPosY(obj);
    var maxW = tagName.style.width;
    var widthM = maxW.substring(0,maxW.length-2);
    var getVal = eval(leftSide) + eval(widthM);
    if(getVal  > document.body.clientWidth ){
        leftSide = eval(leftSide) - eval(widthM);
        tagName.style.left = leftSide - 10 + 'px';
    }
    else
        tagName.style.left= leftSide - 10 + 'px';
    tagName.style.top= '20px';
	tagName.style.display = 'block';
 }

function BatchfnHideDrop(obj){
	document.getElementById(obj).style.display = 'none';
}

function BatchfnShowDrop(obj){
	document.getElementById(obj).style.display = 'block';
}

function qunfa_sms(obj,divid,module) {
	var select_options  =  document.getElementsByName('selected_id');
	var x = select_options.length;
	idstring = "";xx = 0;
	for(i = 0; i < x ; i++){
		if(select_options[i].checked){
			idstring = select_options[i].value +";"+idstring
			xx++
		}
	}
	if (xx != 0){
		document.getElementById('idlist').value=idstring;
		location.href='index.php?module=Qunfas&action=ListView&idstring='+idstring+'&modulename='+module;
	}else{
		alert(alert_arr.SELECT);
		return false;
	}
}
function qunfa_mail(obj,divid,module) {
	var select_options  =  document.getElementsByName('selected_id');
	var x = select_options.length;
	idstring = "";xx = 0;
	for(i = 0; i < x ; i++){
		if(select_options[i].checked){
			idstring = select_options[i].value +";"+idstring
			xx++
		}
	}
	if (xx != 0){
		document.getElementById('idlist').value=idstring;
		location.href='index.php?module=Maillists&action=ListView&idstring='+idstring+'&modulename='+module;
	}else{
		alert(alert_arr.SELECT);
		return false;
	}
}

function getFormQueryString()    //frmID是表单的ID号，请在表单form中先命名一个ID号
 {
   //  var frmID=document.getElementById(frmID);
  var frmID = window.document.EditView;
     var i,queryString = "", and = "";
     var item;
     var itemValue;
     for( i=0;i<frmID.length;i++ )
     {
		   item = frmID[i];
           if ( item.name!='' )
           {
                  if ( item.type == 'select-one' )
                  {
						if(item.options.length == 0){
							  continue;    
						}
						itemValue = item.options[item.selectedIndex].value;
                  }
                  else if ( item.type=='checkbox' || item.type=='radio')
                  {
                         if ( item.checked == false )
                         {
                                continue;    
                         }
                         itemValue = item.value;
                  }
                  else if ( item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image')
                  {
                         continue;
                  }
                  else
                  {
                         itemValue = item.value;
                  }
				  if(itemValue == ''){
						continue;
				  }
                  //itemValue = escape(itemValue);
                  queryString += and + item.name + '=' + itemValue;
                  and="&";
           }
     }
     return queryString;
 }

function ajaxCheckCluereg(){
    window.document.EditView.action.value='Save';
	var queryString = getFormQueryString();
    var clueregname = window.document.EditView.clueregname.value;
    if(clueregname==''){
        alert(alert_arr['ACCOUNT_CANNOT_EMPTY']);
        return;
    }
	var record = window.document.EditView.record.value;
    new Ajax.Request(
                'index.php',
                {queue: {position: 'end', scope: 'command'},
                        method: 'post',
                        postBody: queryString+'&file=Save&ajax=true&dup_check=true',
                        onComplete: function(response) {
		                    var result = trim(response.responseText);				
							if(result.indexOf('SUCCESS') > -1) {
								   	alert('没有发现重复!');
							}
							else {
									alert(result);
									//alert(alert_arr['KEYMOBILE_NOTAVAILABLE']);
							}
						}
                }
        );
}

function ajaxCheckClueregName(){
	var clueregname = window.document.EditView.clueregname.value;
    if(clueregname==''){
        alert(alert_arr['ACCOUNT_CANNOT_EMPTY']);
        return;
    }
	var record = window.document.EditView.record.value;
    new Ajax.Request(
                'index.php',
                {queue: {position: 'end', scope: 'command'},
                        method: 'post',
                        postBody: 'module=Clueregs&action=ClueregsAjax&file=Save&ajax=true&dup_check=true&clueregname='+clueregname+'&record='+record,
                        onComplete: function(response) {
		                    var result = trim(response.responseText);
							if(result.indexOf('SUCCESS') > -1) {
								   alert("线索名称可用");
							}
							else {
									alert("线索名称不可用");
							}
						}
                }
        );
}
function ajaxCheckKeymobile(){
	var keymobile = window.document.EditView.keymobile.value;
    if(keymobile==''){
    	alert("手机号码不能为空");
        return;
    }
	var record = window.document.EditView.record.value;
    new Ajax.Request(
                'index.php',
                {queue: {position: 'end', scope: 'command'},
                        method: 'post',
                        postBody: 'module=Clueregs&action=ClueregsAjax&file=Save&ajax=true&dup_check_phone=true&ph=ph&keymobile='+keymobile+'&record='+record,
                        onComplete: function(response) {
		                    var result = trim(response.responseText);			                                				
							if(result.indexOf('SUCCESS') > -1) {
								   alert("手机号码可用");
							}
							else {
									alert("手机号码不可用");
							}
						}
                }
        );

}
function check_duplicate(){
	flag = formValidate();
	if(flag) {
		check_duplicate_ajax();	
	}
}

function getFormQueryString()    //frmID是表单的ID号，请在表单form中先命名一个ID号
 {
   //  var frmID=document.getElementById(frmID);
  var frmID = window.document.EditView;
     var i,queryString = "", and = "";
     var item;
     var itemValue;
     for( i=0;i<frmID.length;i++ )
     {
		   item = frmID[i];
           if ( item.name!='' )
           {
                  if ( item.type == 'select-one' )
                  {
						if(item.options.length == 0){
							  continue;    
						}
						itemValue = item.options[item.selectedIndex].value;
                  }
                  else if ( item.type=='checkbox' || item.type=='radio')
                  {
                         if ( item.checked == false )
                         {
                                continue;    
                         }
                         itemValue = item.value;
                  }
                  else if ( item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image')
                  {
                         continue;
                  }
                  else
                  {
                         itemValue = item.value;
                  }
				  if(itemValue == ''){
						continue;
				  }
                  //itemValue = escape(itemValue);
                  queryString += and + item.name + '=' + itemValue;
                  and="&";
           }
     }
     return queryString;
 }

function check_duplicate_ajax()
{	
	var queryString = getFormQueryString();
	var clueregname = window.document.EditView.clueregname.value;
	var record = window.document.EditView.record.value;
	var keymobile = window.document.EditView.keymobile.value;
	new Ajax.Request(
                'index.php',
                {queue: {position: 'end', scope: 'command'},
                        method: 'post',
						postBody: queryString+'&file=Save&ajax=true&dup_check=true',
                        //postBody: 'module=Clueregs&action=ClueregsAjax&file=Save&ajax=true&dup_check_all=true&keymobile='+keymobile+'&clueregname='+clueregname+'&record='+record,
                        onComplete: function(response) {
		                    var result = trim(response.responseText);
							if(result.indexOf('SUCCESS') > -1) {
								    //disable save button
									var buttonsave = $$('.save');
									var count = buttonsave.length;
									for(var i=0;i<count;i++){
										buttonsave[i].disabled = "disabled";
									}
									document.EditView.submit();
							}
							else {
								alert(result);
							}
						}
                }
        );
}



function ToggleGroupContent(id,imgId){
    
	var flag  = $(id).style.display;
	if (flag != "none"){ 
		$(id).hide(); 
		$(imgId).src="themes/images/expand.gif";  
	}else {
		$(id).show(); 
		$(imgId).src="themes/images/collapse.gif";
	}

}



//写评价
function WriteAccountNotesDiv(clueregsid,banjisid)
{
	new Ajax.Request(
		'index.php',
		{queue: {position: 'end', scope: 'command'},
			method: 'post',
			postBody: 'module=Clueregs&action=ClueregsAjax&file=WriteAccountNotes&clueregsid='+clueregsid,
			onComplete: function(response) {				        
				$("writeaccountnotesdiv").innerHTML=response.responseText;
				//show("writecommentdiv");
				Drag.init(document.getElementById("wirtenotes_div_title"), document.getElementById("writeaccountnotesdiv"));
			}
		}
	);
}



function saveAccountNotes(){ 
  var inputels=$$('.upaccount');
  var searchobj={}
  searchobj['search']='true';    
  for(var i=0;i<inputels.length;i++){
    var inputel=inputels[i];
    searchobj[inputel.name]=$F(inputel);
  }
  
  var clueregsid = searchobj['clueregsid'];
  if(clueregsid == ''){
    alert("招生线索不能为空");
    return false;
  }
  var time = searchobj['time'];
  if(time == ''){
    alert("联系时间");
    return false;
   }
   var findstr="&"+$H(searchobj).toQueryString();
   Jquery("#status").css("display","inline");

    Jquery.ajax({
		url: "index.php",
		data: 'module=Trackrecords&action=TrackrecordsAjax&file=Save'+findstr,
		success:function(rest){
			Jquery("#status").css("display","none");
			result =removeHTMLTag(response.responseText); 
            if(result.indexOf('true')>-1){
              alert("保存成功");
              fninvsh('writeaccountnotesdiv');
              window.location.reload();
            }else{
              alert("保存失败");
            }
			
		}
	});

}


function saveTrackrecordsListInfo(record){
	 var inputels=$$('.upaccount');
	 var searchobj={}
	 searchobj['search']='true';    
	  for(var i=0;i<inputels.length;i++){
	    var inputel=inputels[i];
	    searchobj[inputel.name]=$F(inputel);
	}
	var trackrecord1959 = searchobj['trackrecord1959'];
    if(trackrecord1959 == ''){
	    alert("意向状态不能为空");
	    return ;
	}
	var trackrecord1980 = searchobj['trackrecord1980'];
	if(trackrecord1980 == ''){
	    alert("联系方式不能为空");
	    return ;
	}
	var contact_date = searchobj['contact_date'];
	if(contact_date == ''){
	    alert("联系日期不能为空");
	    return ;
	}
	var findstr="&"+$H(searchobj).toQueryString();
	Jquery.ajax({
		url: "index.php",
		data: "module=Trackrecords&action=TrackrecordsAjax&file=Save&search=true&return_module=Clueregs&return_id="+record+"&clueregsid="+record+findstr,
		success:function(rest){
			//alert("保存成功");
			//setTrackrecordsListInfo(record,1);
			window.location.reload();
		}
	});
}


function setTrackrecordsListInfo(record,current_page){
	Jquery.ajax({
		url: "index.php",
		method: 'post',
		data: "module=Clueregs&action=ClueregsAjax&file=setTrackrecordInfo&record="+record+"&current_page="+current_page,
		success:function(rest){
			Jquery("#comment-list-info").html(rest);
		}
	});
}

function delrelmodule_click(relcrmid,relmodule,crmid){
	if(confirm(alert_arr.SURE_TO_DELETE)){
		var urlstring = "&crmid="+crmid+"";
		urlstring += "&module=Campaigns";
		urlstring += "&relmodule="+relmodule+"";
		urlstring += "&relcrmid="+relcrmid+"";
		Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module=Campaigns&action=CampaignsAjax&file=deletelistRelated"+urlstring,
			success:function(rest){
				Jquery("#status").css("display","none");
				if(rest.indexOf('SUCCESS') > -1) {
					relatedload(relmodule);
				}else{
					alert(rest);
				}
			}
		});
	}
}


function save_checkajax_click(){
	if(!formValidate()){
		return false;
	}
	var urlstring =getFormQueryString('');
	Jquery("#status").css("display","inline");
	Jquery.ajax({
		url: "index.php",
		data: urlstring+"module=Clueregs&action=ClueregsAjax&file=Save&dup_check=true",
		success:function(rest){
			Jquery("#status").css("display","none");
			if(rest.indexOf('SUCCESS') > -1) {
				var buttonsave = $$('.save');
				var count = buttonsave.length;
				for(var i=0;i<count;i++){
					buttonsave[i].disabled = "disabled";
				}
				if(Jquery("[name=EditView]").find("[name=issubmit]").val() == "1"){
					Jquery("[name=EditView]").find("[name=issubmit]").val("2");
					Jquery("[name=EditView]").submit();
				}
			}else{
				alert(rest);
			}
		}
	});
}


//click
function InAccountPool_click(){

	var select_options = document.getElementsByName('selected_id');
	var x = select_options.length;
	idstring = "";
	xx = 0;
	for (i = 0; i < x; i++) {
		if (select_options[i].checked) {
			if(idstring == ''){
				idstring = select_options[i].value;
			}else{
				idstring += ","+select_options[i].value;
			}
			xx++
		}
	}
	if (xx != 0) {	
		new Ajax.Request(
			'index.php',
				{queue: {position: 'end', scope: 'command'},
				method: 'post',
				postBody:"module=Clupools&action=ClupoolsAjax&file=setpoolcluereg&ajax=true&setype=allpoolacc&clueregsid="+idstring+"",
				onComplete: function(response) {
					result = response.responseText;
					alert("已经将招生线索成功放入招生线索池！");
					window.location.href = window.location.href;
				}
			}
		);
	}else {
		alert(alert_arr.SELECT);
		return false;
	}
}