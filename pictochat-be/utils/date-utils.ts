
/**
 * @returns string of value with '0' prepended to make a string of targetSize length
 */
export function padZero(value: number, targetSize: number): string {
  let requiredPadding: number = Math.max(targetSize - value.toString().length, 0);
  return '0'.repeat(requiredPadding) + value.toString();
}

/**
 * @returns A timestamp with format YYYYmmDDTHHMMSSZZZ
 */
export function timestamp(date: Date): string {
  let year: string = date.getFullYear().toString();
  let month: string = padZero(date.getMonth(), 2);
  let day: string = padZero(date.getDay(), 2);
  let hour: string = padZero(date.getHours(), 2);
  let minute: string = padZero(date.getMinutes(), 2);
  let second: string = padZero(date.getSeconds(), 2);
  let millisecond: string = padZero(date.getMilliseconds(), 3);
  return `${year}${month}${day}T${hour}${minute}${second}${millisecond}`;
}
