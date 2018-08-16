import {JetView} from "webix-jet";
import {contacts_collection} from "models/contacts-collection";

export default class Contacts extends JetView {
	config() {
        
		var contactsList = {
			rows: [{	
				view: "list",
				id: "contacts-list",
				select: true,
				gravity: 0.5,
				css: "contacts_list",
				template:"<div>#FirstName# #LastName#<br>#Email#</div>",
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
				name:"Add",
				id:"add_button",
				type:"htmlbutton",
				label:"<i class='fa fa-plus-square'> Add contact</i>",
				width: 350,
				click: () => this.show("settings")
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
    
	init() {
		this.$$("contacts-list").sync(contacts_collection);
	}

	urlChange(view) {
		contacts_collection.waitData.then(()=>{
			var id = this.getParam("id") || contacts_collection.getFirstId();
			if (contacts_collection.exists(id)) {
				view.queryView({view:"list"}).select(id);
			}
		});
	}
}