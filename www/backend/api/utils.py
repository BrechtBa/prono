
import datetime

def unixtimestamp(dt=None):
	if dt == None:
		return (datetime.datetime.utcnow()-datetime.datetime(1970,1,1)).total_seconds()
	else:
		return (dt-datetime.datetime(1970,1,1)).total_seconds()