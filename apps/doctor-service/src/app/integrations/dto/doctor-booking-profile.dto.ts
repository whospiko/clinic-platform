export interface DoctorBookingProfileDto {
  doctorId: string;
  displayName: string;
  status: string;
  activeClinicIds: string[];
  specialtyIds: string[];
  primarySpecialtyId: string | null;
}
