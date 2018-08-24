import {JetView} from "webix-jet";
import TypePopupView from "views/status_activity_popup_form";
import StatusTypeTable from "views/statusTypeTable";
import ActivityTypeTable from "views/activityTypeTable";

export default class Settings extends JetView {
	config() {
		
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();


		var localeSelector = {
			name: "lang", optionWidth: 120, view: "segmented", label: _("Language"), options: [
				{ id: "en", value: _("English") },
				{ id: "ru", value: _("Russian") }
			], click: () => this.toggleLanguage(),value: lang
		};
        
		var tabViewDataTables =  {
			view: "tabview",
			cells: [
				{
					header: _("Status Type"),
					localId: "StatusesView",
					body: {
						rows: [
							StatusTypeTable,
							{ cols: [
								{view:"spacer"},
								{view: "spacer"},
								{view:"button",value: _("Add statuses type"),autowidth:true,
									click:() => {
										this._jetPopup.showWindow("Add statuses type");
										this.show("settings?id=addStatuses");
									}}
							]
							}
						]
					}
				},
				{
					header: _("Activity Type"),
					localId: "ActivitiesView",
					body: {
						rows: [
							ActivityTypeTable,
							{cols: [
								{view:"spacer"},
								{view: "spacer"},
								{view:"button",value: _("Add activities type"),autowidth:true,
									click:() => {
										this._jetPopup.showWindow("Add activity type");
										this.show("settings?id=addActivity");
									}}       
							]
							}
						]
					}
				}
			]
		};
        
		return {
			rows: [{
				cols: [
					{view: "spacer"},
					{view: "spacer"},
					localeSelector
				]
			},
			{view:"spacer"},
			tabViewDataTables,
			]
		};
	}
    
	init() {
		this._jetPopup = this.ui(TypePopupView);
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name: "lang" }).getValue();
		langs.setLang(value);
	}
}