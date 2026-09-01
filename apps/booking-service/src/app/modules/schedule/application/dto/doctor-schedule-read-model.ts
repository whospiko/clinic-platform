export type WorkingWindowReadModel = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    capacity: number;
};

export type BreakTimeReadModel = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    reason?: string | null;
};

export type DoctorScheduleReadModel = {
    id: string;
    doctorId: string;
    clinicId?: string | null;
    timezone: string;
    effectiveFrom: string;
    effectiveTo?: string | null;
    isActive: boolean;
    workingWindows: WorkingWindowReadModel[];
    breakTimes: BreakTimeReadModel[];
};