export var contacts_collection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme:{
		$init: function(obj) { 
			obj.value = obj.FirstName + " "  + obj.LastName;
			var DateParser = webix.Date.strToDate("%d-%m-%Y");
			obj.Birthday = DateParser(obj.Birthday);
		},
		$save: function(obj) {
			var DateParser = webix.Date.dateToStr("%d-%m-%Y");
			obj.Birthday = DateParser(obj.Birthday);

		},
	},
});