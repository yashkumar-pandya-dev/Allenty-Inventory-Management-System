
from django.contrib import admin
from .models import Product, Warehouse, AuditEntry

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'location')
    search_fields = ('location',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'quantity', 'warehouse', 'min_stock_level')
    list_filter = ('warehouse',)
    search_fields = ('name', 'sku')

@admin.register(AuditEntry)
class AuditEntryAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'product', 'timestamp')
    readonly_fields = ('action', 'user', 'product', 'timestamp')
