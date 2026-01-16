from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer
from rest_framework import parsers
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator

from .models import CustomUser

from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
import requests

class UserViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    # Create your views here.
    @action(detail=False, methods=['post'], url_path='register', serializer_class=RegisterSerializer)
    def register(self, request):

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='login', serializer_class=LoginSerializer)
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = CustomUser.objects.filter(username=username)
            user = user.first()
            if not user:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            # if not user.exists():
            #     return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)

                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response({"detail" : "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
    @action(detail=False, methods=['post'], url_path='forgot-password',serializer_class=PasswordResetRequestSerializer)
    def password_reset_request(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Лист для відновлення паролю відправлено"}, 
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'], url_path='reset-password', serializer_class=SetNewPasswordSerializer)
    def password_reset_confirm(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(serializer.validated_data['uid']).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({"detail": "Невірний uid"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, serializer.validated_data['token']):
            return Response({"detail": "Невірний або прострочений токен"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"detail": "Пароль успішно змінено"}, status=status.HTTP_200_OK)
    
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

User = get_user_model()

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # print("get data", request.data)
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"detail": "Access token required"}, status=status.HTTP_400_BAD_REQUEST)

        resp = requests.get(GOOGLE_USERINFO_URL, headers={"Authorization": f"Bearer {access_token}"})
        if resp.status_code != 200:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        userinfo = resp.json()
        
        google_id = userinfo.get("sub")               
        email = userinfo.get("email")
        phone = userinfo.get("phone_number")        
        avatar_url = userinfo.get("picture")
        username = userinfo.get("name") or email.split("@")[0]
        isGoogle = True

        if not email:
            return Response({"detail": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": username,
            #"isGoogle": isGoogle,
        })


        if phone and not user.phone:
            user.phone = phone
            user.save(update_fields=["phone"])

        refresh = RefreshToken.for_user(user)

        # send_mail(
        #     subject='Тестовий лист',
        #     message='Це тестовий лист від Django через smtp.ukr.net.',
        #     from_email='super.novakvova@ukr.net',
        #     recipient_list=['novakvova@gmail.com'],
        #     fail_silently=False,
        # )

        return Response({
            "id": google_id,
            "email": email,
            "phone": phone,
            "avatar": avatar_url,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })
