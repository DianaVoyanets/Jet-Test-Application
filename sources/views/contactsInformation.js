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
         
		var avatarTemplate = {
			view: "template", 
			localId: "avatar-template",
			gravity: 0.6,
			template: 
                `<div class="col-1">
                    <figure><div class='avatar'></div><figcaption>#Value# #Icon#</figcaption</figure>
                </div>`
		};

		var iconTemplate = {
			view: "template", 
			localId:"icon-template",
			template:
                `<div class='wrapper'> 
                    <div class="col-2">
                        <span><i class='fa fa-envelope'> email: </i>#Email#</span>
                        <span><i class='fa fa-skype'> skype: </i>#Skype#</span>
                        <span><i class='fa fa-tag'> job: </i>#Job#</span>
                    </div>
                    <div class="col-3">
                        <span><i class='fa fa-briefcase'> company: </i>#Company#</span>
                        <span><i class='fa fa-calendar'> date of birth: </i>#Birthday#</span>
                        <span><i class='fa fa-map-marker'> location: </i>#Company#</span>
                    </div>
                </div>`
		};

		var ui = {
			rows: [
				toolbar,
				{cols: [
					avatarTemplate,
					iconTemplate
				]}

			],
		};
        
		return ui;
	}
    
	urlChange(view) {
		let id = this.getParam("id");
		webix.promise.all([contacts_collection.waitData,status_collection.waitData]).then(()=>{
			if (id && contacts_collection.exists(id)) {
				let contactsValues = contacts_collection.getItem(id);
                
				view.queryView({view:"label"}).setValue(contactsValues.FirstName + " " + contactsValues.LastName);
				this.$$("icon-template").setValues(contactsValues);
		
				let statusValueId = contactsValues.StatusID;
				if (!status_collection.exists(statusValueId)) {
					this.$$("avatar-template").parse({Value: "No Status",Icon: "No Icon"});
				}
			}
		});
		
	}
}
