package csvsql

/*
Todo:
	Implement a function that increment demo.db.meta with current timestamp
	whenever there is a query to demo.db. This is to ensure that the demo.db
	is still in use and not to be deleted by the cron job.
*/

func UpdateTimestamp() error {
	return nil
}

/*
Todo:
	Implement a cron job that runs every 1 hour to check for all the *.db.meta
	files, if there is a gap duration of current time and the timestamp in the
	file more than 48h, then delete it.
*/

func DeleteUnusedDatabases() error {
	return nil
}
