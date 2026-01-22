import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

pytestmark = pytest.mark.django_db


def test_public_can_list_services():
    client = APIClient()
    res = client.get("/api/services/")
    assert res.status_code == 200


def test_editor_can_create_service():
    User = get_user_model()
    user = User.objects.create_user(username="editor", password="pass", role="editor")
    client = APIClient()
    token = client.post("/api/auth/login/", {"username": "editor", "password": "pass"}).data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    res = client.post("/api/services/", {"title": "test", "description": "desc"})
    assert res.status_code in (200, 201)
