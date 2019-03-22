sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"br/com/idxtecMovimentaContaBancaria/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("br.com.idxtecMovimentaContaBancaria.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createViewModel(), "view");
			
			this.getRouter().initialize();
			
			jQuery.sap.registerModulePath("idxtec.lib.fragment", "/resources/idxtec/lib/fragment");
		},
		
		getContentDensityClass: function(){
			if(!this._sContentDensityClass){
				if(!sap.ui.Device.support.touch){
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});