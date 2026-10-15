#!/bin/sh
sudo mkdir -p /run/mysqld
sudo chown mysql:mysql /run/mysqld
if mysqladmin --socket=/run/mysqld/mysqld.sock ping >/dev/null 2>&1; then
  exit 0
fi
sudo mysqld --user=mysql --datadir=/var/lib/mysql --bind-address=127.0.0.1 --port=3306 --socket=/run/mysqld/mysqld.sock --pid-file=/run/mysqld/mysqld.pid >/tmp/mysqld.log 2>&1 &
sleep 2
mysqladmin --socket=/run/mysqld/mysqld.sock ping
