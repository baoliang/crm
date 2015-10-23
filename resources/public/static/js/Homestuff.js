/*********************************************************************************
  ** The contents of this file are subject to the vtiger CRM Public License Version 1.0
   * ("License"); You may not use this file except in compliance with the License
   * The Original Code is:  vtiger CRM Open Source
   * The Initial Developer of the Original Code is vtiger.
   * Portions created by vtiger are Copyright (C) vtiger.
   * All Rights Reserved.
  *
 ********************************************************************************/


function DelStuff(sid)
{
	if(confirm(alert_arr.DELETE))
	{
		new Ajax.Request(
        	'index.php',
               	{queue: {position: 'end', scope: 'command'},
               		method: 'post',
	                       postBody:'module=Home&action=HomeAjax&file=HomestuffAjax&homestuffid='+sid,
			onComplete: function(response) 
			{
				var responseVal=response.responseText;
				if(response.responseText.indexOf('SUCCESS') > -1)
				{
					var delchild = $('stuff_'+sid);
					odeletedChild = $('MainMatrix').removeChild(delchild);
					$('seqSettings').innerHTML= '<table cellpadding="10" cellspacing="0" border="0" width="100%" class="vtResultPop small"><tr><td align="center">Stuff deleted sucessfully.</td></tr></table>';
					LocateObj($('seqSettings'))
					Effect.Appear('seqSettings');
					setTimeout(hideSeqSettings,3000);
				}else
				{
					alert("Error while deleting.Please try again.")
				}
	                }
                       }
         	);
	}
}

function loadStuff(stuffid,stufftype){
	$('refresh_'+stufftype+stuffid).innerHTML=$('vtbusy_homeinfo').innerHTML;
	new Ajax.Request(
		'index.php',
		{queue: {position: 'end', scope: 'command'},
		method: 'post',
		postBody:'module=Home&action=HomeAjax&file=HomeBlock&homestuffid='+stuffid+'&blockstufftype='+stufftype,
			onComplete: function(response) 
			{
				var responseVal=response.responseText;
				
				$('stuffcont_'+stufftype+stuffid).innerHTML=responseVal;	
				responseVal.evalScripts();
				$('refresh_'+stufftype+stuffid).innerHTML='';	
			}
		}
	);
}



function fnRemoveWindow(){
	var tagName = document.getElementById('createConfigBlockDiv').style.display= 'none';
}

function fnShowWindow(){
		var tagName = document.getElementById('createConfigBlockDiv').style.display= 'block';
}
function positionDivToCenter(targetDiv)
{
	//Gets the browser's viewport dimension
	getViewPortDimension();
	//Gets the Target DIV's width & height in pixels using parseInt function
	divWidth =(parseInt(document.getElementById(targetDiv).style.width))/2;
	//divHeight=(parseInt(document.getElementById(targetDiv).style.height))/2;
	//calculate horizontal and vertical locations relative to Viewport's dimensions
	mx = parseInt(XX/2)-parseInt(divWidth);
	//my = parseInt(YY/2)-parseInt(divHeight);
	//Prepare the DIV and show in the center of the screen.
	document.getElementById(targetDiv).style.left=mx+"px";
	document.getElementById(targetDiv).style.top="150px";
}

function getViewPortDimension()
{
if(!document.all)
	{
  	XX = self.innerWidth;
	YY = self.innerHeight;
	}
	else if(document.all)
	{
	XX = document.documentElement.clientWidth;
	YY = document.documentElement.clientHeight;
  
	}
}
function positionDivInAccord(targetDiv,stuffwidth)
{
	if(stuffwidth != "") {
		document.getElementById(targetDiv).style.width= stuffwidth;
	}
	else {
		mainX = parseInt(document.getElementById("MainMatrix").style.width);
		dx = mainX * 31 / 100;
		document.getElementById(targetDiv).style.width=dx + "%";
	}
	
}
function hideSeqSettings()
{
	Effect.Fade('seqSettings');
}
function verify_data(form)
{
	x = form.stuffid.length;
	var y = 0;
	idstring = "";
	if ( x == undefined)
	{

			if (form.stuffid.checked)
			{
				idstring = form.stuffid.value;
				y=1;
			}
			else
			{
					alert(alert_arr.SELECT);
					return false;
			}
	}
	else
	{
			y=0;
			for(i = 0; i < x ; i++)
			{
					if(form.stuffid[i].checked)
					{
							idstring = form.stuffid[i].value + ";" +idstring;
							
							y=y+1;
					}
			}
	}
	if (y != 0)
	{
		form.idlist.value = idstring;
	}
	else
	{
		alert(alert_arr.SELECT);
		return false;
	}
	return true;
}
function back_to_read_only(){
		//Set to read only
		var textArea_id                  = document.getElementById('ajotpad');
	    textArea_id.readOnly              = true;
		textArea_id.style.borderColor     ='000000';
		textArea_id.style.fontSize        ='12px';
		textArea_id.style.fontFamily      ='Verdana';
		textArea_id.style.color           ='000000';
		textArea_id.style.backgroundColor ='FFFFFF';
		//show saving message
		$('vtbusy_homeinfo').style.display='inline';
		new Ajax.Request(
						'index.php',
						{queue: {position: 'end', scope: 'command'},
						method: 'post',
						postBody:'module=Home&action=HomeAjax&file=SaveNotePad&textData='+textArea_id.value,
							onComplete: function(response) 
							{
								var responseVal=response.responseText;
								if('SUCCESS' == responseVal) {
									$('vtbusy_homeinfo').style.display='none';
								}
							}
						}
		);
		//xajax_updateNotes(textArea_id, textArea_id.value);
}

function change_to_text_area(){
	    //set to text area
	    var textArea_id                   = document.getElementById('ajotpad');
	    textArea_id.readOnly              = false;
		textArea_id.style.borderColor     ='000000';
		textArea_id.style.fontSize        ='12px';
		textArea_id.style.fontFamily      ='Arial';
		textArea_id.style.color           ='000000';
		//textArea_id.style.backgroundColor ='ECE9D8';
		textArea_id.focus();
}


/**
*@note:print charts infomation to home stuffs
*@author:ligangze
*@date:2013-11-04
*@params
*@type:charts type with line/column/pie
*@title the chart title
*@categories: xAxis's info
*@rendto: the chart container
*@name:charts's name
*@series: series data
**/
//type,title,rendto,categories,name,series
function printChartInfo(type,title,rendto,categories,series,yaxis){
	//series = JSON.stringify(series);
	//alert(type);
//alert(series);
//alert(type[1]);
	jQuery(function () {
		var chart;
		if(yaxis == void 0)
			yaxis = {allowDecimals: false,title:{text:'金额(元)'},type:'logarithmic'};
//			Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
//				return {
//					radialGradient: {cx: 0.5, cy: 0.3, r: 0.7 },
//					stops: [
//						[0, color],
//						[1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
//					]
//				};
//			});
//datas=jQuery.parseJSON(type);

		if(type[0]=='funnel'){//如果为漏斗
		//alert("漏斗");
//alert(type[0]);
			jQuery(document).ready(function(){
				chart = new Highcharts.Chart({
					chart:{
						renderTo:rendto,//图表内容位置的html id
						type:type[0],
						inverted:false,
						//width:'98%',//宽
						height:240,//高
						backgroundColor:'#F9F9F9',//背景色
						plotShadow:true,//阴影
						spacingRight:100
						
					},
					credits:{//版权
						enabled:0
					},
					title:{
						text:''
						//x:-50
					},
					plotOptions:{
						series:{
							dataLabels:{
								enabled:true,
								format:'<b>{point.name}</b>({point.percentage:.0f}%)',
								color:'black',
								softConnector:true
							},
							neckWidth:'25%',
							neckHeight:'0%',
							width:'60%',
							height:'90%'
						}
					},
					legend:{
						enabled:false
					},
					series:series
				});
			});
		}else if(type[1]=='normal'){
			jQuery(document).ready(function(){
				chart = new Highcharts.Chart({
					chart: {
						renderTo:rendto,
						type: type[0],
						inverted:false,
						height:240,//高
						plotBackgroundColor:'#F9F9F9',//背景色
						plotShadow:true,//阴影
						marginTop:10,
						zoomType:'x'//可以x轴放大
					},
					title: {
						text: ''
					},
					credits:{
						enabled:false,  
					},
					xAxis:   {
					categories: categories
					},
					yAxis: yaxis,
					legend: {
						align: 'right',
						x: -70,
						verticalAlign: 'top',
						y: 20,
						floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
						borderColor: '#CCC',
						borderWidth: 1,
						shadow: false
					},
					tooltip: {
						formatter: function() {
							return '<b>'+ this.x +'</b><br/>'+
								this.series.name +': '+ this.y +'<br/>'+
								'Total: '+ this.point.stackTotal;
						}
					},
					plotOptions: {
						column: {
							stacking: type[1],
							dataLabels: {
								enabled: false,//是否显示每条数据里面个数
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
							}
						}
					},
					series: series
				});
			})
		}else{
			jQuery(document).ready(function() {
				Highcharts.setOptions({
					colors:['#2F7ED8','#50B432','#ED561B','#DDDF00','#24CBE5','#64E572','#FF9655','#FFF263','#6AF9C4'],//自定义颜色
					lang:{
						resetZoom:'还原',
						resetZoomTitle:'还原'
					}
				});
				chart = new Highcharts.Chart({
					chart:{
					renderTo:rendto,//图表内容位置的html id
					inverted:false,
					//width:440,//宽
					height:240,//高
					plotBackgroundColor:'#F9F9F9',//背景色
					plotShadow:true,//阴影
					marginTop:30,
					zoomType:'x'//可以x轴放大
				},
				credits:{//版权
					enabled:0
				},
				title:{
					text:title
				},
				xAxis:{
					categories:categories,
					labels: {
							rotation: 0      //坐标值显示的倾斜度    
					}
				},
				yAxis:yaxis,
				plotOptions:{
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							color: '#000000',
							connectorColor: '#000000',
							format:'<b>{point.name}</b>:{point.percentage:.0f}%'
//							formatter: function() {
//								return '<b>'+ this.point.name +'</b>: '+ '{point.percentage:.1f}%';
//							}
						}
					},
					column:{
						dataLabels:{
							//enabled:true
						}
					}			
							
					
				
				},
				tooltip:{
					crosshairs: true,//鼠标移动上去才显示基准线
					headerFormat: '<span style=\"font-size:10px\">{point.key}</span>',
					pointFormat: '<tr><td style=\"color:{series.color};padding:0\">: </td>' +
					   '<td style=\"padding:0\"><b>{point.y} 个</b></td></tr>',
					shared: true,
					useHTML: true
				},
				series:series
				});
			});
		}
	});
}





//type,title,rendto,categories,name,series
/*function printChartInfo1(type,title,rendto,categories,series,yaxis){
	alert("aa");
	jQuery(function () {
		var chart;
		if(yaxis == void 0)
			yaxis = {allowDecimals: false,title:{text:'金额(元)'},type:'logarithmic'};
//			Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
//				return {
//					radialGradient: {cx: 0.5, cy: 0.3, r: 0.7 },
//					stops: [
//						[0, color],
//						[1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
//					]
//				};
//			});
		if(type[0]=='funnel'){//如果为漏斗
		
			jQuery(document).ready(function(){
				chart = new Highcharts.Chart({
					chart:{
						renderTo:rendto,//图表内容位置的html id
						type:type[0],
						inverted:false,
						//width:'98%',//宽
						height:240,//高
						backgroundColor:'#F9F9F9',//背景色
						plotShadow:false,//阴影
						spacingRight:100
						
					},
					credits:{//版权
						enabled:0
					},
					title:{
						text:title
						//x:-50
					},
					plotOptions:{
						series:{
							dataLabels:{
								enabled:true,
								format:'<b>{point.name}</b>({point.percentage:.0f}%)',
								color:'black',
								softConnector:true
							},
							neckWidth:'25%',
							neckHeight:'0%',
							width:'60%',
							height:'90%'
						}
					},
					legend:{
						enabled:false
					},
					series:[{
							name:categories,
							data:series
						}]
				});
			});
		}else{
			Jquery('#"+rendto+"').highcharts({
				chart: {
							inverted:false,
							//width:400,//宽
							height:240,//高
							plotBackgroundColor:'#F9F9F9',//背景色
							plotShadow:true,//阴影
							marginTop:10,
							zoomType:'x'//可以x轴放大
				},
				title: {
					text: title,
				},
				subtitle: {
					text: '',
				},
				xAxis: {
					categories: categories,
				},
				yAxis:yaxis,
				tooltip: {
				crosshairs: true,//
					headerFormat: '<span style=\"font-size:10px\">{point.key}</span>',
					pointFormat: '<tr><td style=\"color:{series.color};padding:0\">: </td>' +
						'<td style=\"padding:0\"><b>{point.y} 个</b></td></tr>',
					shared: true,
					useHTML: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					},
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							color: '#000000',
							connectorColor: '#000000',
							format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						}
					}

				},
				series: series,
				credits: false,
			});
		}
	});
}
	*/
