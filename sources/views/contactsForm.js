import {JetView} from "webix-jet";
import {contacts_collection} from "models/contacts-collection";
import {status_collection} from "models/status-collection";

export default class ContactsForm extends JetView {
	config() {
		var contactsForm =  {
			view: "form",
			localId: "contacts_form",
			cols: [
				{ margin: 15,rows: [
					{view:"text",label:"First name",name:"FirstName",invalidMessage:"First Name can not be empty",width: 400},
					{view:"text",label:"Last name",name:"LastName",invalidMessage:"Last Name can not be empty"},
					{view:"datepicker", label:"Joining date",name:"StartDate"},
					{view:"combo",label:"Status",name:"StatusID",options: { body:{template:"#Value#"+ " " + "#Icon#",data:status_collection}}},
					{view:"text",label:"Job",name:"Job"},
					{view:"text",label:"Company",name:"Company"},
					{view:"text",label:"Website",name:"Website"},
					{view:"text",label:"Address",name:"Address"}
				]},
				{ margin: 15,rows: [
					{ view:"text",label:"Email",name:"Email",invalidMessage: "",width: 380 },
					{ view:"text",label:"Skype",name:"Skype"},
					{ view:"text",label:"Phone",name:"Phone",invalidMessage: "Phone number can not be string"},
					{ view:"datepicker",label:"Birthday",name: "Birthday",format:"%d-%m-%Y"},
					{cols:[
						{ localId:"userPhotoForm",width:200,height:150,
							template: (obj) => {
								return `${obj.src ? 
									`<img class="user_photo_form" src='${obj.src}'>` : 
									"<div class='webix_icon fa-info-circle form_user_photo'></div>"}`;
							},
						},
						{ margin: 7,css:"change-remove-buttons",rows: [
							{   view: "uploader",
								accept:"image/jpeg, image/png",
								value: "Change photo", 
								autosend:false, 
								multiple:false,
								on: {
									onBeforeFileAdd: (upload) => {
										let file = upload.file;
										let reader = new FileReader();
    
										reader.onload = (event) => {
											this.getUserPhotoForm().setValues({ src: event.target.result });
											this.getContactsForm().setValues({ Photo: event.target.result }, true);
										};

										reader.readAsDataURL(file);
										return false;
									}
								}
							},
							{view: "button",value: "Delete photo",width: 120,
								click: () => {
									let id = this.getParam("id",true);
									this.getUserPhotoForm().setValues({});
									if (id) {
										this.getContactsForm().setValues({ Photo: "" }, true);
									}
								}
							}
						]}
					]},
					{cols: [
						{ view: "button",value: "Cancel",click:() => this.show("contactsInformation")},
						{ view: "button",localId:"add_save_button",
							click:() => {
								this.saveDate();
							}
						}
					]},
				]},
			],
			rules: {
				"FirstName": webix.rules.isNotEmpty,
				"LastName": webix.rules.isNotEmpty,
				"Email": webix.rules.isEmail,
				"Phone": webix.rules.isNumber
			},
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

	getContactsForm() {
		return this.$$("contacts_form");
	}
    
	getUserPhotoForm() {
		return this.$$("userPhotoForm");
	}

	init() {
		let id = this.getParam("id");
		contacts_collection.waitData.then(() => {
			this.getContactsForm().setValues(contacts_collection.getItem(id));
			this.getUserPhotoForm().setValues({src: contacts_collection.getItem(id).Photo});
		});
		this.$$("add_save_button").setValue(id ? "Save" : "Add");
		this.$$("edit_add_label").setValue(id ? "Edit contact" : "Add new contact");
	}
    
	saveDate() {
		if (this.getContactsForm().validate()) {
			if (!this.getContactsForm().getValues().id) {
				contacts_collection.add(this.getContactsForm().getValues());
			}
			else {
				contacts_collection.updateItem(this.getContactsForm().getValues().id,this.getContactsForm().getValues());
			}
			this.show("contactsInformation");
		}
	}
}
