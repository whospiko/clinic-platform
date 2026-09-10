POST /api/v1/patients
GET /api/v1/patients
GET /api/v1/patients/{patientId}
GET /api/v1/patients/code/{patientCode}
PATCH /api/v1/patients/{patientId}
PATCH /api/v1/patients/{patientId}/activate
PATCH /api/v1/patients/{patientId}/deactivate

POST /api/v1/patients/{patientId}/contacts
GET /api/v1/patients/{patientId}/contacts
PATCH /api/v1/patient-contacts/{contactId}
DELETE /api/v1/patient-contacts/{contactId}

POST /api/v1/patients/{patientId}/emergency-contacts
GET /api/v1/patients/{patientId}/emergency-contacts
