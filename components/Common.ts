export function formatHoursForDisplay(hours: number) {
    const fullHours = Math.trunc(hours);
    const remainder = hours - fullHours;
    const minutes = Math.trunc(60 * remainder);
    const formattedMinutes = String(minutes).padStart(2, '0');
    return fullHours + 'h' + formattedMinutes + 'm';
}