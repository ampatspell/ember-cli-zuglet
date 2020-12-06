let _dateTimeFormatter = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  seconds: 'numeric',
  timeZoneName: 'short'
});

export const formatDate = value => _dateTimeFormatter.format(value);
