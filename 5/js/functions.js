
function isMeetingInWorkHours(workStart, workEnd, meetingStart, meetingLength) {
  function convertToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const workStartMin = convertToMinutes(workStart);
  const workEndMin = convertToMinutes(workEnd);
  const meetingStartMin = convertToMinutes(meetingStart);
  const meetingEndMin = meetingStartMin + meetingLength;

  if (meetingStartMin >= workStartMin && meetingEndMin <= workEndMin) {
    return true;
  } else {
    return false;
  }
}

isMeetingInWorkHours('08:00', '17:30', '14:00', 90); // true
isMeetingInWorkHours('8:0', '10:0', '8:0', 120);     // true
isMeetingInWorkHours('08:00', '14:30', '14:00', 90); // false
isMeetingInWorkHours('14:00', '17:30', '08:0', 90);  // false
isMeetingInWorkHours('8:00', '17:30', '08:00', 900); // false
