/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.5 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.changePassword", $.ibi.ibxDialog,
{
	options:
	{
		//"type": "medium",
		"nameRoot": true,
		"movable": false,
		'buttons': "okcancel",
		'closeSelector': "",
		'posSelector': "",
	},
	_widgetClass: "change-password",
	
	_create: function()
	{
		this._super();
		this.element.find('.ibx-title-bar-close-button').prop('tabindex', "0").prop('title', ibx.resourceMgr.getString("dataselect_close_dialog"));
		this.element.find(".form-fill-error-text").hide();
		this.element.find(".ibx-dialog-ok-button").ibxWidget("option","disabled",false);
		this.element.find(".ibx-dialog-ok-button").ibxWidget("option","text",ibx.resourceMgr.getString("hpreboot_change_password"));
		this.element.find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_change_password"));

		this.element.find(".hp-reboot-old-password").find('input').attr('aria-required', 'true');
		this.element.find(".hp-reboot-old-password").on('ibx_textchanged', this._disableOKButton.bind(this));
		
		this.element.find(".hp-reboot-new-password").find('input').attr('aria-required', 'true');
		this.element.find(".hp-reboot-new-password").on('ibx_textchanged', this._disableOKButton.bind(this));
		
		this.element.find(".hp-reboot-confirm-password").find('input').attr('aria-required', 'true');
		this.element.find(".hp-reboot-confirm-password").on('ibx_textchanged', this._disableOKButton.bind(this));

		this.element.find('.ds-messaging-ui').ibxWidget('updateTypeOfMessage', 'error')
		
		
		this.element.on("ibx_beforeclose", function(e, closeData) 
		{				
			if (closeData == "ok")
				e.preventDefault();
		}.bind(this));
		
		this.element.on("ibx_close", function(e, closeData) 
		{
			$(this.options.closeSelector).focus();
		}.bind(this));
		
		this.element.find(".ibx-dialog-ok-button").on('click', function (e){ 
	 		$(".form-fill-error-text").empty(); // reset

			this.element.find(".hp-reboot-old-password").ibxRemoveClass("hp-chg-pwd-error error").ibxRemoveClass("hp-chg-pwd-good chg-pwd-good");
			this.element.find(".hp-reboot-new-password").ibxRemoveClass("hp-chg-pwd-error error").ibxRemoveClass("hp-chg-pwd-good chg-pwd-good");
			this.element.find(".hp-reboot-confirm-password").ibxRemoveClass("hp-chg-pwd-error error").ibxRemoveClass("hp-chg-pwd-good chg-pwd-good");

			var oldPassword = this.element.find(".hp-reboot-old-password").ibxWidget('option','text');
			var NewPassword = this.element.find(".hp-reboot-new-password").ibxWidget('option','text');
			var ConfirmNewPassword = this.element.find(".hp-reboot-confirm-password").ibxWidget('option','text');
	    	if (NewPassword != ConfirmNewPassword)
	    	{
				this.element.find('.hp-reboot-new-password').ibxRemoveClass("hp-chg-pwd-good chg-pwd-good");
				this.element.find('.hp-reboot-confirm-password').ibxRemoveClass("hp-chg-pwd-good chg-pwd-good");
				this.element.find('.hp-reboot-new-password').ibxAddClass("hp-chg-pwd-error error");
				this.element.find('.hp-reboot-confirm-password').ibxAddClass("hp-chg-pwd-error error");
				this.element.find(".form-fill-error-text").ibxRemoveClass("form-fill-good-bgc");
				this.element.find('.ds-messaging-ui').ibxWidget('updateMessage', ibx.resourceMgr.getString("hpreboot_passwords_donot_match"));
				this.element.find(".ds-messaging-ui").ibxRemoveClass('wfshell-hidden');
				this.element.find(".form-fill-error-text").ibxAddClass("form-fill-error-bgc");
				this.element.find(".form-fill-error-text").show();
				this.element.find(".form-fill-error-text").append(ibx.resourceMgr.getString("hpreboot_passwords_donot_match"));
				this.element.find(".form-fill-error-text").focus();
	    	}
	    	else
	    	{
				var message = "";
				var uriExec = sformat("{1}/accountService/changePassword.sec", applicationContext);
				var argument=
				{
					IBIB_userid: this.element.find('.hp-reboot-user-name').ibxWidget('option', 'text'),		
					IBIB_newpassword: NewPassword,
					IBIB_password: oldPassword
				 };	
				argument[IBI_random] = Math.floor(Math.random() * 100000);
				argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
				$.post(uriExec, argument , function(retdata, status) 
				{
					if(status=="success") 
					{
						xmlDoc = $.parseXML(retdata);
						var result =$(xmlDoc).find("result");
						var resultvalue = $(result).attr('value');
						var code = $(result).attr('code');
						if (resultvalue == "1")
						{
							rebootUtil.StandardMessage(ibx.resourceMgr.getString("hpreboot_change_password"),ibx.resourceMgr.getString("hpreboot_your_password_changed"),"success", this.options.posSelector);
							$(this.options.closeSelector).focus();
							this.element.ibxWidget('close');
						}
						else
						{
							var detail =$(xmlDoc).find("detail");
							$(".form-fill-error-text").show();
							this.element.find('.ds-messaging-ui').ibxWidget('updateMessage', detail[0].childNodes[0].nodeValue);
							this.element.find(".ds-messaging-ui").ibxRemoveClass('wfshell-hidden');
							$(".form-fill-error-text").append(detail[0].childNodes[0].nodeValue);
							$(".form-fill-error-text").focus();
							this.element.find('.ds-messaging-ui').focus();
							if (code == '5003')
							{
								this.element.find('.hp-reboot-old-password').ibxAddClass("hp-chg-pwd-error error");
							}
						}
					}
				}.bind(this), "html");			
	    	}
		}.bind(this));
	},
	
	_disableOKButton: function()
	{
		var oldPassword = this.element.find(".hp-reboot-old-password").ibxWidget('option','text');
		var newPassword = this.element.find(".hp-reboot-new-password").ibxWidget('option','text');
		var confirmPassword = this.element.find(".hp-reboot-confirm-password").ibxWidget('option','text');
/*		
    	if (this.element.find(".form-fill-error-text").hasClass("form-fill-error-bgc"))
		{
			this.element.find(".form-fill-error-text").hide();
			this.element.find('.hp-reboot-old-password').ibxRemoveClass("hp-chg-pwd-error");
			this.element.find('.hp-reboot-new-password').ibxRemoveClass("hp-chg-pwd-error");
			this.element.find('.hp-reboot-confirm-password').ibxRemoveClass("hp-chg-pwd-error");
		}
*/		
	},
	
	initData: function(userID)
	{
		this.element.find(".hp-reboot-user-name").ibxWidget('option', 'text', userID).prop('title', "Read-only - " + userID);
		this.element.find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_change_password"));
	},
});


//# sourceURL=changePassword.js