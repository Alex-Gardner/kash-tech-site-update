/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

$.ibi.TOAST_TYPE_INFO 		= "info";
$.ibi.TOAST_TYPE_SUCCESS 	= "success";
$.ibi.TOAST_TYPE_WARNING 	= "warning";
$.ibi.TOAST_TYPE_ERROR		= "error";

const removeToastAlert = () => $('.toast-alert').each(function () { $(this).remove(); });
const toastAlertWidget = ({ type, title, message, autoclose = 5000 }) => {
    // Remove active alert
	removeToastAlert();
	
	let iconType;
	switch(type) 
	{
		case $.ibi.TOAST_TYPE_INFO:
			iconType = "fa-comment-alt";
			break;
		case $.ibi.TOAST_TYPE_SUCCESS:
			iconType = "fa-check";
			break;
		case $.ibi.TOAST_TYPE_WARNING:
			iconType = "fa-bell";
			break;
		case $.ibi.TOAST_TYPE_ERROR:
			iconType = "fa-asterisk";
			break;
		default:
			iconType = "fa-check";		
	} 

    const widget =
        $(
            `<div class="toast-alert ${type}" data-ibx-type="ibxDialog">
                <div class="ta-info-icon"><i class="fas ${iconType}"></i></div>
                <div class="ta-center">
                    <div class="ta-title">${SharedUtil.htmlEncode(title)}</div>
                    <div role="alert" class="ta-message">${SharedUtil.htmlEncode(message)}</div>
                 </div>
                <div tabindex="0" class="ta-close"><i class="fas fa-times"></i></div>
            </div>`
        );
    let timer;
    widget.find(".ta-close").on("click", () => {
        window.clearTimeout(timer);
        widget.remove();
    });
    widget.find(".ta-close").on("keydown", (e) => {
        if (e.keyCode === 13 || e.keyCode === 32) {
            window.clearTimeout(timer);
            widget.remove();
        }
    });
    if (autoclose)
        timer = window.setTimeout(() => {
            widget.remove();
        }, autoclose);
    return widget;
};

