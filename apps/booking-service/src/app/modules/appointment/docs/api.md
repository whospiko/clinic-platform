write actions apis

POST  /appointments
PATCH /appointments/:id/confirm
PATCH /appointments/:id/cancel
PATCH /appointments/:id/reschedule
PATCH /appointments/:id/complete

write read/quiery apis

GET /appointments
GET /appointments/:id
GET /appointments/no/:appointmentNo
GET /appointments/:id/status-history
GET /appointments/patients/:patientId
GET /appointments/doctors/:doctorId/calendar
GET /appointments/availability/check
GET /internal/appointments/doctors/:doctorId/busy-slots