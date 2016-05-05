
# thing here can not depend on any models
import datetime



def unixtimestamp(dt=None):
	"""
	Function calcultes the unix timestamp given a datetime object
	when no datetime object is given the current unix timestamp is returned
	
	Arguments::
		dt		datetime.datetime object
		
	Returns::
		unixtimestamp
	"""
	if dt == None:
		return int( (datetime.datetime.utcnow()-datetime.datetime(1970,1,1)).total_seconds() )
	else:
		return int( (dt-datetime.datetime(1970,1,1)).total_seconds() )
