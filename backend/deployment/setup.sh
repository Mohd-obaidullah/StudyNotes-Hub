#!/bin/bash
# StudyNotes Hub – Ubuntu VPS setup
set -e

echo "==> Updating system packages"
sudo apt update && sudo apt upgrade -y

echo "==> Installing dependencies"
sudo apt install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git

echo "==> Creating app user"
sudo useradd -m -s /bin/bash studynotes 2>/dev/null || true

echo "==> Setting up app directory"
sudo mkdir -p /var/www/studynotes
sudo chown studynotes:studynotes /var/www/studynotes

echo "==> Python virtual environment"
python3 -m venv /var/www/studynotes/venv
/var/www/studynotes/venv/bin/pip install -r /var/www/studynotes/backend/requirements.txt

echo "==> Systemd service"
sudo tee /etc/systemd/system/studynotes.service > /dev/null << SVCEOF
[Unit]
Description=StudyNotes Hub Flask App
After=network.target

[Service]
User=studynotes
WorkingDirectory=/var/www/studynotes/backend
Environment="PATH=/var/www/studynotes/venv/bin"
EnvironmentFile=/var/www/studynotes/backend/.env
ExecStart=/var/www/studynotes/venv/bin/gunicorn -c deployment/gunicorn.conf.py wsgi:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVCEOF

sudo systemctl daemon-reload
sudo systemctl enable studynotes
sudo systemctl start studynotes

echo "==> Nginx configuration"
sudo cp /var/www/studynotes/backend/deployment/nginx.conf /etc/nginx/sites-available/studynotes
sudo ln -sf /etc/nginx/sites-available/studynotes /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "==> SSL (replace domain below)"
# sudo certbot --nginx -d studynoteshub.com -d www.studynoteshub.com

echo "Done! App is live."
