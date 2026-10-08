"""Start the Transformer Lab and open it in your browser.

Run with:
    python main.py
"""

from __future__ import annotations

import shutil
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PREFERRED_PORT = 5173


def find_free_port(starting_port: int) -> int:
    """Return the first available loopback port at or above starting_port."""
    for port in range(starting_port, starting_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            if probe.connect_ex((HOST, port)) != 0:
                return port
    raise RuntimeError("Could not find a free local port between 5173 and 5272.")


def wait_for_server(port: int, process: subprocess.Popen[object]) -> bool:
    """Wait briefly for Vite to accept local connections."""
    for _ in range(100):
        if process.poll() is not None:
            return False
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            if probe.connect_ex((HOST, port)) == 0:
                return True
        time.sleep(0.1)
    return False


def main() -> None:
    npm = shutil.which("npm")
    if not npm:
        sys.exit("npm was not found. Install Node.js (which includes npm), then run python main.py again.")

    vite = PROJECT_DIR / "node_modules" / ".bin" / "vite"
    if not vite.exists():
        print("Installing website dependencies…")
        install = subprocess.run([npm, "install"], cwd=PROJECT_DIR, check=False)
        if install.returncode != 0:
            sys.exit("Dependency installation failed. Please run 'npm install' in this folder and try again.")

    port = find_free_port(PREFERRED_PORT)
    url = f"http://{HOST}:{port}/"
    command = [npm, "run", "dev", "--", "--host", HOST, "--port", str(port), "--strictPort"]

    print("\nStarting The Transformer — IGCSE Physics Lab…")
    server = subprocess.Popen(command, cwd=PROJECT_DIR)

    if not wait_for_server(port, server):
        server.wait()
        sys.exit("Vite did not start successfully. See the messages above for details.")

    print(f"\nOpen this site: {url}")
    print("Your browser is opening now. Keep this terminal running; press Ctrl+C to stop the site.\n")
    webbrowser.open(url)

    try:
        server.wait()
    except KeyboardInterrupt:
        print("\nStopping the Transformer Lab…")
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()


if __name__ == "__main__":
    main()
