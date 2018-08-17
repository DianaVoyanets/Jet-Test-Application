import {JetView} from "webix-jet";
import {activity_collection} from "models/activity-collection";
import {activity_type_collection} from "models/activityType-collection";
import {contacts_collection} from "models/contacts-collection";
import PopupView from "./form-activity";

export default class DataView extends JetView {
	config() {
        
		var toolbar = {
			view: "toolbar",
			elements: [
				{view: "spacer"},
				{view: "button",name:"Add",id:"add_button",type:"htmlbutton",label:"<i class='fa fa-plus-square'> Add activity</i>",width:120,
					click:() => {
						this._jetPopup.showWindow();
					}
				}
			]
		};

		var activityTable = {
			view:"datatable",
			localId: "activityDataTable",
			columns:[
				{ id:"State",header:"",template:"{common.checkbox()}",width: 50,value: true},
				{ id:"TypeID", header:["Activity type",{content:"selectFilter"}], width:250,sort:"string",options: activity_type_collection,fillspace:true},
				{ id:"DueDate", header:["Due data",{ content:"datepickerFilter"}],width:250,sort:"date", format:webix.i18n.dateFormatStr},
				{ id:"Details", header:["Details",{content:"textFilter"}],width:250,sort:"string"},
				{ id:"ContactID", header:["Contact",{content:"selectFilter"}],width:250,sort:"string",options: contacts_collection},
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
							if(result) {
								activity_collection.remove(id);
								return false;
							}
						}
					});
				}
			},	
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
}