from rest_framework import routers
from . views import TaskViewSet

router = routers.DefaultRouter()
router.register(f'tasks', TaskViewSet, 'tasks')

urlpatterns = router.urls

