export var activity_type_collection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init(obj) {
			obj.value = obj.Value;
		}
	}
});