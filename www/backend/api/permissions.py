from rest_framework import permissions
from rest_framework_jwt.utils import jwt_decode_handler

from .utils import unixtimestamp

def get_payload_access_exp(request):
	try:
		payload = jwt_decode_handler(request.auth.decode('utf-8'))
		
		return payload['access_exp'] > unixtimestamp()
	except:
		return False

def get_payload_stage(request):
	try:
		payload = jwt_decode_handler(request.auth.decode('utf-8'))
		
		return payload['stage']
	except:
		return -1

			
class IsOwnerOrAdmin(permissions.BasePermission):
	"""
	Custom permission to only allow owners of an object and the admin to view and edit it.
	"""
	
	def has_object_permission(self, request, view, obj):
		
		if hasattr(obj,'user'):
			return (obj.user == request.user and get_payload_access_exp(request)) or request.user.is_staff
		else:
			return (obj == request.user and get_payload_access_exp(request)) or request.user.is_staff

class IsOwnerOrAdminGroupstage(permissions.BasePermission):
	"""
	Custom permission to only allow owners of an object and the admin to view and edit it only when the stage in the token is a certain value 
	"""
	def has_object_permission(self, request, view, obj):
		
		if hasattr(obj,'user'):
			return (obj.user == request.user and get_payload_access_exp(request) and get_payload_stage(request)==0) or request.user.is_staff
		else:
			return (obj == request.user and get_payload_access_exp(request) and get_payload_stage(request)==0) or request.user.is_staff

class PronoResultPermission(permissions.BasePermission):
	"""
	Custom permission to only allow owners of an object and the admin to view and edit it only when the stage in the token is a certain value 
	"""
	def has_object_permission(self, request, view, obj):
		match = obj.match
		
		if request.method in permissions.SAFE_METHODS:
			return obj.user == request.user or request.user.is_staff
		else:		
			return (obj.user == request.user and get_payload_access_exp(request) and get_payload_stage(request)<=obj.match.stage) or request.user.is_staff
		
		
class IsAdminOrReadOnly(permissions.BasePermission):
	"""
	Custom permission to only allow owners of an object to edit it.
	"""

	def has_object_permission(self, request, view, obj):
		# Read permissions are allowed to any request,
		# so we'll always allow GET, HEAD or OPTIONS requests.
		if request.method in permissions.SAFE_METHODS:
			return True

		# Write permissions are only allowed to the admin
		return request.user.is_staff

		
class IsOwnerOrReadOnly(permissions.BasePermission):
	"""
	Custom permission to only allow owners of an object to edit it.
	"""

	def has_object_permission(self, request, view, obj):
		# Read permissions are allowed to any request,
		# so we'll always allow GET, HEAD or OPTIONS requests.
		if request.method in permissions.SAFE_METHODS:
			return True

		# Write permissions are only allowed to the owner
		return (obj.user == request.user and get_payload_access_exp(request))
		
		
class PointsPermissions(permissions.BasePermission):
	"""
	Custom permission to only allow the user and admin to view point details 
	"""

	def has_object_permission(self, request, view, obj):
		# Read permissions are allowed to any request,
		# so we'll always allow GET, HEAD or OPTIONS requests.
		if request.method in permissions.SAFE_METHODS:
			return obj.prono == 'total' or obj.user == request.user #or request.user.is_staff

		# Write permissions are only allowed to admin
		return request.user.is_staff
