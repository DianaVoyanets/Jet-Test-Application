import {JetView} from "webix-jet";
import {activity_type_collection} from "models/activityType-collection";
import {status_collection} from "models/status-collection";


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
					body: {
						rows: [
							{	view: "datatable",
								localId: "statusTypeTable",
								editable:true,
								columns: [
									{id:"id",header:""},
									{id:"Value",header:"Value",width: 300,editor:"text"},
									{id:"Icon",header:"Icon",width: 300,editor:"text"},
									{id:"trash-icon",header: "",template: "{common.trashIcon()}",fillspace:true},
								],
								onClick: {
									"fa-trash": function(e, id) {
										webix.confirm({
											text:"Do you still want to remove field?",
											callback: function(result) {
												if (result) {
													status_collection.remove(id);
													return false;
												}
											}
										});
									}
								}
							},

							{ cols: [
								{view:"spacer"},
								{view: "spacer"},
								{view:"button",value: "Add statuses type",autowidth:true}
							]
							}
						]

					}
				},
				{
					header: _("Activity Type"),
					body: {
						rows: [
							{
								view: "datatable",
								localId: "activityTypesTable",
								editable:true,
								columns: [
									{id:"id",header:""},
									{id:"Value",header:"Value",width: 300,editor:"text"},
									{id:"Icon",header:"Icon",width: 300,editor:"text"},
									{id:"trash-icon",header: "",template: "{common.trashIcon()}",fillspace:true}
								],
								onClick: {
									"fa-trash": function(e, id) {
										webix.confirm({
											text:"Do you still want to remove field?",
											callback: function(result) {
												if (result) {
													activity_type_collection.remove(id);
													return false;
												}
											}
										});
									}
								}
							},
							{cols: [
								{view:"spacer"},
								{view: "spacer"},
								{view:"button",value: "Add activities type",autowidth:true}
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
		this.$$("activityTypesTable").sync(activity_type_collection);
		this.$$("statusTypeTable").sync(status_collection);
	}
    
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name: "lang" }).getValue();
		langs.setLang(value);
	}
}