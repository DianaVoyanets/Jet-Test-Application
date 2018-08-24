import {activity_type_collection} from "models/activityType-collection";
import StatusesActivitiesTable from "views/statuses_activities_type_table";

export default class ActivityTypeTable extends StatusesActivitiesTable {
	init() {
		var activityTypesTable = this.getRoot();
		activityTypesTable.sync(activity_type_collection);
	}
	remove(id) {
		activity_type_collection.remove(id);
	}
}