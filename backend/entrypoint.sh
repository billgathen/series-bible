#!/bin/bash

# migrate database if necessary
alembic upgrade head

# continue with normal startup script
exec "$@"