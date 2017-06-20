docker run -v vsw_mongo:/data/db mongo chown mongodb:mongodb /data/db
docker run -v cts2_es_data:/usr/share/elasticsearch/data elasticsearch:2.0.2 chown elasticsearch:elasticsearch /usr/share/elasticsearch/data
