from django.contrib import admin
from .models import Label, LabelledText,Document

# Register your models here.

admin.site.register([Label, LabelledText, Document])
