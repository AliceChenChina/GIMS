#/bin/bash
rsync -av --exclude ".git/" --exclude ".idea/" --exclude ".env" $(pwd)/dist/* dj@172.25.49.142:/home/dj/gims-manage-system/latest/gims-manage-system
