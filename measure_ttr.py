"""
MendMyTools - measured TTR (Rulebook Sec 8 & 9).
Crashes the backend process INSIDE the container (so Docker's restart policy
applies; `docker kill` counts as a manual stop and is NOT auto-restarted),
then times: Detection -> Diagnosis -> Recovery -> Verification.

Usage (stack must be running:  docker compose up -d):
    python measure_ttr.py
"""
import subprocess, time, sys, urllib.request

C = "mendmytools-backend"
URL = "http://localhost:8000/docs"
TIMEOUT = 180


def sh(*args):
    return subprocess.run(args, capture_output=True, text=True).stdout.strip()


def info():
    # status | started-at
    return sh("docker", "inspect", "-f", "{{.State.Status}}|{{.State.StartedAt}}", C).split("|")


def http_ok():
    try:
        return urllib.request.urlopen(URL, timeout=1).status == 200
    except Exception:
        return False


if not http_ok():
    sys.exit("Backend is not answering on " + URL + " - run `docker compose up -d` first.")

_, started0 = info()
print("Injecting failure: killing the backend process inside the container...")
t0 = time.time()
sh("docker", "exec", C, "sh", "-c", "kill 1")

# 1) Detection: first moment we see the failure
while True:
    status, started = info()
    if status != "running" or started != started0 or not http_ok():
        break
    if time.time() - t0 > TIMEOUT:
        sys.exit("Failure not observed.")
    time.sleep(0.1)
t1 = time.time()

# 2) Diagnosis: read exit status + last log lines
code = sh("docker", "inspect", "-f", "{{.State.ExitCode}}", C)
sh("docker", "logs", "--tail", "5", C)
t2 = time.time()

# 3) Recovery: container running again (new start time)
while True:
    status, started = info()
    if status == "running" and started != started0:
        break
    if time.time() - t0 > TIMEOUT:
        sys.exit("Container did NOT restart automatically within %ds." % TIMEOUT)
    time.sleep(0.1)
t3 = time.time()

# 4) Verification: application answers HTTP 200 again
while not http_ok():
    if time.time() - t0 > TIMEOUT:
        sys.exit("Container restarted but the API never answered.")
    time.sleep(0.1)
t4 = time.time()

print("-" * 52)
print(f"Exit code observed   : {code}")
print(f"Detection time       : {t1 - t0:6.1f} s")
print(f"Diagnosis time       : {t2 - t1:6.1f} s")
print(f"Recovery time        : {t3 - t2:6.1f} s")
print(f"Verification time    : {t4 - t3:6.1f} s")
print(f"MEASURED TOTAL TTR   : {t4 - t0:6.1f} s  ({(t4 - t0) / 60:.2f} min)  vs target < 2 min")
print("-" * 52)
