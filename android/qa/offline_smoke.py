"""Exercise the installed APK with airplane mode enabled before first launch."""

import re
import subprocess
import time
import xml.etree.ElementTree as ET


PACKAGE = "com.ybedoyab.japantrip"


def adb(*args: str) -> str:
    return subprocess.check_output(["adb", *args], text=True, encoding="utf-8")


def find_text(label: str) -> ET.Element:
    for _ in range(8):
        adb("shell", "uiautomator", "dump", "/sdcard/window.xml")
        xml = adb("shell", "cat", "/sdcard/window.xml")
        for node in ET.fromstring(xml).iter("node"):
            if label in (node.get("text"), node.get("content-desc")):
                return node
        time.sleep(1)
    raise AssertionError(f"Android UI did not show {label!r}\n{xml}")


def tap(label: str) -> None:
    node = find_text(label)
    left, top, right, bottom = map(int, re.findall(r"\d+", node.attrib["bounds"]))
    adb("shell", "input", "tap", str((left + right) // 2), str((top + bottom) // 2))


adb("install", "japon-2026.apk")
adb("shell", "cmd", "connectivity", "airplane-mode", "enable")
adb("shell", "svc", "wifi", "disable")
assert adb("shell", "settings", "get", "global", "airplane_mode_on").strip() == "1"
adb("shell", "am", "start", "-n", PACKAGE + "/.MainActivity")
tap("Yulian")
tap("Continuar")
tap("Empezar viaje")
find_text("¿Qué te interesa hoy?")
adb("shell", "am", "force-stop", PACKAGE)
adb("shell", "am", "start", "-n", PACKAGE + "/.MainActivity")
find_text("¿Qué te interesa hoy?")
print("Signed Android APK opened offline on first launch and after force stop.")
