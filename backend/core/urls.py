from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from products.views import (
    product_list, product_detail,
    create_employee, employee_list, manage_employee,
    me, password_reset_request, password_reset_confirm,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Current user
    path('api/me/', me, name='me'),

    # Password reset (no auth required)
    path('api/password-reset/', password_reset_request, name='password_reset_request'),
    path('api/password-reset/confirm/', password_reset_confirm, name='password_reset_confirm'),

    # Products
    path('api/products/', product_list, name='product_list'),
    path('api/products/<int:pk>/', product_detail, name='product_detail'),

    # Employees
    path('api/employees/', employee_list, name='employee-list'),
    path('api/employees/create/', create_employee, name='create-employee'),
    path('api/employees/<int:pk>/', manage_employee, name='manage-employee'),
]
