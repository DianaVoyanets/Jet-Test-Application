import {JetView} from "webix-jet";
import  {contacts_collection} from "models/contacts-collection";
import {status_collection} from "models/status-collection";

export default class ContactsInformation extends JetView {
	config() {
		var toolbar = {
			view: "toolbar",
			localId: "my_toolbar",
			height:50, 
			cols: [{ 
				view: "label",
				localId: "mylabel",
				label: "#FirstName# #LastName#", 
			},
			{ view: "spacer" },
			{
				view: "button",
				type: "icon",
				icon: "trash",
				label: "Delete",
				width: 90,
			},
			{
				view: "button",
				type: "icon",
				icon: "edit",
				label: "Edit",
				width: 90
			}]
		}; 
    
		var templateOne = {
			view: "template",
			localId: "templateOne",
			template: "<figure><div class='avatar'></div><figcaption>#Value# #Icon#</figcaption</figure>",
		};
        
		var templateTwo = {
			view: "template",
			localId: "templateTwo",
			template:
                "<span><i class='fa fa-envelope'> email: </i>#Email#</span>" + 
                "<span><i class='fa fa-skype'> skype: </i>#Skype#</span>" +
                "<span><i class='fa fa-tag'> job: </i>#Job#</span>" + 
                "<span><i class='fa fa-briefcase'> company: </i>#Company#</span>"
		};

		var templateThree = {
			view: "template",
			localId: "templateThree",
			template: 
                "<span><i class='fa fa-calendar'> date of birth: </i>#Birthday#</span>"+
                "<span><i class='fa fa-map-marker'> location: </i>#Company#</span>"
		};

		var ui = {
			rows: [
				toolbar,{
					gravity: 3,
					cols: [
						templateOne,
						templateTwo,
						templateThree
					],
				}
			],
		};
        
		return ui;
	}
    
	urlChange(view) {
		let id = this.getParam("id",true);
		webix.promise.all([contacts_collection.waitData,status_collection.waitData]).then(()=>{
			if (id && contacts_collection.exists(id)) {
				let contactsValues = contacts_collection.getItem(id);
                
				view.queryView({view:"label"}).setValue(contactsValues.FirstName + " " + contactsValues.LastName);
                
				this.$$("templateOne").setValues(contactsValues);
				this.$$("templateTwo").setValues(contactsValues);
				this.$$("templateThree").setValues(contactsValues);
                
				let statusValueId = contactsValues.StatusID;
				if (!status_collection.exists(statusValueId)) {
					this.$$("templateOne").parse({Value: "No Status",Icon: "No Icon"});
				}
                
				this.$$("templateOne").setValues(status_collection.getItem(statusValueId));
			}
		});
		
	}
}
