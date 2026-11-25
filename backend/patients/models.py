


from django.db import models


class Patient(models.Model):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    WARD_CHOICES = [
        ("General Ward", "General Ward"),
        ("ICU", "ICU"),
        ("Private Room", "Private Room"),
        ("Emergency", "Emergency"),
    ]

    DEPARTMENT_CHOICES = [
        ("General Medicine", "General Medicine"),
        ("Cardiology", "Cardiology"),
        ("Orthopaedics", "Orthopaedics"),
        ("Pediatrics", "Pediatrics"),
    ]

    DOCTOR_CHOICES = [
        ("Dr. Meera Shah", "Dr. Meera Shah"),
        ("Dr. Arjun Rao", "Dr. Arjun Rao"),
        ("Dr. Neha Sen", "Dr. Neha Sen"),
        ("Dr. Vikram Nair", "Dr. Vikram Nair"),
    ]

    STATUS_CHOICES = [
        ("Admitted", "Admitted"),
        ("Discharged", "Discharged"),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    ward = models.CharField(max_length=50, choices=WARD_CHOICES)
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    doctor = models.CharField(max_length=50, choices=DOCTOR_CHOICES)
    admission_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Admitted")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-admission_date", "-id"]

    def __str__(self):
        return f"{self.name} ({self.status})"