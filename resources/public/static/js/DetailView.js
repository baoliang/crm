/**
 * 点击显示相关信息
 */
function showRelatedModList_click(obj,modname,record,relatedid){
	var temp=true;
	if(modname=='Accounts' && relate_kebiaoid!=undefined){
		if(relatedid!=relate_kebiaoid[0] && relatedid!=relate_kebiaoid[1] && relatedid!=relate_kebiaoid[2]){
			var temp=true;
		}else{
			var temp=false;
		}
	}
	Jquery(obj).css("color","#32A636");
	if(Jquery("#seltrelatedid").val() > 0 && Jquery("#seltrelatedid").val() != relatedid){
		var seltrelatedid = Jquery("#seltrelatedid").val();
		Jquery("#detail-list-"+seltrelatedid).css("color","#666");
	}
	Jquery("#seltrelatedid").val(relatedid);
	if(temp){
		var urlstring = "&modname="+modname+"&record="+record+"";
		urlstring += "&relatedid="+relatedid+"&currpage=1";
		//Jquery(".detail-heading").css("color","#666");
		// Jquery(obj).css("color","#32A636");
		// if(Jquery("#seltrelatedid").val() > 0 && Jquery("#seltrelatedid").val() != relatedid){
			// var seltrelatedid = Jquery("#seltrelatedid").val();
			// Jquery("#detail-list-"+seltrelatedid).css("color","#666");
		// }
		// Jquery("#seltrelatedid").val(relatedid);
		RelatedModListBind(urlstring);
	}else{
		showRelatedAccountKeBiaoInfo(modname,record,relatedid,'');
	}		
}

/**
* 加载学员课表相关信息
*/
function showRelatedAccountKeBiaoInfo(modname,record,relatedid,url){
	var urlstring = "&modname="+modname+"&record="+record+"&relatedid="+relatedid+""+url;
	Jquery("#status").css("display","inline");
		Jquery.ajax({
		url: "index.php",
		data: "module=Accounts&action=AccountsAjax&file=setRelatedModListFromKeBiao"+urlstring,
		success:function(rest){//alert(rest);//return;
			Jquery("#status").css("display","none");
			if(rest != ''){
				var relatedobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
				var resthtml = '';
				resthtml += relatedobj.title.value;

				resthtml +='<div class="detail-panel-div" style="background-color:white;">';
				resthtml +='<table border=0 cellspacing=0 cellpadding=0 width=100% align="center" class="small">';
				resthtml +='<tr><td nowrap><br>';
				resthtml +='<tr><td nowrap><br>';
				resthtml += '<table border=0 cellspacing=1 cellpadding=3 width=98% align="center" class="crm-table"  >';
				resthtml += relatedobj.header.value;
				resthtml += relatedobj.entity.value;
				if(relatedobj.paging!=undefined){
					resthtml += relatedobj.paging.value;
				}
				resthtml += '</table>';
				resthtml +='<br>';
				resthtml +='</td>';
				resthtml +='</tr>';
				resthtml +='</table>';
				resthtml +='</div>';
				Jquery("#RelatedListContent").html(resthtml);
				Jquery("#RelatedListContent").css("display","");
				Jquery("#DetailViewContent").css("display","none");
			}
		}
	});
}

/**
 * 加载单据相关信息数据
 */
function RelatedModListBind(urlstring){
	Jquery("#status").css("display","inline");
	Jquery.ajax({
		url: "index.php",
		data: "module=Users&action=UsersAjax&file=setRelatedModList"+urlstring,
		success:function(rest){//alert(rest);//return;
			Jquery("#status").css("display","none");
			if(rest != ''){
				var relatedobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
				var resthtml = '';
				resthtml += relatedobj.title.value;
				if(relatedobj.view.value && relatedobj.view.value != ''){
					resthtml += relatedobj.view.value;
				}
				resthtml += '<table class="crm-table" width="100%" border="0" cellpadding="3" cellspacing="1">';
				resthtml += relatedobj.header.value;
				resthtml += relatedobj.entity.value;
				resthtml += relatedobj.paging.value;
				resthtml += '</table>';
				if(relatedobj.rows.value && relatedobj.rows.value > 0){
					resthtml += relatedobj.together.value;
				}
				Jquery("#RelatedListContent").html(resthtml);
				Jquery("#RelatedListContent").css("display","");
				Jquery("#DetailViewContent").css("display","none");
			}
		}
	});
}
function resetRelatedMod_click(){
	Jquery("#DetailViewContent").css("display","");
	Jquery("#RelatedListContent").css("display","none");
}
function getRelatedTabView(url_string, url, theelement, viewname) {
	Jquery("#relatedviewname").val(viewname);
	var classmethods = $$('.tablink');
	for (var i = 0; i < classmethods.length; i++) {
		classmethods[i].removeClassName('cus_markbai');
		classmethods[i].addClassName('cus_markhui');
	}
	$(theelement).addClassName('cus_markbai');
	$(theelement).removeClassName('cus_markhui');
	url_string += "&"+url;
	url_string += "&currpage=1";
	RelatedModListBind(url_string);
}
function getRelatedEntries_js(urlstring,currpage){
	urlstring += "&currpage="+currpage;
	RelatedModListBind(urlstring);
}
function getRelatedListBy(urlstring,orderby){
	urlstring += "&"+orderby;
	RelatedModListBind(urlstring);
}

function deleteModuleComments(record){
	if(confirm(alert_arr.SURE_TO_DELETE)){
		if(record > 0){
			Jquery.ajax({
				url: "index.php",
				data: "module=Modulecomments&action=deleteModulecomments&record="+record,
				success:function(rest){
					if(window.relatedload != undefined) {
						window.relatedload("ModuleComments");
					}else{
						window.location.onload();
					}
				}
			});
		}
	}
}
function deleteAttachments(record){
	if(confirm(alert_arr.SURE_TO_DELETE)){
		if(record > 0){
			Jquery.ajax({
				url: "index.php",
				data: "module=uploads&action=delrelatedachments&record="+record,
				success:function(rest){
					if(window.relatedload != undefined) {
						window.relatedload("Attachments");
					}else{
						window.location.reload();
					}
				}
			});
		}
	}
}
/*	摘要	 */
function detail_summary_click(obj,modname,record){
	var urlstring = "&modname="+modname+"&record="+record+"";
	if(Jquery("#seltrelatedid").val() > 0){
		var seltrelatedid = Jquery("#seltrelatedid").val();
		Jquery("#detail-list-"+seltrelatedid).css("color","#666");
	}
	//Jquery(obj).css("color","#000");
	detail_summary_bind(urlstring);
}

/**
 * 加载单据相关信息数据
 */
function detail_summary_bind(urlstring){
	Jquery("#status").css("display","inline");
	Jquery.ajax({
		url: "index.php",
		data: "module=Users&action=UsersAjax&file=setRelatedSummaryList"+urlstring,
		success:function(rest){//alert(rest);return;
			Jquery("#status").css("display","none");
			if(rest != ''){
				var restobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
				var resthtml = '';var labelname = '';var relatedobj = '';
				var rows = '';var labelval = '';
				var titlehtml = '<table class="small related-title-tab" border="0" cellpadding="5" cellspacing="5"><tr>';
				var entityname = Jquery(".detail-name-div").html();
				titlehtml += '<td align=center class="detail-logo-td" onclick="detail_related_onchange(\'all\')"><img src="themes/softed/images/mansions_teacher.jpg" border="0" width="100px"></td><td>&nbsp;</td><td><table><tr>';
				var optshtml = '<table class="small" border="0" cellpadding="5" cellspacing="5"><tr><td>';
				var opts = '<select id="detail-related-opts" onchange="detail_related_onchange(this.value)"><option value="all">全部</option>';
				var fori = 0;var forrow = 1;var titlelistcss = '';
				relatedLists = restobj.list.value;
				Jquery.each(relatedLists,function(rel_i,entityarr){
					var rel_tab_id = entityarr.rel_tab_id.value;
					entityobj = entityarr[rel_tab_id];
					labelname = entityobj.labelname.value;
					labelval = entityobj.label.value;
					relatedobj = entityobj.entity.value;
					rows = relatedobj.rows.value;
					if(!rows) rows = 0;
					colrow = 4;
					fori ++;
					titlelistcss = '';
					if(forrow > 2){
						titlelistcss = 'titlelist_disp';
					}
					
					titlelist = '<a href="" onclick="detail_related_onchange(\''+rel_tab_id+'\');return false;">'+labelname+' (<span>'+rows+'</span>)</a>&nbsp;&nbsp;';
					titlehtml += '<td width="150px" height="20px" class="'+titlelistcss+'">'+titlelist+'</td>';
					if(fori%colrow == 0){
						titlehtml += '</tr><tr>';
						forrow++;
					}
					opts += '<option value="'+rel_tab_id+'">'+labelname+'</option>';
					
					resthtml += '<div id="related-div-'+rel_tab_id+'" class="detail-panel-div detail-related-div '+titlelistcss+'">';
					resthtml += relatedobj.title.value;
					resthtml += '<table class="crm-table" width="100%" border="0"  '+
								'cellpadding="3" cellspacing="1" id="related-tab-'+labelval+'">';
					resthtml += relatedobj.header.value;
					resthtml += relatedobj.entity.value;
					resthtml += relatedobj.paging.value;
					resthtml += '</table>';
					resthtml += '</div>';
				});
				opts += '</select>';
				optshtml += '请选择摘要项： '+opts+'</td></tr></table>';
				titlehtml += '</tr>';
				if(forrow > 2 && fori > 8){
					var alldisp_link = '<a href="" onclick="alldisp_link_click(this);return false;">'+
										'显示全部摘要 >></a><input type=hidden id="alldisp_link_hid" value="black">';
					titlehtml += '<tr><td colspan="'+colrow+'">'+alldisp_link+'</td></tr>';
				}
				titlehtml += '</table></td></tr></table>';
				resthtml = titlehtml+optshtml+resthtml;
				Jquery("#RelatedListContent").html(resthtml);
				Jquery("#RelatedListContent").css("display","");
				Jquery("#DetailViewContent").css("display","none");
			}
		}
	});
}
function RelatedSummaryBind(urlstring){
	var urlObj = urlstring.split("&relatedid=");
	if(urlObj[1].indexOf("&") > -1){
		urlject = urlObj[1].split("&");
		var relatedid = urlject[0];
	}else{
		var relatedid = urlObj[1];
	}
	if(relatedid > 0){
		Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module=Users&action=UsersAjax&file=setRelatedSummaryList&status=summary"+urlstring,
			success:function(rest){
				Jquery("#status").css("display","none");
				if(rest != ''){
					var relatedobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
					var resthtml = '';
					resthtml += relatedobj.title.value;
					labelval = relatedobj.label.value;
//					if(relatedobj.view.value && relatedobj.view.value != ''){
//						resthtml += relatedobj.view.value;
//					}
					resthtml += '<table class="crm-table" width="100%" border="0" '+
								'cellpadding="3" cellspacing="1" id="related-tab-'+labelval+'">';
					resthtml += relatedobj.header.value;
					resthtml += relatedobj.entity.value;
					resthtml += relatedobj.paging.value;
					resthtml += '</table>';
					Jquery("#related-div-"+relatedid+"").html(resthtml);
				}
			}
		});
	}
}
function getRelatedSummary_js(urlstring,currpage){
	urlstring += "&currpage="+currpage;
	RelatedSummaryBind(urlstring);
}
function getRelatedSummaryBy(urlstring,orderby){
	urlstring += "&"+orderby;
	RelatedSummaryBind(urlstring);
}
function detail_related_onchange(objval){
	if(objval == 'all'){
		Jquery(".detail-related-div").each(function(i,related){
			Jquery(related).css("display","");
		});
	}else{
		Jquery(".detail-related-div").each(function(i,related){
			Jquery(related).css("display","none");
		});
		Jquery("#related-div-"+objval).css("display","");
	}	
}
function createNotesListMod_click(module,record,related_modname){
	ShowLockDiv("create-relatedinfo-div");
	setRelated_MultipleChoiceField(related_modname);
	var urlstring = "&record="+record+"&related_modname="+related_modname+"&return_module="+module+"";
	Jquery("#status").css("display","inline");
	Jquery.ajax({
		url: "index.php",
		data: "module=Users&action=UsersAjax&file=setcreateNotesListMod"+urlstring,
		success:function(rest){//alert(rest);return;
			Jquery("#status").css("display","none");
			if(rest != ''){
				Jquery("#create-related-info-disp").html(rest);
			}
		}
	});
}


function createListMod_click(module,record,related_modname,related_tabid,prodmod_b){
	if(prodmod_b == 1){//弹出层
		var urlstring = "&related_modname="+related_modname+"&return_module="+module+"";
		var entityname = Jquery(".detail-name-div").html();
		urlstring += "&record="+record+"&entityname="+entityname+"";
		Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module=Users&action=UsersAjax&file=setcreateListMod"+urlstring,
			success:function(rest){//alert(rest);return;
				Jquery("#status").css("display","none");
				if(rest != ''){
					rest.evalScripts();
					document.getElementById("create-related-info-disp").innerHTML = rest;
					if(related_modname == "Products"){
						if(Jquery("#productcode") && Jquery("#productcode").val() == ""){
							Jquery("#productcode").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Shitings"){
						if(Jquery("#shitingname") && Jquery("#shitingname").val() == ""){
							Jquery("#shitingname").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Accounts"){
						if(Jquery("#customernum") && Jquery("#customernum").val() == ""){
							Jquery("#customernum").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Teachers"){
						if(Jquery("#cf_812") && Jquery("#cf_812").val() == ""){
							Jquery("#cf_812").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Banjis"){
						if(Jquery("#cf_852") && Jquery("#cf_852").val() == ""){
							Jquery("#cf_852").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Courses"){
						if(Jquery("#course1386") && Jquery("#course1386").val() == ""){
							Jquery("#course1386").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Programs" || related_modname == "Mouldes" || related_modname == "Sessions"){
						if(Jquery("#subject") && Jquery("#subject").val() == ""){
							Jquery("#subject").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Finchargess"){
						if(Jquery("#finchargesname") && Jquery("#finchargesname").val() == ""){
							Jquery("#finchargesname").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Finchargerecords"){
						if(Jquery("#finchargerecordname") && Jquery("#finchargerecordname").val() == ""){
							Jquery("#finchargerecordname").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Syllabus"){
						if(Jquery("#syllabuname") && Jquery("#syllabuname").val() == ""){
							Jquery("#syllabuname").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Salarylists"){
						if(Jquery("#salarylistname") && Jquery("#salarylistname").val() == ""){
							Jquery("#salarylistname").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Companys"){
						if(Jquery("#company3573") && Jquery("#company3573").val() == ""){
							Jquery("#company3573").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Suppliers"){
						if(Jquery("#supplier3675") && Jquery("#supplier3675").val() == ""){
							Jquery("#supplier3675").val(Jquery("#module_auto_gen_code").val());
						}
					}else if(related_modname == "Qingjias"){
						if(Jquery("#qingjianame") && Jquery("#qingjianame").val() == ""){
							Jquery("#qingjianame").val(Jquery("#module_auto_gen_code").val());
						}
					}
					
					
					var event = event || window.event;
					var x = 0;var y = 0;
					if(event){
						x = (event.x || event.pageX);
						y = (event.y || event.pageY);
					}
					//var obj = Jquery("#refresh-"+related_modname);
					if(document.getElementById("refresh-"+related_modname+"")){
						var obj = document.getElementById("refresh-"+related_modname+"");
						var topSide = findPosY(obj);
						var leftSide = findPosX(obj);
						var tagName = document.getElementById("create-relatedinfo-div");
						if(topSide > 200){
							tagName.style.top = topSide - 250 + 'px';
						}else{
							tagName.style.top = topSide - 50 + 'px';
						}
						tagName.style.left = leftSide - 980 + 'px';
					}

					ShowLockDiv("create-relatedinfo-div");
					setRelated_MultipleChoiceField(related_modname);
				}
			}
		});
	}else if(related_modname && related_modname != ''){
		var urlstring = 'index.php?module='+related_modname+'&action=EditView';
		urlstring += '&return_module='+module+'';
		urlstring += '&return_action=DetailView';
		urlstring += '&return_id='+record+'';
		if(module == 'Accounts'){
			urlstring += '&account_id='+record+'';
		}else if(module == 'Contacts'){
			var accountid = Jquery("[name=DetailView]").find("[name=account_id]").val();
			urlstring += '&account_id='+accountid+'';
		}else if(module == 'Quotes' && related_modname == 'SalesOrder'){
			urlstring += '&convertmode=quotetoso&record='+record+'';
		}else if(module == 'Vendors' && related_modname == 'PurchaseOrder'){
			urlstring += '&vendor_id='+record+'';
		}else if(module == 'SalesOrder'){
			if(related_modname == 'Invoice'){
				urlstring += '&convertmode=sotoinvoice&record='+record+'';
			}else if(related_modname == 'PurchaseOrder'){
				urlstring += '&convertmode=sotopurchaseorder&record='+record+'';
			}
		}
		Jquery("#relatedCreateList").attr("href",urlstring);
		Jquery("#relatedCreatespan").click();
	}
}



function related_tab_click(obj,labelval){
	var imgobj = Jquery(obj).find("img:first");
	if(Jquery(imgobj).attr("src") == 'themes/softed/images/arrow-list-down.gif'){
		Jquery(imgobj).attr("src",'themes/softed/images/arrow-list-up.gif');
		Jquery("#related-tab-"+labelval).css("display","none");
	}else{
		Jquery(imgobj).attr("src",'themes/softed/images/arrow-list-down.gif');
		Jquery("#related-tab-"+labelval).css("display","");
	}
}

function alldisp_link_click(obj){
	var alldisp_link_hid = Jquery("#alldisp_link_hid").val();
	if(alldisp_link_hid == 'black'){
		Jquery(".titlelist_disp").each(function(index,element){
			Jquery(element).removeClass("titlelist_disp");
			Jquery(element).addClass("titlelist_black");
			Jquery("#alldisp_link_hid").val("disp");
			Jquery(obj).html("隐藏部分摘要 <<");
		});
	}else{
		Jquery(".titlelist_black").each(function(index,element){
			Jquery(element).removeClass("titlelist_black");
			Jquery(element).addClass("titlelist_disp");
			Jquery("#alldisp_link_hid").val("black");
			Jquery(obj).html("显示全部摘要 >>");
		});
	}
}

/**
** 控制面板 > 角色权限  模块分组设置角色权限
*
*/
function select_profile_group(record,theelement){

	$("status").style.display="block";

	var classmethods=$$('.tablink');
	for(var i=0;i<classmethods.length;i++){
	   classmethods[i].removeClassName('cus_markbai');
       classmethods[i].addClassName('cus_markhui');
	}
	$(theelement).addClassName('cus_markbai');
    $(theelement).removeClassName('cus_markhui');
    var roleid=$("roleid").value;
    var mode=$("mode").value;
    $("parentMenuId").value=record;
    new Ajax.Request(
        	'index.php',
                {queue: {position: 'end', scope: 'command'},
                	method: 'post',
                        postBody:"module=Users&action=UsersAjax&file=profilePrivileges&ajax=true&parentMenuId="+record+"&roleid="+roleid+"&mode="+mode,
			onComplete: function(response) {
                        	$("status").style.display="none";
                                result = response.responseText.split('&#&#&#');
                                $("ListViewContents").innerHTML= result[2];
                                if(result[1] != '')
                                        alert(result[1]);
                                result[2].evalScripts();
                  	}
                }
    );
}
function detail_info_click(obj,labelval){
	var imgobj = Jquery(obj).find("img:first");
	if(Jquery(imgobj).attr("src") == 'themes/softed/images/arrow-list-down.gif'){
		Jquery(imgobj).attr("src",'themes/softed/images/arrow-list-up.gif');
		Jquery("#detail_info_"+labelval).css("display","none");
	}else{
		Jquery(imgobj).attr("src",'themes/softed/images/arrow-list-down.gif');
		//Jquery("#detail_info_"+labelval).css("display","");
		Jquery("#detail_info_"+labelval).css("display","");
	}
}
/**
 * 相关点评
 */
function setCommentListInfo(urlstring){
	Jquery("#status").css("display","inline");
	Jquery.ajax({
		url: "index.php",
		data: "module=Modulecomments&action=ModulecommentsAjax&file=setCommentListInfo"+urlstring,
		success:function(rest){//alert(rest);return;
			Jquery("#status").css("display","none");
			if(rest != ''){
				var relatedobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
				var resthtml = '';
				resthtml += '<table class="small mod-comments-list" width="100%" '+
								'border="0" cellpadding="0" cellspacing="0">';
				resthtml += relatedobj.entity.value;
				resthtml += relatedobj.paging.value;
				resthtml += '</table>';
				Jquery("#comment-list-info").html(resthtml);
			}
		}
	});
}
function saveCommentListInfo(record){
	var comment = Jquery("#comment-list-text").val();
	if(trim(comment) == ''){
		alert("请输入评论内容。");
		Jquery("#comment-list-text").focus();
		return false;
	}else if(!checktitle(comment)){
		alert("请不要输入特殊字符。");
		Jquery("#comment-list-text").focus();
		return false;
	}
	comment = comment.replace(/\n/g,'<br />'); 
	comment=encodeURI(comment);
	var urlstring = "&record="+record+"&comment="+comment+"&setype=create";
	Jquery("#status").css("display","inline");
	Jquery.ajax({
		url: "index.php",
		data: "module=Modulecomments&action=ModulecommentsAjax&file=setCommentListInfo"+urlstring,
		contentType: "application/x-www-form-urlencoded; charset=utf-8", 
		success:function(rest){//alert(rest);return;
			Jquery("#status").css("display","none");
			if(rest != ''){
				var relatedobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
				var resthtml = '';
				resthtml += '<table class="small mod-comments-list" width="100%" '+
								'border="0" cellpadding="0" cellspacing="0">';
				resthtml += relatedobj.entity.value;
				resthtml += relatedobj.paging.value;
				resthtml += '</table>';
				Jquery("#comment-list-text").val('');
				Jquery("#comment-list-info").html(resthtml);
			}
		}
	});
}
function getModCommentsList_js(urlstring,currpage){
	urlstring += "&currpage="+currpage;
	setCommentListInfo(urlstring);
}
/*	贴标签	*/
function tagvalidate(){
	if(Jquery("#txtbox_tagfields").val() != ''){
		var crmId = 0
		if(document.DetailView.record && document.DetailView.record.value > 0){
			crmId = document.DetailView.record.value;
		}
		var module = '';
		if(document.DetailView.module && document.DetailView.module.value != ''){
			module = document.DetailView.module.value;
		}
		if(crmId > 0 && module != ''){
			SaveTagD('txtbox_tagfields',crmId,module);
		}
	}else{
		alert(alert_arr.INPUT_TAG);
		return false;
	}
}
/**
 * 保存标签
 */
function SaveTagD(txtBox,crmId,module){
	var tagValue = Jquery("#"+txtBox).val();
	Jquery("#"+txtBox).val('');
	Jquery("#vtbusy_info").css("display","inline");
	var urlstring = "module=" + module + "&action=" + module + "Ajax&file=TagCloud";
	urlstring += "&recordid=" + crmId + "&ajxaction=SAVETAG&tagfields=" +tagValue;
	Jquery.ajax({
		url: "index.php",
		data: urlstring,
		success:function(rest){//alert(rest);return;
			Jquery("#vtbusy_info").css("display","none");
			if(rest != ''){
				Jquery("#tagfields").html(rest);
			}
		}
	});
}
function DeleteTag(id){
	Jquery("#vtbusy_info").css("display","inline");
	var module = '';
	if(document.DetailView.module && document.DetailView.module.value != ''){
		module = document.DetailView.module.value;
	}
	if(module != ''){
		var urlstring = "module=" + module + "&action=" + module + "Ajax&file=TagCloud";
		urlstring += "&ajxaction=DELETETAG&tagid=" +id;
		Jquery.ajax({
			url: "index.php",
			data: urlstring,
			success:function(rest){
				getTagCloud();
				Jquery("#vtbusy_info").css("display","none");
			}
		});
	}
}
function getTagCloud(){
	var crmId = 0
	if(document.DetailView.record && document.DetailView.record.value > 0){
		crmId = document.DetailView.record.value;
	}
	var module = '';
	if(document.DetailView.module && document.DetailView.module.value != ''){
		module = document.DetailView.module.value;
	}
	if(crmId > 0 && module != ''){
		var urlstring = "module=" + module + "&action=" + module + "Ajax&file=TagCloud";
		urlstring += "&ajxaction=GETTAGCLOUD&recordid=" +crmId;
		Jquery.ajax({
			url: "index.php",
			data: urlstring,
			success:function(rest){
				if(rest){
					Jquery("#tagfields").html(rest);
					Jquery("#txtbox_tagfields").val();
				}
			}
		});
	}
}

function SaveRelatedList_click(){
	if(!RelatedListformValidate()){
		return false;
	}
	var urlstring = '';var objname='';var objval='';var related_modname = '';
	Jquery("[name=EditView]").find("input,select,textarea").each(function(keys,obj){
		if(Jquery(obj).attr("name")){
			objname = Jquery(obj).attr("name");
		}else{
			return true;
		}
		objval = Jquery(obj).val();
		if(objname == "action"){
			return true;
		}else if(objname == "module"){
			objname = 'related_modname';
			related_modname = objval;
		}
		objval=encodeURI(objval);
		urlstring += "&"+objname+"="+objval+"";
	});
	if(urlstring != ''){
		Jquery.ajax({
			url: "index.php",
			data: "module=Users&action=UsersAjax&file=SaveCreateRelatedInfo"+urlstring,
			success:function(rest){
				if(rest != ""){
					relatedload(related_modname);
					CloseLockDiv('create-relatedinfo-div');
				}
			}
		});
	}
}

function RelatedListformValidate() {
	var relatedfieldname = Jquery("#create-related-fieldname").val();
	var fieldname =  relatedfieldname.split("','");
	fieldname[0] = fieldname[0].substring(1,fieldname[0].length);
	var fieldlen = fieldname.length;
	fieldname[fieldlen-1] = fieldname[fieldlen-1].substring(fieldname[fieldlen-1].length-1,fieldname[fieldlen-1].length);

	var relatedfieldlabel = Jquery("#create-related-fieldlabel").val();
	var fieldlabel =  relatedfieldlabel.split("','");
	fieldlabel[0] = fieldlabel[0].substring(1,fieldlabel[0].length);
	var fieldlen = fieldlabel.length;
	fieldlabel[fieldlen-1] = fieldlabel[fieldlen-1].substring(fieldlabel[fieldlen-1].length-1,fieldlabel[fieldlen-1].length);

	var relatedfielddatatype = Jquery("#create-related-fielddatatype").val();
	var fielddatatype =  relatedfielddatatype.split("','");
	fielddatatype[0] = fielddatatype[0].substring(1,fielddatatype[0].length);
	var fieldlen = fielddatatype.length;
	fielddatatype[fieldlen-1] = fielddatatype[fieldlen-1].substring(fielddatatype[fieldlen-1].length-1,fielddatatype[fieldlen-1].length);
	for (var i=0; i<fieldname.length; i++) {
		if(getObj(fieldname[i]) != null)
		{
			var type=fielddatatype[i].split("~");
				if (type[1]=="M") {
					if (!emptyCheck(fieldname[i],fieldlabel[i],getObj(fieldname[i]).type))
				    { 
						//getObj(fieldname[i]).focus();
						return false;
					}
				}
			//added by xiaoyang on 2013-4-25
			if(fieldname[i] != "title"){
				if(getObj(fieldname[i]).type == 'file'){
					
				}else{
					getObj(fieldname[i]).value = removeHTMLTag(getObj(fieldname[i]).value);
				}
			}else{
				document.getElementById(fieldname[i]).value = removeHTMLTag(document.getElementById(fieldname[i]).value);
			}
			switch (type[0]) {
				case "O"  :break;
				case "V"  :break;
				case "C"  :break;
				case "DT" :
					if (getObj(fieldname[i]) != null && getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0)
					{	 
						if (type[1]=="M")
							if (!emptyCheck(type[2],fieldlabel[i],getObj(type[2]).type)) {
							    //getObj(fieldname[i]).focus();
								return false;
						    }

									if(typeof(type[3])=="undefined") var currdatechk="OTH"
									else var currdatechk=type[3]

										if (!dateTimeValidate(fieldname[i],type[2],fieldlabel[i],currdatechk)) {
											//getObj(fieldname[i]).focus();
											return false;
										}
												if (type[4]) {
													if (!dateTimeComparison(fieldname[i],type[2],fieldlabel[i],type[5],type[6],type[4])) {
														//getObj(fieldname[i]).focus();
														return false;
													}

												}
					}		
				break;
				case "D"  :
					if (getObj(fieldname[i]) != null && getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0)
					{	
						if(typeof(type[2])=="undefined") var currdatechk="OTH"
						else var currdatechk=type[2]

							if (!dateValidate(fieldname[i],fieldlabel[i],currdatechk)) {
								//getObj(fieldname[i]).focus();
								return false;
							}
									if (type[3]) {
										if (!dateComparison(fieldname[i],fieldlabel[i],type[4],type[5],type[3])) {
											//getObj(fieldname[i]).focus();
											return false;
										}
									}
					}	
				break;
				case "T"  :
					if (getObj(fieldname[i]) != null && getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0)
					{	 
						if(typeof(type[2])=="undefined") var currtimechk="OTH"
						else var currtimechk=type[2]

							if (!timeValidate(fieldname[i],fieldlabel[i],currtimechk)) {
								//getObj(fieldname[i]).focus();
								return false;
							}
									if (type[3]) {
										if (!timeComparison(fieldname[i],fieldlabel[i],type[4],type[5],type[3])) {
											//getObj(fieldname[i]).focus();
											return false;
										}
									}
					}
				break;
				case "I"  :
					if (getObj(fieldname[i]) != null && getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0)
					{	
						if (getObj(fieldname[i]).value.length!=0)
						{
							if (!intValidate(fieldname[i],fieldlabel[i])) {
								//getObj(fieldname[i]).focus();
								return false;
							}
									if (type[2]) {
										if (!numConstComp(fieldname[i],fieldlabel[i],type[2],type[3])) {
											//getObj(fieldname[i]).focus();
											return false;
										}
									}
						}
					}
				break;
				case "N"  :
					case "NN" :
					if (getObj(fieldname[i]) != null && getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0)
					{
						if (getObj(fieldname[i]).value.length!=0)
						{
							if (typeof(type[2])=="undefined") var numformat="any"
							else var numformat=type[2]

								if (type[0]=="NN") {

									if (!numValidate(fieldname[i],fieldlabel[i],numformat,true)) {
										//getObj(fieldname[i]).focus();
										return false;
									}
								} else {
									if (!numValidate(fieldname[i],fieldlabel[i],numformat)){
										//getObj(fieldname[i]).focus();
										return false;
									}
								}
							if (type[3]) {
								if (!numConstComp(fieldname[i],fieldlabel[i],type[3],type[4])){
										//getObj(fieldname[i]).focus();
										return false;
								}
							}
						}
					}
				break;
				case "E"  :
					if (getObj(fieldname[i]) != null && getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0)
					{
						if (getObj(fieldname[i]).value.length!=0)
						{
							var etype = "EMAIL"
								if (!patternValidate(fieldname[i],fieldlabel[i],etype)) {
										//getObj(fieldname[i]).focus();
										return false;
								}
						}
					}
				break;
			}
		}
	}
	return true
}

function save_check_click(){
	if(!formValidate()){
		return false;
	}
	if(window.check_data_submit != undefined) {
		window.check_data_submit();
		return false;
	}else{
		if(Jquery("[name=EditView]").find("[name=issubmit]").val() == "1"){
			Jquery("[name=EditView]").find("[name=issubmit]").val("2");
			Jquery("[name=EditView]").submit();
		}
	}
}

function save_listModcheck_click(){
	if(!RelatedListformValidate()){
		return false;
	}
	if(Jquery("[name=EditView]").find("[name=issubmit]").val() == "1"){
		Jquery("[name=EditView]").find("[name=issubmit]").val("2");
		Jquery("[name=EditView]").submit();
	}
	
}




////相关信息编辑
function editListMod_click(module,record,related_modname,related_tabid,entity_id,prodmod_b){
	if(prodmod_b == 1){//弹出层
		var urlstring = "&related_modname="+related_modname+"&return_module="+module+"";
		var entityname = Jquery(".detail-name-div").html();
		urlstring += "&record="+record+"&entityname="+entityname+"";
		urlstring += "&entity_id="+entity_id+"";
		Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module=Users&action=UsersAjax&file=setcreateListMod"+urlstring,
			success:function(rest){//alert(rest);return;
				Jquery("#status").css("display","none");
				if(rest != ''){
					rest.evalScripts();
					document.getElementById("create-related-info-disp").innerHTML = rest;
					
					var event = event || window.event;
					var x = 0;var y = 0;
					if(event){
						x = (event.x || event.pageX);
						y = (event.y || event.pageY);
					}
					//var obj = Jquery("#refresh-"+related_modname);
					if(document.getElementById("refresh-"+related_modname+"")){
						var obj = document.getElementById("refresh-"+related_modname+"");
						var topSide = findPosY(obj);
						var leftSide = findPosX(obj);
						var tagName = document.getElementById("create-relatedinfo-div");
						if(topSide > 200){
							tagName.style.top = topSide - 250 + 'px';
						}else{
							tagName.style.top = topSide - 50 + 'px';
						}
						tagName.style.left = leftSide - 980 + 'px';
					}
					ShowLockDiv("create-relatedinfo-div");
					setRelated_MultipleChoiceField(related_modname);
				}
			}
		});
	}else if(related_modname && related_modname != ''){
		var urlstring = 'index.php?module='+related_modname+'&action=EditView';
		urlstring += '&return_module='+module+'';
		urlstring += '&return_action=DetailView';
		urlstring += '&return_id='+record+'';
		urlstring += "&record="+entity_id+"";
		if(module == 'Accounts'){
			urlstring += '&account_id='+record+'';
		}else if(module == 'Contacts'){
			var accountid = Jquery("[name=DetailView]").find("[name=account_id]").val();
			urlstring += '&account_id='+accountid+'';
		}else if(module == 'SalesOrder'){
			if(related_modname == 'Invoice'){
				urlstring += '&convertmode=sotoinvoice&record='+record+'';
			}else if(related_modname == 'PurchaseOrder'){
				urlstring += '&convertmode=sotopurchaseorder&record='+record+'';
			}
		}
		Jquery("#relatedCreateList").attr("href",urlstring);
		Jquery("#relatedCreatespan").click();
	}
}
function delListMod_click(module,record,related_modname,related_tabid,entity_id,prodmod_b){
	if(confirm(alert_arr.SURE_TO_DELETE)){
		var urlstring = "&related_modname="+related_modname+"&return_module="+module+"";
		var entityname = Jquery(".detail-name-div").html();
		urlstring += "&record="+record+"&entityname="+entityname+"";
		urlstring += "&entity_id="+entity_id+"";
		Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module=Users&action=UsersAjax&file=setDeleteListMod"+urlstring,
			success:function(rest){//alert(rest);return;
				Jquery("#status").css("display","none");
				if(rest.indexOf('SUCCESS') > -1) {
					relatedload(related_modname);
				}else{
					alert(rest);
				}
			}
		});
	}
}


function createSpecailListMod_click(module,fieldname,record,relmodule){
	var urlstring = "&"+fieldname+"="+record+"&return_id="+record+"&return_module="+module+"&return_action=DetailView";
	Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module="+relmodule+"&action="+relmodule+"Ajax&file=callCreateEditView"+urlstring,
			success:function(rest){//alert(rest);return;
				Jquery("#status").css("display","none");
				if(rest != ''){
					rest.evalScripts();
					document.getElementById("create-related-info-disp").innerHTML = rest;
					
					ShowLockDiv("create-relatedinfo-div");
					setRelated_MultipleChoiceField(relmodule);
				}
			}
	});
}

function callSpecalEditListMod_click(module,record,relmodule,entity_id){
	var urlstring ="&record="+entity_id+"&return_id="+record+"&&return_module="+module+"&return_action=DetailView";
	Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module="+relmodule+"&action="+relmodule+"Ajax&file=callCreateEditView"+urlstring,
			success:function(rest){//alert(rest);return;
				Jquery("#status").css("display","none");
				if(rest != ''){
					rest.evalScripts();
					document.getElementById("create-related-info-disp").innerHTML = rest;
					
					ShowLockDiv("create-relatedinfo-div");
					setRelated_MultipleChoiceField(relmodule);
				}
			}
	});

}

function setRelatedListCount(){
	var module = Jquery("[name=DetailView]").find("[name=module]").val();
	var record = Jquery("[name=DetailView]").find("[name=record]").val();
	if(module != "" && record > 0){
		var urlstring = "&modulename="+module+"&record="+record+"";
		Jquery("#status").css("display","inline");
		Jquery.ajax({
			url: "index.php",
			data: "module=Users&action=UsersAjax&file=setRelatedListCount"+urlstring,
			success:function(rest){
				Jquery("#status").css("display","none");
				if(rest != ''){
					var listcount = '';
					var restobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
					Jquery.each(restobj,function(relatedid,entitycount){
						if(Jquery("#detail-list-num-"+relatedid).length > -1 && entitycount > 0){//color:#FF9900;
							listcount = '<div class="detail-list-count">'+entitycount+'</div>';
							Jquery("#detail-list-num-"+relatedid).html(listcount);
						}
					});
				}
			}
		});
	}
}

/*
*处理 相关信息添加时若存在 多选框 时新增div点击没有反应
*/
function setRelated_MultipleChoiceField(module){
	Jquery.ajax({
		url: "index.php",
		data: "module=Users&action=UsersAjax&file=setRelatedMultipleChoiceField&relmodule="+module,
		success:function(rest){
			if(rest != ''){
				var listcount = '';
				var restobj = eval('('+ rest +')')?eval('('+ rest +')'):JSON.parse(rest);
				Jquery.each(restobj,function(fieldid,fieldnamediv){
					setSelCheckBoxOpts(fieldnamediv);
				});
			}
		}
	});
}