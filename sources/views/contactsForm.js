import {JetView} from "webix-jet";
import {contacts_collection} from "models/contacts-collection";
import {status_collection} from "models/status-collection";

export default class ContactsForm extends JetView{
	config() {

		var contactsForm =  {
			view: "form",
			localId: "contacts_form",
			//css: "form-input",
			cols: [
				{rows: [
					{view: "text",label: "First name",name:"FirstName"},
					{view: "text",label: "Last name",name:"LastName"},
					{view: "datepicker", label: "Joining date",name:"StartDate"},
					{view: "combo",label: "Status",name:"StatusID",options: { body:{template:"#Value#"+ " " + "#Icon#",data:status_collection}}},
					{view: "text",label: "Job",name:"Job"},
					{view: "text",label: "Company",name:"Company"},
					{view: "text",label: "Website",name:"Website"},
					{view: "text",label: "Address",name:"Address"}
				]
				},
				{ rows: [
					{ view: "text",label: "Email",name: "Email"},
					{ view:"text",label: "Skype",name: "Skype"},
					{ view: "text",label: "Phone",name: "Phone"},
					{ view: "datepicker",label: "Birthday",name: "Birthday"},
					{ view:"spacer"},
					{cols: [
						{ view: "button",value: "Cancel",click:() => this.show("contactsInformation")},
						{ view: "button",localId:"add_save_button",
							click:() => {
								this.saveDate();
								//contacts_collection.add(this.$$("contacts_form").getValues());
							}
						}
					]}
				]},
			],
			rules: "FirstName" 
		};
        
		var toolBar = {
			view: "toolbar",
			localId:"mytoolbar",
			cols: [
				{view: "label",id: "edit_add_label"}
			]
		};

		var ui = {
			rows: [
				toolBar,
				contactsForm,
				{view:"spacer"}
			]
		};
		return ui;
	}

	init() {
		let id = this.getParam("id");
		contacts_collection.waitData.then(() => {
			if(id) {
				this.$$("contacts_form").setValues(contacts_collection.getItem(id));
			}
			this.$$("add_save_button").setValue(id ? "Save" : "Add");
			this.$$("edit_add_label").setValue(id ? "Edit contact" : "Add new contact");
		});
	}
    
	// getForm() {
	// 	return this.$$("contacts_form");
	// }
    
	// getValues() {
	// 	return this.getForm().getValues();
	// }
    
	saveDate() {
		if(this.$$("contacts_form").validate()) {
			if(!this.$$("contacts_form").getValues().id) {
				contacts_collection.add(this.$$("contacts_form").getValues());
			}
			else {
				contacts_collection.updateItem(this.$$("contacts_form").getValues().id,this.$$("contacts_form").getValues());
			}
		}
		this.show("contactsInformation");
	}

	// getForm() {
	// 	return this.$$("contacts_form");
	// }
    
	// getValues() {
	// 	return this.getForm().getValues();
	// }
    
	// saveDate() {
	// 	if(this.getForm().validate()) {
	// 		if(!this.getValues().id) {
	// 			contacts_collection.add(this.getValues());
	// 		}
	// 		else {
	// 			contacts_collection.updateItem(this.getValues().id,this.getValues());
	// 		}
	// 		this.hideWindow();
	// 	}
	// }
    
	// saveData() {

	// }
}