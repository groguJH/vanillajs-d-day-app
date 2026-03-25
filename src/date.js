export function getTargetDateInput({
  targetYearInput,
  targetMonthInput,
  targetDateInput,
}) {
  const year = targetYearInput.value.trim();
  const month = targetMonthInput.value.trim().padStart(2, "0");
  const day = targetDateInput.value.trim().padStart(2, "0");

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

export function fillInputs(
  { targetYearInput, targetMonthInput, targetDateInput },
  dateString
) {
  const [year = "", month = "", day = ""] = dateString.split("-");
  targetYearInput.value = year;
  targetMonthInput.value = month;
  targetDateInput.value = day;
}

export function clearInputs({
  targetYearInput,
  targetMonthInput,
  targetDateInput,
}) {
  targetYearInput.value = "";
  targetMonthInput.value = "";
  targetDateInput.value = "";
}

export function parseTargetDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const targetDate = new Date(year, month - 1, day);

  if (
    targetDate.getFullYear() !== year ||
    targetDate.getMonth() !== month - 1 ||
    targetDate.getDate() !== day
  ) {
    return null;
  }

  targetDate.setHours(0, 0, 0, 0);
  return targetDate;
}
