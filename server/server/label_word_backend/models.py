from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Label(models.Model):
    color = models.CharField(max_length=50)
    text = models.CharField(max_length=50)
    
    def __str__(self) -> str:
        return f"{self.text} {self.color}"

    
class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return f"{self.title}"

class LabelledText(models.Model):
    label = models.ForeignKey(Label, on_delete=models.CASCADE)
    start = models.IntegerField()
    end = models.IntegerField()
    text = models.TextField()
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    def __str__(self):
        return self.text