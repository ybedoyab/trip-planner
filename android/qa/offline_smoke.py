"""Exercise the installed APK with airplane mode enabled before first launch."""

import re
import subprocess
import time
import xml.etree.ElementTree as ET


PACKAGE = "com.ybedoyab.japantrip"


def adb(*args: str) -> str:
    return subprocess.check_output(["adb", *args], text=True, encoding="utf-8")


def find_text(label: str, exact: bool = True) -> ET.Element:
    xml = ""
    for _ in range(12):
        result = adb("shell", "uiautomator", "dump", "/sdcard/window.xml")
        if "dumped" not in result.lower():
            time.sleep(1)
            continue
        xml = adb("shell", "cat", "/sdcard/window.xml")
        for node in ET.fromstring(xml).iter("node"):
            fields = (node.get("text") or "", node.get("content-desc") or "")
            if any(field == label if exact else label in field for field in fields):
                return node
        time.sleep(1)
    raise AssertionError(f"Android UI did not show {label!r}\n{xml}")


def tap(label: str) -> None:
    node = find_text(label)
    left, top, right, bottom = map(int, re.findall(r"\d+", node.attrib["bounds"]))
    adb("shell", "input", "tap", str((left + right) // 2), str((top + bottom) // 2))


adb("install", "-r", "japon-2026.apk")
adb("shell", "pm", "clear", PACKAGE)
adb("shell", "cmd", "connectivity", "airplane-mode", "enable")
adb("shell", "svc", "wifi", "disable")
adb("shell", "svc", "data", "disable")
assert adb("shell", "settings", "get", "global", "airplane_mode_on").strip() == "1"
adb("shell", "am", "start", "-n", PACKAGE + "/.MainActivity")
tap("Yulian")
tap("Continuar")
tap("Empezar viaje")
find_text("¿Qué te interesa hoy?")
tap("Más")
tap("Mapa y vuelos")
find_text("Calles descargadas", exact=False)
tap("Vuelos")
adb("shell", "input", "swipe", "8", "1800", "8", "680", "400")
find_text("Beijing (PEK)")
tap("Más")
tap("Reservas")
find_text("Alojamientos por tramo")
adb("shell", "am", "force-stop", PACKAGE)
adb("shell", "am", "start", "-n", PACKAGE + "/.MainActivity")
find_text("¿Qué te interesa hoy?")
print("Signed Android APK opened offline, showed flights and lodging, and restored onboarding after force stop.")
