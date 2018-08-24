import {JetView} from "webix-jet";
import {activity_collection} from "models/activity-collection";
import {activity_type_collection} from "models/activityType-collection";
import {contacts_collection} from "models/contacts-collection";
import PopupView from "./form_activity";

export default class DataView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		var toolbar = {
			view: "toolbar",
			elements: [
				{ view:"segmented",localId: "selector",options:[
					{id:"all",value:_("All")},
					{id:"overdue",value:_("Overdue")},
					{id:"completed",value:_("Completed")},
					{id:"today",value:_("Today")},
					{id:"tomorrow",value:_("Tomorrow")},
					{id:"week",value:_("This week")},
					{id:"month",value:_("This month")}
				],
				on:{
					onChange:() =>
						this.$$("activityDataTable").filterByAll()
				}
				},
				{ view: "button",name:"Add",id:"add_button",type:"iconButton",icon: "plus",label: _("Add activity"),autowidth:true,
					click:() => {
						this._jetPopup.showWindow();
					}
				},
			]
		};

		var activityTable = {
			rows: [
				{
					view:"datatable",
					localId: "activityDataTable",
					columns:[
						{ id:"State",header:"",template:"{common.checkbox()}",width: 50,value: true},
						{ id:"TypeID", header:[_("Activity type"),{content:"selectFilter"}], width:250,sort:"string",options: activity_type_collection,fillspace:true},
						{ id:"DueDate", header:[_("Due data"),{ content:"datepickerFilter"}],width:250,format:webix.i18n.dateFormatStr},
						{ id:"Details", header:[_("Details"),{content:"textFilter"}],width:250,sort:"string"},
						{ id:"ContactID", header:[_("Contact"),{content:"selectFilter"}],width:250,sort:"string",options: contacts_collection},
						{ id:"pencil-icon", header:"",template: "{common.editIcon()}",width:50},
						{ id:"trash-icon", header: "",template: "{common.trashIcon()}",width:50},
					],
					onClick: {
						"fa-pencil": (e, id) => {
							this._jetPopup.showWindow(id);
						},
						"fa-trash": function(e, id) {
							webix.confirm({
								text:"Do you still want to remove field?",
								callback: function(result) {
									if (result) {
										activity_collection.remove(id);
										return false;
									}
								}
							});
						}
					},
				},
			]	
		};

		var ui = {
			rows: [
				toolbar,
				activityTable
			]
		};
        
		return ui;
	}
    
	init() {
		this._jetPopup = this.ui(PopupView);
		this.$$("activityDataTable").sync(activity_collection);
	}
    
	ready() {
		this.$$("activityDataTable").registerFilter(
			this.$$("selector"),
			{ compare: function(value,filter,obj) {
				let dueDate = obj.DueDate;
				let nowDate = new Date();
				switch(filter) {
					case "overdue": return nowDate - dueDate > 0 && obj.State === "0";
					case "completed": return obj.State === "1";
					case "today": return webix.Date.equal(webix.Date.dayStart(dueDate),webix.Date.dayStart(nowDate));
					case "tomorrow": return webix.Date.equal( webix.Date.dayStart( dueDate), webix.Date.add( webix.Date.dayStart( nowDate), 1, "day"));
					case "week": return webix.Date.equal(webix.Date.weekStart(dueDate), webix.Date.weekStart(nowDate));
					case "month": return webix.Date.equal(webix.Date.monthStart(dueDate), webix.Date.monthStart(nowDate));
					default: return true;
				}
			}},
			{ getValue: function(node) {
				return node.getValue();
			}},
			{ setValue:function(node, value){
				node.setValue(value);
			}}
		);
	}
}