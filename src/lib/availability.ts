import { addMinutes, isBefore, isAfter, startOfDay, endOfDay, parse, format, isSameDay } from 'date-fns';
import { type Appointment, type BusinessHour, type BlockedDate, type ClinicSettings } from '@/types/database';

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

export function generateAvailableSlots(
  currentDate: Date,
  selectedServiceDuration: number,
  businessHours: BusinessHour[],
  blockedDates: BlockedDate[],
  appointments: Appointment[],
  settings: ClinicSettings
): TimeSlot[] {
  // If the date is blocked, return no slots
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const isBlocked = blockedDates.some(bd => bd.blocked_date === formattedDate);
  if (isBlocked) return [];

  // Get business hours for this day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = currentDate.getDay();
  const dayHours = businessHours.find(bh => bh.weekday === dayOfWeek);

  if (!dayHours || !dayHours.is_open) return [];

  // Minimum booking notice
  const now = new Date();
  const noticeHours = settings.booking_notice_hours || 24;
  const minimumBookingTime = new Date(now.getTime() + noticeHours * 60 * 60 * 1000);

  // Parse start and end times for the day safely
  const startTimeStr = dayHours.start_time.split('.')[0]; // Handle possible postgres milliseconds "10:30:00.000"
  const endTimeStr = dayHours.end_time.split('.')[0];

  const dayStart = parse(startTimeStr, 'HH:mm:ss', currentDate);
  const dayEnd = parse(endTimeStr, 'HH:mm:ss', currentDate);

  const slots: TimeSlot[] = [];
  let currentSlotStart = dayStart;
  const interval = settings.slot_interval_minutes || 30;

  while (isBefore(currentSlotStart, dayEnd)) {
    const currentSlotEnd = addMinutes(currentSlotStart, selectedServiceDuration);
    
    // Check if the slot ends after business hours
    if (isAfter(currentSlotEnd, dayEnd)) {
      break;
    }

    // Check if the slot is too soon (respect booking notice)
    if (isBefore(currentSlotStart, minimumBookingTime)) {
      currentSlotStart = addMinutes(currentSlotStart, interval);
      continue;
    }

    // Check overlaps with existing appointments
    const hasOverlap = appointments.some(app => {
      if (app.status === 'cancelled') return false;
      
      // Strict date comparison using the formatted strings
      if (app.appointment_date !== formattedDate) return false;

      const appStartStr = app.start_time.split('.')[0];
      const appEndStr = app.end_time.split('.')[0];

      const appStart = parse(appStartStr, 'HH:mm:ss', currentDate);
      const appEnd = parse(appEndStr, 'HH:mm:ss', currentDate);

      // Overlap formula: start1 < end2 && end1 > start2
      return isBefore(currentSlotStart, appEnd) && isAfter(currentSlotEnd, appStart);
    });

    if (!hasOverlap) {
      slots.push({
        start: currentSlotStart,
        end: currentSlotEnd,
        label: format(currentSlotStart, 'h:mm a')
      });
    }

    // Move to next slot based on interval
    currentSlotStart = addMinutes(currentSlotStart, interval);
  }

  return slots;
}
