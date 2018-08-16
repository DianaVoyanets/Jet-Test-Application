import {JetView} from "webix-jet";

export default class ContactsForm extends JetView{
	config() {

		var contactsForm =  {
			view: "form",
			cols: [
				{
					rows: [
						{view: "text",label: "First name",name:"FirstName"},
						{view: "text",label: "Last name",name:"LastName"},
						{view: "datepicker",label: "Joining date",name:"StartDate"},
						{view: "text",label: "Status",name:"StatusID"},
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
					{ view: "button",value: "Cancel"},
					{ view: "button",value: "Save/Edit"}
				]},
			]
		};
		var ui = {
			rows: [
				contactsForm,
				{view:"spacer"}
			]
		};
		return ui;
	}
}