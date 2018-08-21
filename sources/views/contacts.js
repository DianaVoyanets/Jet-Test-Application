import {JetView} from "webix-jet";
import {contacts_collection} from "models/contacts-collection";

export default class Contacts extends JetView {
	config() {
		var contactsList = {
			rows: [{	
				view: "list",
				id: "contacts-list",
				select: true,
				css: "contacts_list",
				template:(obj) => {
					return (
						`<div>
                        ${obj.Photo ? `<img class="list_photo" src='${obj.Photo}'><span class="list-information">${obj.FirstName} ${obj.LastName}</span>` : `<div class='webix_icon fa-info-circle list_photo_info_circle'></div><span class="list-information">${obj.FirstName} ${obj.LastName}</span>`}</div>`
					);
				},
				on: {
					"onAfterSelect": (id) => {
						var path =  "/top/contacts?id="+ id + "/contactsInformation";
						webix.delay(() => {
							this.app.show(path);
						});
					},
				},
			},
			{ 
				view: "button",
				id:"add_button",
				type:"iconButton",
				icon: "plus",
				label:"Add contacts",
				css: "add_contact",
				width: 350,
				click: () => {
					this.show("contactsForm");
				} 
			}]
		};
        
		var ui = {
			rows:[{
				cols: [
					contactsList,
					{$subview: true},        
				]}
			]
		};
		return ui;  
	}
    
	getContactsList() {
		return this.$$("contacts-list");
	}

	init() {
		this.getContactsList().sync(contacts_collection);
		this.on(this.app,"onDataDelete",() => this.getContactsList().select(this.getContactsList().getFirstId()));
	}

	urlChange() {
		contacts_collection.waitData.then(()=>{
			var id = this.getParam("id") || contacts_collection.getFirstId();
			if (contacts_collection.exists(id)) {
				this.getContactsList().select(id);
			}
			else {
				this.getContactsList().select(this.getContactsList().getFirstId());
				this.getContactsList().showItem(id);
			}
		});
	}
}