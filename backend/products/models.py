from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    min_stock_level = models.IntegerField(default=5)
    quantity = models.IntegerField(default=0)
    location = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
