import StatusesActivitiesTable from "views/statuses_activities_type_table";
import {status_collection} from "models/status-collection";

export default class StatusTypeTable extends StatusesActivitiesTable {
	init() {
		var statusTypesTable = this.getRoot();
		statusTypesTable.sync(status_collection);
	}
	remove(id) {
		status_collection.remove(id);
	}
} 