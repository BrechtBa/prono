# develloping the django backend

Clone the project from github
```
git clone https://github.com/BrechtBa/prono
```

Create a new python3 virtual environment in the project root folder
```
cd prono
virtualenv -p python3 env
cd www/backend
```

Activate the virtualenvironment from the folder this
```
source ../../env/bin/activate
```

Install the python dependencies
```
pip install django
pip install djangorestframework
pip install djangorestframework-jwt
```


# using curl
GET:
```
curl http://localhost:8000/api/matches/
```
POST:
```
curl -H "Content-Type: application/json" -X POST -d '{"team1":"1","team2":"2"}' http://localhost:8000/api/matches/
```
PUT:
```
curl -H "Content-Type: application/json" -X PUT -d '{"defaultteam1":"A1","defaultteam2":"A2"}' http://localhost:8000/api/matches/1/
```
DELETE:
```
curl -H "Content-Type: application/json" -X DELETE http://localhost:8000/api/matches/1/
```


# creating the django project from scratch
```
cd DjangoRestAPI_example
source env/bin/activate
cd www
django-admin.py startproject backend
cd backend
python manage.py startapp api
```




