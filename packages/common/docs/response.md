## Success Response Template

```
{
  "success": true,
  "code": "SUCCESS",
  "message": "Request successful",
  "data": {},
  "timestamp": "2026-08-29T15:20:00.000Z",
  "path": "/appointments"
}

```

## Error Response Template

### Simple Response Error

```
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Patient not found",
  "timestamp": "2026-08-29T15:20:00.000Z",
  "path": "/internal/patients/patient-999"
}
```

### Validate Response Error

```
{
  "success": false,
  "code": "BAD_REQUEST",
  "message": "Validation failed",
  "errors": [
    "patientId must be a string"
  ],
  "timestamp": "2026-08-29T15:20:00.000Z",
  "path": "/appointments"
}
```