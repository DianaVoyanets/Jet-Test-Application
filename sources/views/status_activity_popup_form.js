import {JetView} from "webix-jet";
import {status_collection} from "../models/status-collection";
import {activity_type_collection} from "../models/activityType-collection";

export default class TypePopupView extends JetView {
	config() {
		return {
			view:"window", 
			move:true,
			localId: "form-popup",
			head:"#value#",
			position:"center",
			width: 400,
			body:{
				view:"form",
				localId: "form",
				elements:[
					{ view:"text",label:"Value", name:"Value",invalidMessage:"Type can not be empty",required:true},
					{ view:"text", label:"Icon", name:"Icon",invalidMessage:"Type can not be empty",required:true},
					{ cols: [
						{view:"spacer"},
						{view:"button",value: "Add",width:100,
							click: () => {
								this.saveData();
							}
						},
						{view:"button",value: "Cancel",width:100,click:()=> this.$$("form-popup").hide()},
					]}
				],
				rules: {
					"Value": webix.rules.isNotEmpty,
					"Icon":webix.rules.isNotEmpty,
				},
				autoheight:true,
				autowidth:true,
			}
		};
	}
    
	saveData() {
		let values = this.$$("form").getValues();
		if(this.$$("form").validate()) {
			let id = this.getParam("id",true);
			if(id == "StatusesView") {
				status_collection.add(values);
			} else {
				activity_type_collection.add(values);
			}
		}
		this.$$("form").hide();
		this.$$("form").clear();
	}
    
	showWindow(headValue) {
		this.$$("form-popup").getHead().setHTML(headValue);
		this.getRoot().show();
	}
}