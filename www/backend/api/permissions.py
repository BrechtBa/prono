from rest_framework import permissions



class IsOwnerOrAdmin(permissions.BasePermission):
	"""
	Custom permission to only allow owners of an object and the admin to view and edit it.
	"""

	def has_object_permission(self, request, view, obj):
		if hasattr(obj,'user'):
			return obj.user == request.user or request.user.is_staff
		else:
			return obj == request.user or request.user.is_staff

		
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
		return obj.user == request.user
		
		
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