from rest_framework import serializers
from .models import Label, Document,LabelledText

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ["color", "text", "id"]

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ("id","title","content","lables")





class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        uploaded_file = validated_data['file']
        content = uploaded_file.read().decode('utf-8')
        title = 'Untitled document'
        document = Document.objects.create(title=title, content=content)
        return document
    
class DocumentTitleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['title']

class LabelledTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabelledText
        fields = ["start","end","label", "document","text"]
class queryLabelledTextSerializer(serializers.ModelSerializer):
    label = LabelSerializer()
    class Meta:
        model = LabelledText
        fields = ["start","end","label","text"]


