from django.urls import path
from . import views

urlpatterns = [
    
    path('products/', views.product_list, name='product-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),
    path('employees/create/', views.create_employee, name='create-employee'),
    path('employees/', views.employee_list, name='employee-list'), # 👈 NEW
    path('employees/<int:pk>/', views.manage_employee, name='manage-employee'), # 👈 NEW
]