sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"br/com/idxtecMovimentaContaBancaria/helpers/ContaBancariaHelpDialog",
	"br/com/idxtecMovimentaContaBancaria/services/Session"
], function(Controller, History, MessageBox, JSONModel, ContaBancariaHelpDialog, Session) {
	"use strict";

	return Controller.extend("br.com.idxtecMovimentaContaBancaria.controller.GravarMovimentoContaBancaria", {
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("gravarmovimento").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel,"model");
		},
		
		contaBancariaReceived: function() {
			this.getView().byId("contabancaria").setSelectedKey(this.getModel("model").getProperty("/ContaBancaria"));
		},
		
		handleSearchConta: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ContaBancariaHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		_routerMatch: function(){
			var oParam = this.getOwnerComponent().getModel("parametros").getData();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			this.getView().byId("contabancaria").setValue(null);
			
			if (this._operacao === "incluir"){
				
				oViewModel.setData({
					titulo: "Inserir Novo Movimento"
				});
				
				var oNovoMov = {
					"Id": 0,
					"Documento": "",
					"ContaBancaria": 0,
					"Data": new Date(),
					"Debito": 0.00,
					"Credito": 0.00,
					"Cheque": "",
					"Historico": "",
					"Conciliado": false,
					"Empresa" : Session.get("EMPRESA_ID"),
					"Usuario": Session.get("USUARIO_ID"),
					"EmpresaDetails": { __metadata: { uri: "/Empresas(" + Session.get("EMPRESA_ID") + ")"}},
					"UsuarioDetails": { __metadata: { uri: "/Usuarios(" + Session.get("USUARIO_ID") + ")"}}
				};
				
				oJSONModel.setData(oNovoMov);
				
			} else if (this._operacao === "editar"){
				
				oViewModel.setData({
					titulo: "Editar Movimento"
				});
				
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					}
				});
			}
		},
		
		onSalvar: function(){
			if (this._checarCampos(this.getView()) === true) {
				MessageBox.information("Preencha todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createMov();
			} else if (this._operacao === "editar") {
				this._updateMov();
			}
		},
		
		_goBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("movimentoconta", {}, true);
			}
		},
		
		_getDados: function() {
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oDados = oJSONModel.getData();
			
			oDados.ContaBancariaDetails = {
				__metadata: {
					uri: "/ContaBancarias(" + oDados.ContaBancaria + ")"
				}
			};

			return oDados;
		},
		
		_createMov: function() {
			var that = this; 
			var oModel = this.getOwnerComponent().getModel();

			oModel.create("/MovimentoContaBancarias", this._getDados(), {
				success: function() {
					MessageBox.success("Movimento inserido com sucesso!",{
						onClose: function(){
							that._goBack();
						}
					});
				}
			});
		},
		
		_updateMov: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();

			oModel.update(this._sPath, this._getDados(), {
					success: function() {
					MessageBox.success("Movimento alterado com sucesso!", {
						onClose: function(){
							that._goBack();
						}
					});
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("contabancaria").getSelectedItem() === null || oView.byId("data").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack();
		},
		
		getModel : function(sModel) {
			return this.getOwnerComponent().getModel(sModel);	
		}
	});
});