function(key, values, rereduce) {
  var max = 2;
  if (values.length > max) { values.length = max; }
  return values;
}
