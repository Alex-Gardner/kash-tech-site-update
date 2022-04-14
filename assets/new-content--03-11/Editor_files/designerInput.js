/*------------------------------------*/
/*                                    */
/*         IBX Time Picker           */
/*                                    */
/*------------------------------------*/

$.widget("ibi.designerInput", $.ibi.ibxHBox, {
    options: {
        "cancelButton" : true

    },

    _widgetClass: "designer-input",

    _create: function () {
        this._super();

        //Create Components
        this._textField = $('<div class="designer-input-text" tabIndex="0">').ibxTextField();

        //Add Components to Element
        this.element.ibxWidget("add",this._textField);


        if(this.options.cancelButton){
            this._cancelButton = $('<div class="designer-input-button" tabIndex="0" data-ibxp-glyph-classes="fa fa-times">').ibxButton();
            this.element.ibxWidget("add", this._cancelButton);

            this._cancelButton.on("click", this.clear.bind(this));
        }
    },

    _setOption: function(key, value){
        this._super(key, value);
    },

    _buttonList: [],

    addButton:function(buttonGlyphClass, buttonFunction){
        var button = $('<div class="designer-input-button" tabIndex="0" data-ibxp-glyph-classes="'+buttonGlyphClass+'">').ibxButton();
        this.element.ibxWidget("add", button);
        button.on("click", buttonFunction);

        this._buttonList.push(button);
    },

    removeButton: function(index){
        var buttonTarget = this._buttonList[index];
        if(!buttonTarget){
            throw("Invalid index");
        }

        this.element.ibxWidget("remove", buttonTarget);
        this._buttonList.splice(index, 1); //remove button from list
    },

    clear: function(){
        this._textField.ibxWidget("value", "");
    }





});