import {JetView} from "webix-jet";
import {activity_type_collection} from "models/activityType-collection";
import {activity_collection} from "models/activity-collection";
import PopupView from "./form_activity";
import {files_collection} from "../models/files";

export default class contactsMultiview extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		var contactsTabview = {
			view: "tabview",
			cells: [
				{
					header: _("Activities"),
					body: {
						rows: [{
							view: "datatable",
							localId: "activities_datatable",
							columns:[
								{ id:"State",header:"",template:"{common.checkbox()}",width: 50,value: true},
								{ id:"TypeID", header:[{content:"selectFilter"}], width:250,sort:"string",options: activity_type_collection,fillspace:true},
								{ id:"DueDate", header:[{ content:"datepickerFilter"}],width:250,sort:"date", format:webix.i18n.dateFormatStr},
								{ id:"Details", header:[{content:"textFilter"}],width:250,sort:"string",fillspace:true},
								{ id:"pencil-icon", header:"",template: "{common.editIcon()}",width:50},
								{ id:"trash-icon", header: "",template: "{common.trashIcon()}",width:50},
							],
							on: {
								onAfterFilter: () => {
									this.$$("activities_datatable").filter((obj) => {
										return obj.ContactID == this.getId();
									}, "", true);
								},
							},
							onClick: {
								"fa-pencil": (e, id) => {
									this._jetPopup.showContactsWindow(id);
								},
								"fa-trash": function(e, id) {
									webix.confirm({
										text:"Do you still want to remove field?",
										callback: function(result) {
											if(result) {
												activity_collection.remove(id);
												return false;
											}
										}
									});
								}
							},
						},
						{cols:[
							{ view:"spacer" }, { view:"spacer" },
							{ view:"button",type:"iconButton",icon: "plus",label: _("Add activity"),autowidth:true,
								click: () => {
									this._jetPopup.showContactsWindow(this.getId());
								}
							} 
						]},
						],
					},
				},
				{
					header: _("Files"),
					body: {
						rows:[{
							view: "datatable",
							localId: "filesDatatable",
							columns: [
								{id:"name",header:_("Name"),fillspace:true},
								{id:"lastModifiedDate",header:_("Change date"),width: 150,format: "%d-%m-%Y"},
								{id:"size",header:_("Size"),width: 150},
								{id:"trash-icon",header: "",template: "{common.trashIcon()}"}
							],
							onClick: {
								"fa-trash": function(e, id) {
									webix.confirm({
										text:"Do you still want to remove field?",
										callback: function(result) {
											if(result) {
												files_collection.remove(id);
												return false;
											}
										}
									});
								}
							}
						},
						{ cols: [
							{view: "spacer"},
							{
								view: "uploader",
								autowidth:true,
								label: _("Upload file"),
								type: "iconButton", 
								icon: "cloud-upload",
								on: {
									onBeforeFileAdd: (upload) => {
										let file = upload.file;
										let reader = new FileReader();
										
										reader.onload = () => {
											let date = webix.i18n.dateFormatStr(new Date());
											files_collection.add({ name: file.name,lastModifiedDate: date,size: file.size,ContactID:this.getId() });
										};
										reader.readAsDataURL(file); 
										return false;
									}
								}
							},
							{view: "spacer"}
						]}
						]
					}
				}]
		};
        
		return contactsTabview;
	}
    
	getId() {
		return this.getParam("id", true);
	}

	init() {
		this._jetPopup = this.ui(PopupView);
	}

	urlChange() {
		let filesDatatable = this.$$("filesDatatable");
		let activitiesDatatable = this.$$("activities_datatable");
        
		activity_collection.waitData.then(() => {
			activitiesDatatable.sync(activity_collection, () => {
				activitiesDatatable.filter((obj) => {
					return obj.ContactID == this.getId();
				});
			});
			filesDatatable.sync(files_collection,() => {
				filesDatatable.filter((obj) => {
					return obj.ContactID == this.getId();
				});
			});
		});
	}
}

    