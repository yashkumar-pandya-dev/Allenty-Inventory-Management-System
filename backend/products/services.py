# backend/products/services.py
from django.db import transaction
from .models import Product, AuditEntry

class ProductService:
    @staticmethod
    def update_stock(product_id, quantity_change, user, action_type):
        
        try:
            with transaction.atomic():
                
                product = Product.objects.select_for_update().get(pk=product_id)
                
                new_quantity = product.quantity + float(quantity_change)
                
                if new_quantity < 0:
                    raise ValueError(f"Insufficient stock. Current: {product.quantity}")
                
                product.quantity = new_quantity
                product.save()
                
                AuditEntry.objects.create(
                    product=product,
                    user=user,
                    action=f"{action_type}: {quantity_change} units"
                )
                
                ProductService._check_stock_health(product)
                
                return product
        except Product.DoesNotExist:
            raise ValueError("Product not found")

    @staticmethod
    def _check_stock_health(product):
        
        if product.quantity <= product.min_stock_level:
            
            print(f"⚠️ [AI PREDICTION ALERT] Stock for '{product.name}' is critical! Recommended reorder: {product.min_stock_level * 2} units.")
