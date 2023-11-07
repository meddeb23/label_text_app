from .models import Label, Document, LabelledText
from .serializers import LabelSerializer, FileUploadSerializer,DocumentTitleUpdateSerializer, LabelledTextSerializer,DocumentSerializer
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import json
from django.http import JsonResponse

class LabelListCreateAPIView(generics.ListCreateAPIView):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

class LabelRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

class ListDocument(generics.ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer




@api_view(['POST'])
def create_document(request):
    if request.method == 'POST':
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()
            return Response({'id': document.id, 'title': document.title, 'content': document.content}, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT'])
def update_document_title(request, document_id):
    try:
        document = Document.objects.get(pk=document_id)
    except Document.DoesNotExist:
        return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method =="PUT":
        serializer = DocumentTitleUpdateSerializer(document, data=request.data, partial=True)
        print(serializer)
        print("#"*10)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def create_labelled_text(request):
    print(request.data)
    serializer = LabelledTextSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_labelled_text(request, document_id, labelled_text_start):
    try:
        labelled_text = LabelledText.objects.get(document=document_id, start=labelled_text_start)
    except LabelledText.DoesNotExist:
        return Response({'error': 'LabelledText not found'}, status=status.HTTP_404_NOT_FOUND)

    labelled_text.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def export_document(request,document_id):
    labelled_text_objects = LabelledText.objects.filter(document_id=document_id)
    document = Document.objects.get(id=document_id)
    annotations = []
    for i in labelled_text_objects:
        annotations.append({
            "start": i.start,
            "end": i.end,
            "text": i.text,
            "label": i.label.text
        })
    # Serialize the data to JSON
    labelled_text_json = json.dumps({'document':document.content,'annotation': annotations}, indent=2)
     # Create a JSON Blob as a binary stream
    json_blob = labelled_text_json.encode('utf-8')
    
    # Create an HTTP response with octet-stream content type and file attachment headers
    response = HttpResponse(json_blob, content_type='application/octet-stream')
    # Create an HTTP response with JSON content type and file attachment headers
    # response = HttpResponse(labelled_text_json, content_type='application/json')
    response['Content-Disposition'] = f'attachment; filename="{document.title}_labelled.json"'
    
    return response

def get_documents_with_labels(request):
    # Query all Document objects with their corresponding LabelledText objects
    documents = Document.objects.all()
    
    # Serialize the data
    data = []
    for document in documents:
        labelled_texts = []
        segments = LabelledText.objects.select_related('label').filter(document = document.id)
        for labelled_text in segments:
            labelled_texts.append({
                'label': {
                    "text": labelled_text.label.text,
                    "color": labelled_text.label.color,
                    "id": labelled_text.label.id,
                },
                'start': labelled_text.start,
                'end': labelled_text.end,
                'text': labelled_text.text
            })

        data.append({
            'id': document.id,
            'title': document.title,
            'content': document.content,
            'labels': labelled_texts
        })

    # Return the response as JSON
    return JsonResponse(data, safe=False)