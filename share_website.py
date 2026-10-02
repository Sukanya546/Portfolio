import subprocess
import sys
import time
import re
import threading

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import os

def run_server():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    subprocess.run([sys.executable, "-m", "http.server", "8080"], cwd=project_dir)

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

time.sleep(1.5)
print("Local HTTP server running at http://localhost:8080")

def start_tunnel():
    while True:
        print("Connecting secure public tunnel via localhost.run...")
        proc = subprocess.Popen(
            [
                "ssh",
                "-o", "StrictHostKeyChecking=no",
                "-o", "ServerAliveInterval=15",
                "-o", "ServerAliveCountMax=3",
                "-R", "80:localhost:8080",
                "nokey@localhost.run"
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            errors='ignore',
            bufsize=1
        )

        url_found = False
        for line in iter(proc.stdout.readline, ''):
            sys.stdout.write(line)
            sys.stdout.flush()
            if ("lhr.life" in line or "https://" in line) and not url_found:
                match = re.search(r'https://[a-zA-Z0-9-]+\.lhr\.life', line)
                if match:
                    url_found = True
                    print("\n" + "="*60)
                    print(f"LIVE SHAREABLE LINK: {match.group(0)}")
                    print("Share this link with anyone to view your portfolio website live!")
                    print("="*60 + "\n")

        proc.wait()
        print("\nTunnel connection dropped. Auto-reconnecting in 3 seconds...\n")
        time.sleep(3)

if __name__ == "__main__":
    start_tunnel()
