
import datetime

def unixtimestamp(dt=None):
	if dt == None:
		return int( (datetime.datetime.utcnow()-datetime.datetime(1970,1,1)).total_seconds() )
	else:
		return int( (dt-datetime.datetime(1970,1,1)).total_seconds() )
