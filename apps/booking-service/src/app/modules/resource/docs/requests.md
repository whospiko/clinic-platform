23. Test requests
### Create dental chair
POST http://localhost:3001/api/resources/dental-chairs
Content-Type: application/json

{
  "clinicId": null,
  "code": "CHAIR-001",
  "name": "Dental Chair 1",
  "description": "Main treatment room chair",
  "status": "ACTIVE"
}
### List dental chairs
GET http://localhost:3001/api/resources/dental-chairs
### List active dental chairs
GET http://localhost:3001/api/resources/dental-chairs?status=ACTIVE
### Get dental chair by ID
GET http://localhost:3001/api/resources/dental-chairs/{{chairId}}
### Update dental chair
PATCH http://localhost:3001/api/resources/dental-chairs/{{chairId}}
Content-Type: application/json

{
  "name": "Dental Chair Room A",
  "description": "Updated room name"
}
### Change dental chair status
PATCH http://localhost:3001/api/resources/dental-chairs/{{chairId}}/status
Content-Type: application/json

{
  "status": "MAINTENANCE"
}