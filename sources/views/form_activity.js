import {JetView} from "webix-jet";
import {activity_collection} from "models/activity-collection";
import {activity_type_collection} from "models/activityType-collection";
import {contacts_collection} from "models/contacts-collection";

export default class PopupView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view:"window", 
			move:true,
			localId: "form-popup",
			head:"#value#",
			position:"center",
			width: 500,
			body:{
				view:"form",
				localId: "form",
				elements:[
					{ view:"textarea",labelWidth:100,label:_("Details"), name:"Details",invalidMessage:"Type can not be empty",required:true},
					{ view:"combo", labelWidth:100,label:_("Type"), name:"TypeID",options: { body:{template:"#Value#",data:activity_type_collection}},invalidMessage:"Type can not be empty",required:true},
					{ localId: "contact",labelWidth:100,view:"combo", label:_("Contacts"), name:"ContactID",options: { body:{template:"#FirstName#"+ " " + "#LastName#",data:contacts_collection}},invalidMessage:"Contact can not be empty",required:true},
					{ margin:5, cols:[
						{ view:"datepicker", labelWidth:100,label:_("Data"),name:"DueDate",format:"%d-%m-%Y"},
						{ view:"datepicker", label:"Time",type:"time",name: "Time"}
					]},
					{ view: "checkbox",labelWidth:104,label:_("CompletedForm"),name:"State",css:"checkboxLabel"},
					{ cols: [
						{ view:"spacer"},
						{ view:"button",localId:"add_save_button",width: 110,
							click: () => {
								this.saveDate();
							}
						},
						{ view:"button",value: _("Cancel"),width: 110,click:()=> this.$$("form-popup").hide()},
					]}
				],
				rules: {
					"Details": webix.rules.isNotEmpty,
					"TypeID":webix.rules.isNotEmpty,
					"ContactID":webix.rules.isNotEmpty,
				},
				autoheight:true,
				autowidth:true,
			}
		};
	}

	getForm() {
		return this.$$("form");
	}
    
	getValues() {
		return this.getForm().getValues();
	}
    
	saveDate() {
		var values = this.$$("form").getValues();
		values.Time = webix.i18n.timeFormatStr(values.Time);
		if (this.getForm().validate()) {
			if (!this.getValues().id) {
				activity_collection.add(values);
			}
			else {
				activity_collection.updateItem(values.id, values);
			}
			this.hideWindow();
		}
	}
    
	showWindow(id) {
		const _ = this.app.getService("locale")._;
		if (id) {
			let values = activity_collection.getItem(id);
			this.getForm().setValues(values);
		} else {
			this.getForm().clear();
		}
		this.getRoot().show();
		this.$$("add_save_button").setValue(id ? _("Save") : _("Add"));
		this.$$("form-popup").getHead().setHTML(id ? _("Edit activity") : _("Add activity"));
	}
    
	showContactsWindow(id) {
		const _ = this.app.getService("locale")._;
		if (typeof(id) === "object") {
			var values = activity_collection.getItem(id);
			this.getForm().setValues({ ContactID: id });
			this.$$("form").setValues(values);
		} else {
			this.getForm().setValues({ ContactID: id });
		}
		this.$$("contact").disable();
		this.getRoot().show();
		this.$$("add_save_button").setValue(typeof(id) === "object" ? _("Save") : _("Add"));
		this.$$("form-popup").getHead().setHTML(typeof(id) === "object" ? _("Edit activity") : _("Add activity"));
	}
    
	hideWindow() {
		this.getForm().hide();
		this.getForm().clear();
		this.getForm().clearValidation();
	}
}

