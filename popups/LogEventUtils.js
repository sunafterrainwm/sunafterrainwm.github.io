$(function () {
	function pstringformat(str, arr){
		 return str.replace(RegExp("\\%([0-9]+|%|null)",'g'), function(match, p1){
			var index = parseInt(p1);
			if(p1 === 'null')return '';
			if(typeof arr[index] === 'string' || typeof arr[index] === 'number'){
				return arr[index];
			}else if(typeof arr[index] === 'undefined'){
				return match;
			}
			return p1;
		});
	}
	function generationLogEventString(data){
		var title = data.title;
		var logtype = data.type;
		var logaction = data.action;
		var params = data.params;
		switch (logtype){
			//日誌類型				//操作類型
			//A：abusefilter, abusefilterprivatedetails, avatar
				case 'abusefilter': 				//巴哈迷 : A車過濾器日誌 (誤
					var AFdiff = ((typeof params.historyId !== 'undefined') ? params.historyId : 
								((typeof params[0] !== 'undefined') ? params[0] : '' ));
					var AFid = ((typeof params.newId !== 'undefined') ? params.newId : 
								((typeof params[1] !== 'undefined') ? params[1] : '' ));	
					var AFaction = {create : "建立", modify : "修改"};
					switch (logaction){
						case 'create':				//建立過濾器
						case 'modify':				//修改過濾器
							return (
								/* if */ (AFid !== '') ? //巴哈迷 : A車過濾器 (?
								/* then */ "[[Special:AbuseFilter/history/" + AFid + (
									/* if */ (AFdiff !== '') ? 
										/* then */ ("/diff/prev/" + AFdiff) : 
										/* else */ ''
									/* end if */) + '|' + AFaction[logaction] + "]]" : 
								/* else */ AFaction[logaction]
								/* end if */ ) + 
								"了[[Special:AbuseFilter" + ((AFid !== '') ? ('/'+AFid) : '') + "|過濾器" + AFid + "]]";
						default:
							break;
					}
					break;
				case 'avatar':				//頭像日誌
					switch (logaction){
						case 'delete':				//刪除頭像
							return "刪除[[" + title  + '|' + title.replace(/^[^\:]+\:/, '') +  "]]的頭像";
						case 'update':				//更新頭像
							return "更新[[" + title  + '|' + title.replace(/^[^\:]+\:/, '') +  "]]的頭像";
						case 'upload':				//上傳頭像
							return "上傳[[" + title  + '|' + title.replace(/^[^\:]+\:/, '') +  "]]的頭像";
						default:
							break;
					}
					break;
				//=================================================
			//B：block
				case 'block':				//封禁日誌
					switch (logaction){
						case 'block':				//封禁用戶
							return "封禁[[" + title  + '|' + title.replace(/^[^\:]+\:/, '') +  "]] "
								+ ((typeof params.duration !== 'undefined') ? params.duration : '');
						case 'reblock':				//更改用戶的封禁
							return "更改[[" + title  + '|' + title.replace(/^[^\:]+\:/, '') +  "]]的封禁為 "
								+ ((typeof params.duration !== 'undefined') ? params.duration : '');
						case 'unblock':				//解除封禁
							return "解除[[" + title  + '|' + title.replace(/^[^\:]+\:/, '') +  "]]的封禁";
						default:
							break;
					}
					break;
				//=================================================
			//C：campus, comments, contentmodel, course, 
				case 'campus':				//教育計劃校園志工記錄
					break;
				case 'comments'://評論日誌
					switch (logaction){
						case '+ comment':			//新增評論
							return "新增評論";
						case 'delete':				//解除封禁
							return "屏蔽[[User:" + params.username  + '|' + params.username.replace(/^[^\:]+\:/, '') +
								"]]在[[" +  title + "]]的評論";
						case 'erase':				//解除封禁
							return "刪除[[User:" + params.username  + '|' + params.username.replace(/^[^\:]+\:/, '') +
								"]]在[[" +  title + "]]的評論";
						case 'import':				//導入評論
							return "在[[" + title + "]]導入了" + ((typeof params.count !== 'undefined') ? params.count + '條' : '') + "評論";
						default:
							break;
					}
					break;
				case 'contentmodel':		//內容模型變更日誌
					switch (logaction){
						case 'new':
							return "使用" + ((typeof params.newmodel !== 'undefined') ? ' \"' + params.newmodel + '\" ' : "未知的") + "格式建立[[" + title + "]]";
						case 'change':
							return "將[[" + title + "]]的格式改為" + ((typeof params.newmodel !== 'undefined') ? ' \"' + params.newmodel + '\" ' : "未知的格式");
					}
					break;
				//=================================================
			//D：delete
				case 'delete':				//刪除日誌
					switch (logaction){//
						case 'delete':				//刪除頁面
							return "刪除[[" + title + "]]";
						case 'delete_redir':		//刪除重定向 (一般為G8，覆蓋重定向)
							return "覆蓋重定向[[" + title + "]]";
						case 'event':				//刪除日誌或標籤或編輯摘要
							return "隱藏[[" + title + "]]中的部分紀錄";
						case 'flow-delete-post':	//刪除flow留言
							return "刪除[[" + title  + ((typeof params.postId !== 'undefined') ? "#flow-post-" + params.postId : '') + "|一則貼文]]";
						case 'flow-delete-topic':	//刪除flow討論串
							return "刪除[[" + title  + "|討論串]]";
						case 'flow-restore-post':	//還原flow留言
							return "還原[[" + title  + ((typeof params.postId !== 'undefined') ? "#flow-post-" + params.postId : '') + "|一則貼文]]";
						case 'flow-restore-topic':	//還原flow討論串
							return "還原[[" + title  + "|討論串]]";
						case 'restore':				//還原頁面
							return "還原[[" + title  + "]]" +	
								((typeof params.count !== 'undefined') ? ((typeof params.count.revisions	!== 'undefined')
										? ((parseInt(params.count.revisions	) > 0) ? 
												"中的" + params.count.revisions	+ "個修訂" : '') : '') : '') + 
								((typeof params.count !== 'undefined') ? ((typeof params.count.files		!== 'undefined')
										? ((parseInt(params.count.files		) > 0) ? 
												"中的" + params.count.files		+ "個檔案" : '') : '') : '') ;
						case 'revision':			//修訂版本刪除
							return "隱藏[[" + title  + "]]" +	
								((typeof params.count !== 'undefined') ? ((typeof params.count.revisions	!== 'undefined')
										? ((parseInt(params.count.revisions	) > 0) ? 
												"中的" + params.count.revisions	+ "個修訂" : '') : '') : '') + 
								((typeof params.count !== 'undefined') ? ((typeof params.count.files		!== 'undefined')
										? ((parseInt(params.count.files		) > 0) ? 
												"中的" + params.count.files		+ "個檔案" : '') : '') : '') ;
						default:
							break;
					}
					break;
				//=================================================
			//E：
				//=================================================
			//F：
				//=================================================
			//G：gblblock, gblrename, gblrights, globalauth, gwtoolset, 
				case 'gblblock'://gblock, gblock2, gunblock, modify, whitelist, dwhitelist, 
					switch (logaction){
						case 'gblock':
							break;
						case 'gblock2':
							break;
						case 'gunblock':
							break;
						case 'modify':
							break;
						case 'whitelist':
							break;
						case 'dwhitelist':
							break;
						default:
							break;
					}
					break;
				case 'gblrename'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'gblrights'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'globalauth'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'gwtoolset': //館聯維基工具日誌
					data.comment = ((typeof params.message !== 'undefined') ? params.message : data.comment);
					switch (logaction){
						case 'metadata-job':
							return "元數據[[" + title + "|工作]]已創建";
						case 'mediafile-job-succeeded':
							return "元數據[[" + title + "|工作]]已成功";
						case 'mediafile-job-failed':
							return "發生錯誤" + ((typeof params["metadata-record-nr"] !== 'undefined') ? "：" + params["metadata-record-nr"] : data.comment);
						default:
							break;
					}
					break;
				//=================================================
			//H：
				//=================================================
			//I：import, institution, instructor, 
				case 'import'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'institution'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'instructor'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//J：
				//=================================================
			//K：
				//=================================================
			//L：liquidthreads, 
				case 'liquidthreads'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//M：managetags, massmessage, merge, move, 
				case 'malfeasance':		//濫權日誌 {{幽默}}
					switch (logaction){
						case 'antigng':	//假的，我的眼睛業障重
							break;
						case '燃燈':	//兔晶日誌 (?
							break;
						case '藍桌':	//藍桌法將被推翻。
							break;
						default:
							break;
					}
					break;
				case 'managetags'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'massmessage'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'merge'://
					switch (logaction){
						case 'merge':
							return "將[[" + title + "]]合併到[[" + params.dest_title + "]]";
						default:
							break;
					}
					break;
				case 'move'://移動日誌
					var suppressredirect = (params.suppressredirect === '') ? "不留重新導向地" : '';
					var orginal_text = "將[[" + title + "]]" + suppressredirect + "移動到[[" + params.target_title + "]]";
					var change_ns = (((typeof data.ns !== 'undefined' && data.ns !== null) ? parseInt(data.ns) : parseInt(params.target_ns)) 
							!= parseInt(params.target_ns)) ? " (跨名字空間移動)" : '';
					switch (logaction){
						case 'move':
							return orginal_text + change_ns;
						case 'move_redir':
							return orginal_text + "並覆蓋原有重定向頁。" + change_ns;
						default:
							break;
					}
					break;
				//=================================================
			//N：newusers, notifytranslators, 
				case 'newusers'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'notifytranslators'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//O：online, 
				case 'online'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//P：pagelang, pagetranslation, pagetriage-curation, pagetriage-deletion, patrol, protect, 
				case 'pagelang'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'pagetranslation'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'pagetriage-curation'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'pagetriage-deletion'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'patrol'://patrol/patrol, patrol/autopatrol
					switch (logaction){
						case 'autopatrol'://巡查豁免者的編輯
						case 'patrol':	//標記已巡查
							return (RegExp("^[Aa]uto").test(logaction) ? "自動" : '') + 
								"標記[[Special:PermanentLink/" + params.curid + '|' + title + "]]為已巡查";
						default:
							break;
					}
					break;
				case 'protect'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//Q：
				//=================================================
			//R：renameuser, rights, 
				case 'renameuser'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'rights'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//S：spamblacklist, student, stable, suppress, 
				case 'spamblacklist'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'student'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'stable'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'suppress'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//T：tag, thanks, timedmediahandler, titleblacklist, translationreview, 
				case 'tag'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'thanks'://
					switch (logaction){
						case 'thank':
							return "對[[" + title + '|' + title.replace(/^[^\:]+\:/, '') + "]]傳達感謝";
						default:
							break;
					}
					break;
				case 'timedmediahandler'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'titleblacklist'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'translationreview'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//U：newsletter, upload, usermerge, 
				case 'newsletter'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'upload'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				case 'usermerge'://
					switch (logaction){
						case '':
							break;
						default:
							break;
					}
					break;
				//=================================================
			//V：
			//W：
			//X：
			//Y：
			//Z：
			//Other
			default:
				break;
		}
		return null;
	};
	window.a2569875PopUp = {};
	window.a2569875PopUp.Module = {};
	window.a2569875PopUp.Module.LogEventTypes = [
		/* A */ 'abusefilter', 'avatar',
		/* B */ 'block',
		/* C */ 'campus', 'comments', 'contentmodel', 'course', 
		/* D */ 'delete', 
		/* E */
		/* F */
		/* G */ 'gblblock', 'gblrename', 'gblrights', 'globalauth', 'gwtoolset', 
		/* H */
		/* I */ 'import', 'institution', 'instructor', 
		/* J */
		/* K */
		/* L */ 'liquidthreads', 
		/* M */ 'malfeasance', 'managetags', 'massmessage', 'merge', 'move', 
		/* N */ 'newusers', 'notifytranslators', 
		/* O */ 'online', 
		/* P */ 'pagelang', 'pagetranslation', 'pagetriage-curation', 'pagetriage-deletion', 'patrol', 'protect', 
		/* Q */ 
		/* R */ 'renameuser', 'rights', 
		/* S */ 'spamblacklist', 'student', 'stable', 'suppress', 
		/* T */ 'tag', 'thanks', 'timedmediahandler', 'titleblacklist', 'translationreview', 
		/* U */ 'newsletter', 'upload', 'usermerge', 
		/* V */
		/* W */
		/* X */
		/* Y */
		/* Z */
		/* E */
	];
	window.a2569875PopUp.Module.generationLogEventString = generationLogEventString;
	window.a2569875PopUp.Module.myStringFormat = pstringformat;
});

/*
gblblock/gblock, gblblock/gblock2, gblblock/gunblock, gblblock/modify, globalauth/delete, globalauth/lock, globalauth/unlock, 
globalauth/hide, globalauth/unhide, globalauth/lockandhid, globalauth/setstatus, suppress/setstatus, suppress/cadelete, 
gblrights/usergroups, gblrights/groupperms, gblrights/groupprms2, gblrights/groupprms3, suppress/hide-afl, suppress/unhide-afl, 
usermerge/mergeuser, usermerge/deleteuser, spamblacklist/*, titleblacklist/*, gblblock/whitelist, gblblock/dwhitelist, 
renameuser/renameuser, gblrights/grouprename, gblrename/rename, gblrename/promote, gblrename/merge, gblrights/newset, 
gblrights/setrename, gblrights/setnewtype, gblrights/setchange, gblrights/deleteset, abusefilter/hit, abusefilter/modify, 
abusefilter/create, abusefilterprivatedetails/access, liquidthreads/move, liquidthreads/split, liquidthreads/merge, 
liquidthreads/subjectedit, liquidthreads/resort, liquidthreads/signatureedit, massmessage/*, massmessage/send, massmessage/failure, 
massmessage/skipoptout, massmessage/skipnouser, massmessage/skipbadns, notifytranslators/sent, thanks/*, delete/flow-restore-post, 
suppress/flow-restore-post, delete/flow-restore-topic, suppress/flow-restore-topic, lock/flow-restore-topic, 
import/lqt-to-flow-topic, newsletter/*, block/block, block/reblock, block/unblock, contentmodel/change, contentmodel/new, 
delete/delete, delete/delete_redir, delete/event, delete/restore, delete/revision, import/interwiki, import/upload, 
managetags/activate, managetags/create, managetags/deactivate, managetags/delete, merge/merge, move/move, move/move_redir, 
patrol/patrol, patrol/autopatrol, protect/modify, protect/move_prot, protect/protect, protect/unprotect, rights/autopromote, 
rights/rights, suppress/block, suppress/delete, suppress/event, suppress/reblock, suppress/revision, tag/update, 
upload/overwrite, upload/revert, upload/upload, timedmediahandler/resettranscode, translationreview/message, 
translationreview/group, delete/flow-delete-post, delete/flow-delete-topic, suppress/flow-suppress-post, suppress/flow-suppress-topic, 
lock/flow-lock-topic, newusers/newusers, newusers/create, newusers/create2, newusers/byemail, newusers/autocreate, 
pagelang/pagelang, pagetranslation/mark, pagetranslation/unmark, pagetranslation/moveok, pagetranslation/movenok, 
pagetranslation/deletelok, pagetranslation/deletefok, pagetranslation/deletelnok, pagetranslation/deletefnok, 
pagetranslation/encourage, pagetranslation/discourage, pagetranslation/prioritylanguages, pagetranslation/associate, 
pagetranslation/dissociate

*/
