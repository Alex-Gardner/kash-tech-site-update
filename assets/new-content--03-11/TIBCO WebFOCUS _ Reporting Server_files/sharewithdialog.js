/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.16 $:

	$.widget("ibi.sharewith", $.ibi.ibxDialog,
	{
		options:
		{
			dao: null,
			path: "",
			refreshfolder: false,
			getShares: null,
			ppSharing: null,
			showEveryoneGroup: true, // Show hide EVERYONE group box
			shareBasic: true, // Share with everyone checkbox will only show up if the user has Share basic permission(opShareBasic).
			shareWith: true, //option to pass shareWith (true/false default is true) when requesting user/groups list
			show: "all", // Users/Group
		},	
		_widgetClass: "home-sharewith",		
		
		_getIBFSlistShares: function()
		{				
			// Add Share with everyone checkbox
			if (this.options.shareBasic)
			{
				$("<div class='share_with_everyone'>").ibxCheckBoxSimple({"text":ibx.resourceMgr.getString("home_share_with_everyone")}).prependTo( ".ibx-dialog-button-box" );
				if (!this.options.showEveryoneGroup)
					$(form).find(".share_with_everyone").ibxWidget('option','disabled', true);	
			}

			$(".share_with_everyone").on('click', function (e) 
			{
				if ($(".share_with_everyone").ibxWidget("checked"))
				{
					$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
					$(form).find(".sw-div-search").ibxWidget('option', 'disabled', true);
					this._ShareWithList("everyone");					
				}
				else
				{
					$(form).find(".sw-div-search").ibxWidget('option', 'disabled', false);
					// if the user have  EVERYTHING box and do uncheck
					if (this.shareWithlist.length == 1 && this.shareWithlist[0].name == "EVERYONE")
					{ 
						this.currentGroupArrayStr = "";
						this.currentUserArrayStr = "";
						this.shareWithlist = [];
						$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
					}
					this._ShareWithList(this.options.show); // Show current Group and Users list shared
				}
			}.bind(this));	

			this.shareWithlist = [];
			$.when(this.options.dao.listShares(this.options.path)).then(function(data)
			{
				var items = $("item", data);
				items.each(function(idx, el)
				{
					el = $(el);
					var fullPath = el.attr("fullPath");
					if (fullPath != undefined && fullPath.length > 0)
					{
						var name;
						var type = "u";
						var email = "";
						var idx = fullPath.lastIndexOf("USERS/");
						if (idx != -1)
						{
							name = fullPath.substr(idx+6,fullPath.length);
							this.currentUserArrayStr += name + ",";
							email = el.attr("email");
						}
						else
						{
							name = fullPath.substr(fullPath.lastIndexOf("GROUPS/")+7,fullPath.length);
							this.currentGroupArrayStr += name + ",";
							type = "g";
						}
								
						this.shareWithlist.push({
						    name: name,
						    description: el.attr("description"),
						    email: email,
						    type: type
						});
					}				
				}.bind(this));
						
				this.shareWithlist.sort(function (a, b) {
					return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
				});
	
				if (this.shareWithlist.length == 1 && this.shareWithlist[0].name == "EVERYONE")
					this._EveryoneCheckboxClick(true);
				
				$(".Share-with-others-menu").on("ibx_select", this._onMenuItemSelect.bind(this));
				
				if (this.shareWithlist.length > 0)
					this._ShareWithList(this.options.show); // Show current Group and Users list shared
				else
					this._stopProgress(".share-with-hbox");
			}.bind(this));
		},
		_ShareWithList: function(type)
		{ // user, group, all
		  // everyone - special case when share with everyone checkbox is on 
			
			$(form).find(".share-with-container").children().remove();
			this._showContainerTitle(); // depend on the type
			var itemList = $(".share-with-container");		

			if (this.options.shareBasic && $(".share_with_everyone").ibxWidget("checked"))
			{
				if (this.options.showEveryoneGroup)
				{
					var shareWithlistEveryone = [];
					shareWithlistEveryone.push({
				        name: "EVERYONE",
				        description: ibx.resourceMgr.getString("str_all_defined_users"),
					    email: "",
					    type: "g"
					});		
					var userdata = {}; // init			
					userdata.type = shareWithlistEveryone[0].type;
					userdata.name = shareWithlistEveryone[0].name;
					
					var item = new userGroupItem(shareWithlistEveryone[0],false);
					item.element.ibxAddClass("share-with-item-user");
					item.element.data("userData",userdata);
					itemList.append(item.element);	
					form.find(".share-with-title").show();
				}
				else
					form.find(".share-with-title").hide();
			}
			else
			{
				this.shareWithlist.length == 0 ? form.find(".share-with-title").hide() : form.find(".share-with-title").show();
				for (var i=0; i < this.shareWithlist.length; i++)
				{
					if (type == "all" || this.shareWithlist[i].type == type)
					{
						var userdata = {}; // init
						userdata.type = this.shareWithlist[i].type;
						userdata.name = this.shareWithlist[i].name;
			
						var item = new userGroupItem(this.shareWithlist[i],false);
						item.element.ibxAddClass("share-with-item-user");
						item.element.data("userData",userdata);
						itemList.append(item.element);
					}
				}
			}
						
			$(form).find(".sw-close-button").on('click', function (e)
			{ 
				if (this.searchDialog != null && this.searchDialog.ibxWidget("isOpen"))
					return; // do nothing

				var userData = $(e.currentTarget.parentElement).data("userData");

				// case 1, user click on the checkbox inside the dialog
				if (userData.name == "EVERYONE" && (this.shareWithlist.length == 0 || this.shareWithlist[0].name != "EVERYONE"))
				{
					this._EveryoneCheckboxClick(false);
					this._ShareWithList(this.options.show); // Show current Group and Users list shared
				}
				else
				{
					this.currentUserArrayStr=",";
					this.currentGroupArrayStr=",";
					
					// case 2, user select EVERYONE, Save and open the dialog again and click delete on EVERYONE
					if (this.shareWithlist.length == 1 && this.shareWithlist[0].name == "EVERYONE")
						this._EveryoneCheckboxClick(false);
					
					for (var i=0; i < this.shareWithlist.length; i++)
					{ // remove object that got deleted
						if (this.shareWithlist[i].type == userData.type && this.shareWithlist[i].name == userData.name)
							this.shareWithlist.splice(i, 1);					
					}
					
					for (var i=0; i < this.shareWithlist.length; i++)
					{
						if (this.shareWithlist[i].type == "u")
							this.currentUserArrayStr += this.shareWithlist[i].name + ",";
						else
							this.currentGroupArrayStr += this.shareWithlist[i].name + ",";
					}						
					
					$(e.currentTarget.parentElement).remove();
					this._showContainerTitle();
				}
				$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);

			}.bind(this));
			
			this._stopProgress(".share-with-hbox");
		},

		_EveryoneCheckboxClick: function(Ischecked)
		{
			$(form).find(".sw-div-search").ibxWidget('option', 'disabled', Ischecked);
			$(form).find(".share_with_everyone").ibxWidget("option", "checked", Ischecked);						
		},
		
		_DropDownList: function()
		{ // show drop down dialog
			this._startProgress(".share-with-hbox");
			
			clearTimeout(this.typingTimer);
			var searchString = form.find(".share-with-txt-search").ibxWidget("option", "text");

			var runAjax = true;
			if (this.basesearchString == "")
			{ // init
				this.currentSearchArray = [];
				this.basesearchString = searchString;
			}
			else
			{
				if (this.currentSearchArray.length < 500 && searchString.substr(0, this.basesearchString.length).toUpperCase() == this.basesearchString.toUpperCase())
					runAjax = false;
				else
					this.basesearchString = "";
			}
	
			if (runAjax)
			{
				$('#shareWithDropdown').empty();
	
				switch (this.showOption)
				{
					case "u":
						this.url = sformat("{1}/userlist", applicationContext);
						break;
					case "g":
						this.url = sformat("{1}/grouplist ", applicationContext);
						break;
					case "all":
					default:
						this.url = sformat("{1}/usergrouplist", applicationContext);
						break;
				}

				this.searchRows = 50; 
				this.searchIndex = 0;
				$.when(this.options.dao.listUserGroup(this.url,searchString,this.searchRows,this.searchIndex,this.options.shareWith)).then(function(json)
				{				
				    if (json.length > 0)		    		
				    {
					   	this.searchIndex += this.searchRows;

				    	this.currentSearchArray = json;
						// Show the popup window
						this.searchDialog.ibxWidget("open").position({my:"left top", at:"left-5px bottom+6px", of: form.find(".share-with-btn-search")});
							
						json.length < this.maxRows ? $(this.searchDialog).find(".share-with-dropdown-label").hide() : $(this.searchDialog).find(".share-with-dropdown-label").show();
	
						var itemList = $('#shareWithDropdown');						
						for (var i = 0; i < json.length; i++)
				    	{			    		
							var userdata = json[i]; // init
							var item = new userGroupItem(json[i],true);
								
							if (json[i].type == "u")
							{
								if (this.currentUserArrayStr.indexOf("," + json[i].name + ",") == -1)
								{
									item.element.ibxAddClass("share-with-item");
									userdata.disabled = false;						
								}
								else
								{
									item.element.ibxAddClass("share-with-item share-with-item-disabled");
									userdata.disabled = true;						
								}						
							}
							else
							{
								if (this.currentGroupArrayStr.indexOf("," + json[i].name + ",") == -1)
								{
									item.element.ibxAddClass("share-with-item");
									userdata.disabled = false;
								}
								else
								{
									item.element.ibxAddClass("share-with-item share-with-item-disabled");
									userdata.disabled = true;
								}
							}
								
							item.element.data("userData",userdata);
							itemList.append(item.element);
				    	}
							
						this._done = true;	// set flag initially done
						
						this.searchDialog.focus();
						$(".share-with-txt-search").focus();
						    	
						this.regx = new RegExp(this._escapeRegx(), "gi");
													
				    	$('#shareWithDropdown').on("scroll", function (event) 
				    	{					    		
            				if ($('#shareWithDropdown').scrollTop() + $('#shareWithDropdown').innerHeight() + 20 >= $('#shareWithDropdown')[0].scrollHeight)
				    		{ // near bottom
                				if (!this._done)	// a scroll event happened before the last was done so ignore
                					return;

                				this._done = false;
                                event.preventDefault();

	                			$.when(this.options.dao.listUserGroup(this.url,this.basesearchString,this.searchRows,this.searchIndex,this.options.shareWith)).then(function(json)
	                			{
	                				// don't start spinner unless something to do
	                				if (json.length > 0)
	                					this._startProgress(".share-with-container-dialog");
	                				else
	                					return;
	                				
	                				this.searchIndex += this.searchRows;
									
									var itemList = $('#shareWithDropdown');	
									for (var i = 0; i < json.length; i++)
							    	{	
										var userdata = json[i]; // init
					
										var item = new userGroupItem(json[i],true);
												
										if (json[i].type == "u")
										{
											if (this.currentUserArrayStr.indexOf("," + json[i].name + ",") == -1)
											{
												item.element.ibxAddClass("share-with-item");
												userdata.disabled = false;						
											}
											else
											{
												item.element.ibxAddClass("share-with-item share-with-item-disabled");
												userdata.disabled = true;						
											}						
										}
										else
										{
											if (this.currentGroupArrayStr.indexOf("," + json[i].name + ",") == -1)
											{
												item.element.ibxAddClass("share-with-item");
												userdata.disabled = false;
											}
											else
											{
												item.element.ibxAddClass("share-with-item share-with-item-disabled");
												userdata.disabled = true;
											}
										}
										item.element.data("userData",userdata);
										var passed = this.regx.test(item.description);
										passed = passed || this.regx.test(item.name); 
										item.element[0].style.display = passed ? "" : "none";

										item.element.on( "click", function( e ) { this._onItemClick($(e.currentTarget).data("userData")); }.bind(this));
										itemList.append(item.element);
							    	}
									
	                				this._done = true;

									setTimeout(function() { this._stopProgress(".share-with-container-dialog");}.bind(this), 90);									
	                    		}.bind(this));
					    	}	    			 
					    }.bind(this)); //on scroll

						$(this.searchDialog).find(".share-with-item").on( "click", function( e ) { this._onItemClick($(e.currentTarget).data("userData")); }.bind(this));	
							
						$(this.searchDialog).find(".share-with-item2").on( "click", function( e ) 
						{
							var userdata = $(e.currentTarget).data("userData");
	
							if (userdata.disabled) // user click on disable item
								return;
										
							$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
	
							if (userdata.type == "g")
								this.currentGroupArrayStr += userdata.name + ",";
							else
								this.currentUserArrayStr += userdata.name + ",";
								
							this.isDropdownOpen = false;
								
							this.shareWithlist.push({
								name: userdata.name,
								description: userdata.description,
								email: userdata.email,
								type: userdata.type
							});
								
							this.shareWithlist.sort(function (a, b) {
								return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
							});
								
							this._ShareWithList(this.showOption); // Show current Group and Users list shared
							this.searchDialog.ibxWidget("close");
							this._resetUserGroup();
						}.bind(this));	
			    	}
					this._stopProgress(".share-with-hbox");
			    }.bind(this), function(jqXHR,textStatus,errorThrown ) 
		        {   
		        	alert("usergrouplist failed");
		        	this._stopProgress(".share-with-hbox");
		        }.bind(this));
			}
			else
			{
				// show hide items in the dialog
				var newString  = this._escapeRegx();
				var regx = new RegExp(newString, "i");
				var items = $(".item-user-group");
				items.each(function(regx, idx, el)
				{
					var item = el._userGroupItem;
					if(!item)
						return;
					var passed = regx.test(item.description);
					passed = passed || regx.test(item.name); 
					el.style.display = passed ? "" : "none";
					regx.lastIndex = 0;
				}.bind(this, regx));
				this._stopProgress(".share-with-hbox");
			}

		},

		_onItemClick: function (userdata)
		{			
			if (userdata.disabled) // user click on disable item
				return;
				
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);

			if (userdata.name == "EVERYONE" && userdata.type == "g")
			{ // if the user select EVERYONE from the drop down, We need to remove all the item and add EVERYONE 
				this.currentGroupArrayStr = "";
				this.currentUserArrayStr = "";
				this.shareWithlist = [];
				this._EveryoneCheckboxClick(true);
			}
			
			if (userdata.type == "g")
				this.currentGroupArrayStr += userdata.name + ",";
			else
				this.currentUserArrayStr += userdata.name + ",";
			
			this.isDropdownOpen = false;
			
			this.shareWithlist.push({
				name: userdata.name,
				description: userdata.description,
				email: userdata.email,
				type: userdata.type
			});
			
			this.shareWithlist.sort(function (a, b) {
				return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
			});
			
			this._ShareWithList(this.showOption); // Show current Group and Users list shared
			this.searchDialog.ibxWidget("close");
			this._resetUserGroup();
		},
		
		_escapeRegx: function ()
		{
			var searchString = form.find(".share-with-txt-search").ibxWidget("option", "text");
			var removedDuplicateStars = searchString.replace(/\*\**/g,"*");
			var dotStar = removedDuplicateStars.replace(/\*/g,".*");
			var newString = dotStar.indexOf(".*") == 0 ? dotStar.substr(2) : dotStar;
			newString = newString.replace(/\\/g,"\\\\");
			newString  = newString.replace(/\(/g,"\\(");
			newString  = newString.replace(/\)/g,"\\)");
			newString  = newString.replace(/\[/g,"\\[");
			newString  = newString.replace(/\]/g,"\\]");
			return newString;
		},
		
		_create: function ()
		{
			this._super();
			this.shareWithlist = [];
			this.currentSearchArray = [];
			this.currentUserArrayStr = ",";
			this.currentGroupArrayStr = ",";
			this.showOption = this.options.show;
			this.isDropdownOpen = false;
			this.searchDialog = null;
			this.maxRows = 500;
			this.typingTimer=null;
			this.basesearchString = "";
			this.startProgress = false;
			
			Ibfs.load(applicationContext, WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val).done(function(ibfs)
			{
				this.options.ibfs = ibfs;
			}.bind(this));
			
			form = ibx.resourceMgr.getResource('.share-with-others-dialog');
			this.searchDialog = ibx.resourceMgr.getResource('.share-with-container-dialog', true);
			
			$(this.searchDialog).find(".share-with-dropdown-label").hide();
			$(this.searchDialog).find(".share-with-dropdown-label").ibxWidget("option", "text", sformat(ibx.resourceMgr.getString("str_showing_first_x_entries"),this.maxRows));

			form.find(".share-with-title").hide();
			
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
			$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_share_with_others"));
			$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("home_ok"));
			
			form.ibxWidget('open');	
			this._startProgress(".share-with-hbox");

			$.when(this.options.dao.listUserGroup(sformat("{1}/usergrouplist", applicationContext),"EVERYONE",10,0,this.options.shareWith)).then(function(json)
			{
		    	this.options.showEveryoneGroup = (json.length > 0);
				this._getIBFSlistShares(); // start collection data
			}.bind(this));
	 
			$(form).find(".share-with-txt-search").on('ibx_action ibx_textchanged', function (event, info)
			{
				clearTimeout(this.typingTimer);
				var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");

				if (this.startProgress)
				{
					$(form).find(".share-with-txt-search").ibxWidget("option", "text",this.basesearchString); // don't let the user type				
					event.preventDefault();
					return false;
				}
				
				if (str.length == 0)
				{
					this.isDropdownOpen = false;
					this.searchDialog.ibxWidget("close");
					this._resetUserGroup();
				}									
				else
					this.typingTimer = setTimeout(function() { this._DropDownList();}.bind(this), 500);
			}.bind(this));
			
			$(form).find(".ibx-dialog-cancel-button").on('click', function (e)
			{ 
				this.searchDialog.ibxWidget("close");
				this._resetUserGroup();
			}.bind(this));
			
			$(form).find(".ibx-dialog-ok-button").on('click', function (e)
			{ 
				this.shareWithEveryone =  this.options.shareBasic && $(".share_with_everyone").ibxWidget("checked");				
				var i;
				var arShareIds = [];
				if (this.shareWithEveryone)
				{
				 	var uriExec = sformat("{1}/views.bip", applicationContext);
				 	var randomnum = Math.floor(Math.random() * 100000);	
		    		var argument = 
		    		{
		    			"BIP_REQUEST_TYPE": "BIP_SHARE_ITEM",
		    			"ibfsPath": this.options.path
		    		};
		    		argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
		    		argument[IBI_random] = randomnum;

		    		$.post(uriExec, argument).done(function(data)
		    		{
						this._refreshfolder();									    	
		    		}.bind(this));
				}
				else
				{
					for (var i=0; i < this.shareWithlist.length; i++)
					{
						if (this.shareWithlist[i].type == "u")
							arShareIds.push("IBFS:/SSYS/USERS/"+this.shareWithlist[i].name);
						else
							arShareIds.push("IBFS:/SSYS/GROUPS/"+this.shareWithlist[i].name);
							
					}
					this.options.ibfs.setShares(this.options.path, arShareIds, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)		
							{		
								if (exInfo.result.length == 0)
								{
									this._checkForError(exInfo);				
								}
								this._refreshfolder();									    	
							}.bind(this));
				}
			}.bind(this));
			
			$( window ).resize(function() 
			{
				if (this.searchDialog != null && this.searchDialog.ibxWidget("isOpen"))
				{
					this.searchDialog.ibxWidget("close");
					this._resetUserGroup(); // reset
				}
			}.bind(this));
			
			$(form).on("ibx_beforeclose", function(e, closeData)
			{
				if (this.searchDialog)
				{
					this.searchDialog.ibxWidget("close");
					this.searchDialog.detach();
				}
				
			}.bind(this));
		},	

		_refreshfolder: function()
		{
			if ( this.options.refreshfolder)
				this.options.refreshfolder(this.options.path.substring(0, this.options.path.lastIndexOf('/')));
			if (this.options.getShares)
				this.options.getShares(arShareIds);
			if (this.options.ppSharing)
				this.options.ppSharing(this.shareWithlist.length > 0 || this.shareWithEveryone);
		},
		
		_onMenuItemSelect:function(e, menuItem)
		{
			this.showOption = $(menuItem).data("menuCmd");
			this._setmenuItem(this.showOption);
			this.searchDialog.ibxWidget("close");
			this._resetUserGroup();
			
			if (this.isDropdownOpen)
			{ // you must close the menu if it is open
				this.isDropdownOpen = false;
			}
		},
		
		_resetUserGroup: function()
		{
			$(form).find(".share-with-txt-search").ibxWidget('option', 'text', "");
			this.basesearchString = "";
			this.currentSearchArray = [];
		},
		
		_setmenuItem: function(show)
		{	
			switch (show)
			{
				case "u":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", true);					
					break;
				case "g":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_groups"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", false);										
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", true);
					break;
				case "all":
				default:
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users_and_groups"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", false);										
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);					
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", true);
					break;
			}
			this._ShareWithList(show); // Show current list shared
		},
		
		_showContainerTitle: function()
		{ 
			switch (this.showOption)
			{
				case "u":
					this.currentUserArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				case "g":
					this.currentGroupArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				case "all":
				default:
					this.currentGroupArrayStr.length == 1 && this.currentUserArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
			}			
		},
				
	    _checkForError: function(exInfo)
	    {	    	
	    	//check for error
	    	var xmldata = exInfo.xhr.responseXML;
	    		
	    	$(xmldata).children().each(function()
	    	{
	   			var tagName=this.tagName;
	   			if(tagName=="ibfsrpc")
	   			{
	   				var retcode=$(this).attr('returncode');	
    				if (retcode!="10000")
    				{
	    				var text = $(this).attr('localizeddesc');	    					
	    				captionText = ibx.resourceMgr.getString("unrecoverable_error");
	    				var options = 
	    				{
	    					type:"medium error",
	    					caption:captionText,
	    					buttons:"ok",		
	    					messageOptions:{text:text}
	    				};
	    				var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
	    				dlg.ibxDialog("open").on("ibx_close", function(e, btn)
	    				{	    					
	    				});	    				
	    			}
	    		}						
	    	});
	    					
	    },
				    
		_startProgress:function(divClassName)
		{	
			this.startProgress = true;
			var settings = {};
			var options = 
			{
				text: "",
				curVal: 0,
			};			
			options.glyphClasses = "fa fa-circle-o-notch";

			var waiting = ibx.waitStart(divClassName).css("font-size", "3em");
			waiting.ibxWidget("option", options);
		},		

		_stopProgress:function(divClassName)
		{
			ibx.waitStop(divClassName);
			this.startProgress = false;
		},
		
		_destroy: function ()
		{
			this._super();
		},
	});
	
	var template = ibx.resourceMgr.getResource('.sw-item-template', true);
	function userGroupItem(ibfsItem,IsDropdownItem)
	{
		this.ibfsItem = ibfsItem;
		
		var description = this.description = ibfsItem.description;
		var type = this.type = ibfsItem.type;
		var name = ibfsItem.name;
		var title = sformat("{1}\u000A{2}", description,name);
		
		if (type == "u" && ibfsItem.email != "" && name != ibfsItem.email)
			name += "(" + ibfsItem.email + ")";						
		this.name = name;
		
		this.element = template.clone().ibxRemoveClass("sw-item-template");
		if (IsDropdownItem)
			this.element.find(".item-close-icon").hide();
		else // share with items
			this.element.ibxRemoveClass("item-user-group");
		
		this.element[0]._userGroupItem = this;
		
		this.element.find(".sw-item-desc").text(description);		
		this.element.find(".sw-item-desc").prop('title', title);
		this.element.find(".sw-item-desc").css("font-weight","bold");
			
		this.element.find(".sw-item-name").text(name);		
		this.element.find(".sw-item-name").prop('title', title);

		this.element.find(".sw-item-icon").ibxAddClass((type == "u") ? "sw-item-user" : "sw-item-group");
	}


//# sourceURL=sharewithdialog.js