docker compose up -d



Use HTTP / REST when booking needs an immediate answer:
- Does this patient exist?
- What is the patient name?
- What is the patient phone?
- Can I create appointment for this patient?


Use message broker when something already happened:
- PatientCreated
- PatientUpdated
- AppointmentBooked
- AppointmentCancelled
- PaymentCompleted


1. Admin creates appointment
2. booking-service receives patientId
3. booking-service calls patient-service
4. patient-service returns patient info
5. booking-service creates appointment
6. booking-service stores patient snapshot


admin-web
   |
   v
booking-service
   |
   | HTTP GET /internal/patients/:id
   v
patient-service
   |
   v
patient_db