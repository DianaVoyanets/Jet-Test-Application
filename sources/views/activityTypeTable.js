import {JetView} from "webix-jet";
import {activity_type_collection} from "models/activityType-collection";

export default class ActivityTypesTable extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "activityTypesTable",
			columns: [
				{id:"id",header:""},
				{id:"Value",header:"Value",width: 300},
				{id:"Icon",header:"Icon",width: 300},
				{id:"trash-icon",header: "",template: "{common.trashIcon()}",fillspace:true}
			],
		};
	}
	init() {
		this.$$("activityTypesTable").sync(activity_type_collection);
	}
}