import {JetView} from "webix-jet";

export default class StatusesActivitiesTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "datatable",
			localId: "dataTable",
			editable: true,
			columns: [
				{id:"id",header:""},
				{id:"Value",header:_("Value"),width: 300,editor:"text"},
				{id:"Icon",header:_("Icon"),width: 300,editor:"text"},
				{id:"trash-icon",header: "",template: "{common.trashIcon()}",fillspace:true}
			],
			onClick: {
				"fa-trash": function(e, id) {
					webix.confirm({ 
						text:"Do you still want to remove field?",
						callback:  (result) => {
							if (result) {
								this.$scope.remove(id);
							}
						}
					});
				}
			}
		};
			
	}
}

