No, you do not create schedule one by one for next week.

You create the weekly schedule one time, then the system automatically uses it for every future week.

Example: you create this once:

Doctor A
Monday    08:00 - 12:00
Monday    14:00 - 17:00
Tuesday   08:00 - 12:00
Wednesday 08:00 - 12:00
Friday    08:00 - 12:00

Then it automatically applies to:

Week 1
Week 2
Week 3
Week 4
...

The database stores the rule, not every date.

Example database data
doctor_schedule_templates
id: template-001
doctor_id: doctor-001
timezone: Asia/Phnom_Penh
effective_from: 2026-09-01
effective_to: null
is_active: true
doctor_working_windows
template_id: template-001
day_of_week: 1
start_time: 08:00
end_time: 12:00
slot_duration_minutes: 30
capacity: 1

This means:

Every Monday from 08:00 to 12:00

Not only one Monday.

So when the patient checks:

2026-09-07 Monday
2026-09-14 Monday
2026-09-21 Monday
2026-09-28 Monday

the system uses the same row because all those dates are Monday.

How the system checks next week

When user asks available slots for:

date = 2026-09-14

The system does this:

1. Convert date to dayOfWeek
   2026-09-14 = Monday = 1

2. Find active doctor schedule template

3. Find working windows where dayOfWeek = 1

4. Remove break times

5. Remove closed-day override

6. Remove already booked appointments

7. Return available slots

So the calculation is dynamic.

You do not need to insert schedule rows for 2026-09-14.

When do we create a new schedule?

Only when the doctor’s normal weekly schedule changes permanently.

Example:

Old schedule:
Monday-Friday 08:00-17:00

Starting from October, doctor changes to:

Monday, Wednesday, Friday only

Then you create a new template:

template-002
effective_from: 2026-10-01
effective_to: null

And close the old template:

template-001
effective_to: 2026-09-30
is_active: false
When do we use override?

Use override when only one specific date is different.

Example:

Doctor normally works every Monday, but next Monday they are unavailable.

Then create override:

date: 2026-09-14
type: CLOSED_DAY
reason: Doctor personal leave

Another example:

Doctor normally does not work Sunday, but this Sunday they want to work extra.

date: 2026-09-20
type: EXTRA_WORKING_TIME
startTime: 09:00
endTime: 12:00
Correct mental model
Normal weekly schedule:
Create once.

Same schedule next week:
Do nothing.

One special day closed:
Create override.

One special day extra work:
Create override.

Permanent schedule change:
Create new schedule template.