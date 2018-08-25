import {JetView} from "webix-jet";
import {contacts_collection} from "models/contacts-collection";

export default class Contacts extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		var contactsList = {
			rows: [
				{view:"search", localId:"search_contacts",placeholder: "search...",
					on: {
						"onTimedKeyPress":function() {
							var value = this.getValue().toLowerCase();
							this.$scope.$$("contacts-list").filter((obj) => {
								for (let key in obj) {
									if (key !== "id" && key !== "StatusID" && key !== "Photo" && obj[key].toString().toLowerCase().indexOf(value) !== -1)
										return true;
								}
							});
						}
					}},
				{	
					view: "list",
					id: "contacts-list",
					select: true,
					css: "contacts_list",
					template:(obj) => {
						return (
							`<div>${obj.Photo && obj.Photo !== " " ?
								`<img class="list_photo" src='${obj.Photo}'><span class="list-information">${obj.FirstName} ${obj.LastName}</br>${obj.Email}</span>` 
								: `<div class='webix_icon fa-info-circle list_photo_info_circle'></div><span class="list-information">${obj.FirstName} ${obj.LastName}</br>${obj.Email}</span>`}</div>`
						);
					},
					on: {
						"onAfterSelect": (id) => {
							this.show("contactsInformation");
							this.setParam("id", id, true);
						},
					},
                
				},
				{ 
					view: "button",
					id:"add_button",
					type:"iconButton",
					icon: "plus",
					label:_("Add contacts"),
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
		this.on(this.app,"onDataDelete",() => this.getContactsList().select(contacts_collection.getFirstId()));
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