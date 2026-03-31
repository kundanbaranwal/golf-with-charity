exports.requireFields = (payload, fields = []) => {
  return fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
};

exports.toSafeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

exports.addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + Number(months || 0));
  return d;
};
