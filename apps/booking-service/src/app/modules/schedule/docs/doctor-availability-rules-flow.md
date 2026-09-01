This schedule module is only for doctor availability rules. The appointment module should later query this module through ScheduleReaderPort to answer:

Can doctor X accept appointment at date Y, time Z?

For enterprise design, add one more application service later:

application/services
└── doctor-availability.service.ts

That service should combine:

weekly template
+ break times
+ schedule overrides
+ existing appointments
= available appointment slots

That is the correct place to calculate real appointment availability.