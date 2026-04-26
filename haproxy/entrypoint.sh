#!/bin/sh
set -e

CERT_DIR=$(find /etc/letsencrypt/live -maxdepth 1 -type d -name "katamino.frankhereford.com*" | head -1)
HAPROXY_PEM="/certs/haproxy.pem"

cat "$CERT_DIR/fullchain.pem" "$CERT_DIR/privkey.pem" > "$HAPROXY_PEM"
chmod 600 "$HAPROXY_PEM"

exec haproxy -f /usr/local/etc/haproxy/haproxy.cfg -db
