from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer

    def get_queryset(self):
        queryset = Patient.objects.all()

        search = self.request.query_params.get("search", "").strip()
        ward = self.request.query_params.get("ward", "").strip()
        department = self.request.query_params.get("department", "").strip()
        doctor = self.request.query_params.get("doctor", "").strip()

        if search:
            queryset = queryset.filter(name__icontains=search)
        if ward:
            queryset = queryset.filter(ward=ward)
        if department:
            queryset = queryset.filter(department=department)
        if doctor:
            queryset = queryset.filter(doctor=doctor)

        return queryset

    @action(detail=True, methods=["post"])
    def discharge(self, request, pk=None):
        patient = self.get_object()
        patient.status = "Discharged"
        patient.save()
        return Response(self.get_serializer(patient).data)