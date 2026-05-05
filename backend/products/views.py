from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


# ─────────────────────────────────────────────
# /api/me/  — returns the logged-in user's info
# ─────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    full_name = f"{user.first_name} {user.last_name}".strip() or user.username
    initials = "".join([n[0].upper() for n in full_name.split()[:2]]) if full_name else "??"
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": full_name,
        "initials": initials,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })


# ─────────────────────────────────────────────
# Password Reset — Request (sends real email)
# ─────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get('email', '').strip()
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Always return success to avoid leaking whether an email exists
        return Response({"message": "If that email exists, reset instructions have been sent."})

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    from django.conf import settings
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"

    send_mail(
        subject="Allenty — Password Reset Instructions",
        message=(
            f"Hi {user.first_name or user.username},\n\n"
            f"Click the link below to reset your Allenty password:\n\n"
            f"{reset_link}\n\n"
            f"This link expires in 24 hours. If you did not request this, ignore this email.\n\n"
            f"— Allenty Inventory System"
        ),
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@allenty.com'),
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({"message": "If that email exists, reset instructions have been sent."})


# ─────────────────────────────────────────────
# Password Reset — Confirm (set new password)
# ─────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password', '')

    if not uid or not token or not new_password:
        return Response({"error": "uid, token, and new_password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 8:
        return Response({"error": "Password must be at least 8 characters."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({"message": "Password updated successfully."})


# ─────────────────────────────────────────────
# Products
# ─────────────────────────────────────────────
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─────────────────────────────────────────────
# Employees
# ─────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    data = request.data
    if not data.get('employee_id') or not data.get('password'):
        return Response({"error": "Employee ID and Password are required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.create_user(
            username=data['employee_id'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            email=data.get('email', '')
        )
        return Response({"message": "Employee created successfully!", "id": user.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": "Employee ID might already exist. " + str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_list(request):
    users = User.objects.filter(is_superuser=False).values('id', 'username', 'first_name', 'last_name', 'email')
    return Response(list(users))


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_employee(request, pk):
    try:
        user = User.objects.get(pk=pk, is_superuser=False)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)
        user.save()
        return Response({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        })

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
