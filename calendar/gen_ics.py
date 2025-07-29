# gen_ics.py
import os
from datetime import datetime
from icalendar import Calendar, Event
import pytz
import yaml  # pip install pyyaml

BASE_DIR = os.path.dirname(__file__)

# 1) Load your events list relative to this file
with open(os.path.join(BASE_DIR, "events.yml")) as f:
    events = yaml.safe_load(f)

# 2) For each event, build an .ics
for ev in events:
    cal = Calendar()
    cal.add("PRODID", "-//LACC//Events//EN")
    cal.add("VERSION", "2.0")

    ical = Event()
    uid = ev["id"] + "@lakealmanorcountryclub.com"
    ical.add("UID", uid)
    ical.add("DTSTAMP", datetime.fromisoformat(ev["start"]).astimezone(pytz.UTC))
    ical.add("DTSTART", datetime.fromisoformat(ev["start"]))
    ical.add("DTEND",   datetime.fromisoformat(ev["end"]))
    ical.add("SUMMARY", ev["title"])
    ical.add("DESCRIPTION", ev["description"])
    ical.add("LOCATION", ev["location"])
    cal.add_component(ical)

    # 3) Write to calendar/<id>.ics in this folder
    path = os.path.join(BASE_DIR, "events", f"{ev['id']}.ics")
    with open(path, "wb") as fout:
        fout.write(cal.to_ical())
