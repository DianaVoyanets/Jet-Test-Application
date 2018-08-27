import {JetView} from "webix-jet";
import {contacts_collection} from "models/contacts-collection";
import {activity_collection} from "models/activity-collection";
import {status_collection} from "models/status-collection";
import contactsMultiview from "views/contactsMultiview";
import {files_collection} from "models/files";

export default class ContactsInformation extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
				label: _("Delete"),
				width: 120,
				click: () => {
					let app = this.app;
					let id = this.getParam("id",true);
					webix.confirm({
						text: "Do you still want to remove this contact?",
						callback: function(result) {
							if (result) {
								let activitiesIds = activity_collection
									.find((activity) => activity.ContactID == id)
									.map((activity) => activity.id);
                                
								let filesIds = files_collection
									.find((file) => file.ContactID == id)
									.map((file) => file.id);
                                
								activity_collection.remove(activitiesIds);
								files_collection.remove(filesIds);
								contacts_collection.remove(id);
								app.callEvent("onDataDelete",[]);
							}
						}
					});
				}},
			{
				view: "button",
				type: "icon",
				icon: "edit",
				label: _("Edit"),

				width: 120,
				click: () => {
					this.show(`contactsForm?id=${this.getId()}`);
				}
			}]
		};
         
		var avatarTemplate = {
			view: "template", 
			localId: "avatar-template",
			gravity: 0.5,
			template:(obj) => {				
				return (
					`${obj.Photo && obj.Photo !==" "? 
						`<figure class='user-photo'><img src='${obj.Photo}'><figcaption><b>${obj.Icon}</b></figcaption></figure>` : 
						`<div class='webix_icon fa-info-circle user_photo_template'></div><div class="photo_icon"><b>${obj.Icon}</b></div>`
					}`
				);
			} 
		};

		var iconTemplate = {
			view: "template", 
			localId:"icon-template",
			template: (obj) =>{
				return (
					`<div class='wrapper'> 
                        <div class="col-2">
                            <span><i class='fa fa-envelope'> <b>${_("Email")}:</b> </i>${obj.Email}</span>
                            <span><i class='fa fa-skype'> <b>${_("Skype")}:</b></i>${obj.Skype}</span>
                            <span><i class='fa fa-tag'> <b>${_("Job")}:</b></i>${obj.Job}</span>
                        </div>
                        <div class="col-3">
                            <span><i class='fa fa-briefcase'> <b>${_("Company")}:</b></i>${obj.Company}</span>
                            <span><i class='fa fa-calendar'> <b>${_("Date of birth")}:</b> </i>${ webix.i18n.longDateFormatStr(obj.Birthday)}</span>
                            <span><i class='fa fa-map-marker'> <b>${_("Location")}:</b></i>${obj.Address}</span>
                        </div>
                    </div>`
				);
			}
		};
        
		var ui = {
			rows: [
				toolbar,
				{cols: [
					avatarTemplate,
					iconTemplate,
				]},
				contactsMultiview,
			],
		};
        
		return ui;
	}
    
	getId() {
		return this.getParam("id",true);
	}
    
	urlChange() {
		let avatarTemplate = this.$$("avatar-template");
		webix.promise.all([contacts_collection.waitData,status_collection.waitData]).then(()=>{
			if (this.getId() && contacts_collection.exists(this.getId())) {
				let contactsValues = contacts_collection.getItem(this.getId());
                
				this.$$("mylabel").setValue(contactsValues.FirstName + " " + contactsValues.LastName);
				this.$$("icon-template").setValues(contactsValues);
                
				let statusValueId = contactsValues.StatusID;
				if (!status_collection.exists(statusValueId)) {
					avatarTemplate.parse({
						Value: "No Status", 
						Icon: "No Icon",
						Photo: contactsValues.Photo
					});
				} else {
					avatarTemplate.setValues({
						...status_collection.getItem(statusValueId),
						Photo: contactsValues.Photo
					});
				}
			}
		});
		
	}
}
