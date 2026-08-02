"""Inject an all-time coding-time summary line into README.md.

Reads WakaTime's all-time stats and rewrites the content between the
<!--START_SECTION:codetime--> / <!--END_SECTION:codetime--> markers with a
line like:

    > ⏱️ **39 hrs 24 mins** of tracked coding · since 13 Jun 2026 · **50 days** in

Data source: WakaTime (WAKATIME_API_KEY secret). Wakapi holds the same data,
so this can be pointed at https://wakapi.dev/api/compat/wakatime/v1 later by
swapping BASE_URL and the key.
"""

import base64
import datetime
import json
import os
import re
import urllib.request

BASE_URL = "https://api.wakatime.com/api/v1"
README = "README.md"
MARKER = re.compile(
    r"(<!--START_SECTION:codetime-->).*?(<!--END_SECTION:codetime-->)",
    re.DOTALL,
)


def fetch_all_time():
    key = os.environ["WAKATIME_API_KEY"]
    auth = base64.b64encode(key.encode()).decode()
    req = urllib.request.Request(
        f"{BASE_URL}/users/current/all_time_since_today",
        headers={"Authorization": f"Basic {auth}"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)["data"]


def main():
    data = fetch_all_time()
    total = data["text"]  # e.g. "39 hrs 24 mins"
    start = data["range"]["start_date"]  # e.g. "2026-06-13"

    start_dt = datetime.date.fromisoformat(start)
    today = datetime.datetime.now(datetime.timezone.utc).date()
    days = (today - start_dt).days
    pretty_start = start_dt.strftime("%d %b %Y")

    line = (
        f"> ⏱️ **{total}** of tracked coding · "
        f"since {pretty_start} · **{days} days** in"
    )

    with open(README, encoding="utf-8") as f:
        content = f.read()

    new = MARKER.sub(lambda m: f"{m.group(1)}\n{line}\n{m.group(2)}", content)

    if new != content:
        with open(README, "w", encoding="utf-8") as f:
            f.write(new)
        print("updated:", line)
    else:
        print("no change")


if __name__ == "__main__":
    main()
