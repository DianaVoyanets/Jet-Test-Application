import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView{
	config(){	
		var menu = {
			view: "menu",
			select: true,
			id:"top:menu", 
			width: 180, 
			layout:"y",
			template:"<span class='webix_icon fa-#icon#'></span> #value# ",
			data:[
				{ value:"Contacts", id:"contacts", icon:"users"},
				{ value:"Activities",id:"activityTable",icon:"calendar"},
				{ value:"Settings",id:"settings",icon:"cogs"}
			]
		};

		var ui = {
			type: "line",  rows: [
				{ view: "toolbar",elements: [{type: "header", id: "topLabel", template: "#value#", css: "topLabel"}]},
				{
					cols: [
						{
							type: "clean", css: "app-left-panel", 
							padding: 10, margin: 20, borderless: true, rows: [menu]
						},
						{
							rows: [{ height: 10 },
								{
									type: "clean", css: "app-right-panel", padding: 4, rows: [
										{ $subview: true }
									]
								}
							]
						}
					]
				}]
		};

		return ui;
	}
    
	init() {
		this.use(plugins.Menu, "top:menu");
		this.$$("topLabel").bind(this.$$("top:menu"));
	}
}