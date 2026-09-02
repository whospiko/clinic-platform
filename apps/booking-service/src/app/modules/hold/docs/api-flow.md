1. Patient opens available slots
   availability module checks:
   schedule rules
   + appointment blocks
   + active hold blocks
   + resource blocks

2. Patient selects slot
   POST /api/appointment-holds
   status = ACTIVE
   expiresAt = now + 5 minutes

3. Patient confirms booking
   appointment module creates real appointment

4. appointment module calls:
   POST /api/appointment-holds/:id/confirm
   status = CONFIRMED
   appointmentId = new appointment id

5. If patient leaves or changes slot
   POST /api/appointment-holds/:id/cancel

6. Expired holds
   status = ACTIVE but expiresAt <= now
   should no longer block availability