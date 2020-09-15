import datetime as dt


def parse_reminder_datetime(reminder_datetime_utc_str):
    return dt.datetime.strptime(reminder_datetime_utc_str, "%Y-%m-%dT%H:%M:%S.%fZ")

