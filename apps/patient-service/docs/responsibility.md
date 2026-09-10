Responsibility

patient-service owns patient master data.

It answers:

Does this patient exist?
Is this patient active?
What is the patient's basic profile?
What contact info should we use?
Who is the emergency contact?

It should not own:

appointment schedule
doctor availability
medical treatment record
billing invoice
payment

Those belong to other services.
