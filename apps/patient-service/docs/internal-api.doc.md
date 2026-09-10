APIs for other services

These are internal APIs used by booking-service.

GET /internal/patients/{patientId}/validation
GET /internal/patients/{patientId}/summary

Example validation response:

{
"patientId": "patient_001",
"exists": true,
"active": true
}

Example summary response:

{
"id": "patient_001",
"patientCode": "PT-000001",
"fullName": "Dara Sok",
"phoneNumber": "012345678",
"status": "ACTIVE"
}
