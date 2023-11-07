from django.urls import path
from .views import (ListDocument, LabelListCreateAPIView, LabelRetrieveUpdateDestroyAPIView, create_document,update_document_title, create_labelled_text, delete_labelled_text,export_document,get_documents_with_labels)


urlpatterns= [
    # path('api',LabelListApiView.as_view()),
    path('labels/', LabelListCreateAPIView.as_view(), name='label-list-create'),
    path('labels/<int:pk>/', LabelRetrieveUpdateDestroyAPIView.as_view(), name='label-detail'),
    path('documents/', get_documents_with_labels, name='list-document'),
    path('create-document/', create_document, name='create-document'),
        path('update-document-title/<int:document_id>/', update_document_title, name='update-document-title'),
    path('labelled-text/', create_labelled_text, name='create-labelled-text'),
    path('labelled-text/<int:document_id>/<int:labelled_text_start>/', delete_labelled_text, name='delete-labelled-text'),
    path('export-document/<int:document_id>/', export_document, name='export-document'),
]