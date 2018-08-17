export var activity_collection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme:{
		$save: function(obj) {
			{
				var DateParser = webix.Date.dateToStr("%d-%m-%Y");
				obj.DueDate = DateParser(obj.DateParser);
			}
		},
		$init: function(obj) {
			{
				var DateParser = webix.Date.strToDate("%d-%m-%Y");
				obj.DueDate = DateParser(obj.DueDate);
                
			}
		}
	}
});