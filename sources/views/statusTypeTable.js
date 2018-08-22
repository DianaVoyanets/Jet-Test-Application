import {JetView} from "webix-jet";
import {status_collection} from "models/status-collection";

export default class statusTypeTable extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "statusTypeTable",
			columns: [
				{id:"id",header:""},
				{id:"Value",header:"Value",width: 300},
				{id:"Icon",header:"Icon",width: 300},
				{id:"trash-icon",header: "",template: "{common.trashIcon()}",fillspace:true}
			],
		};
	}
	init() {
		this.$$("statusTypeTable").sync(status_collection);
	}
} 