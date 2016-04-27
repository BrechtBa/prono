Prono
==========

Website/app to make predictions on soccer tournaments among friends for fun


# Prequisites
A server capable of running django
	

# Installation
The installation scripts assume installation in a dedicated users home folder

clone the project to a temporary directory
```
mkdir ~/tmp
cd ~/tmp
git clone https://github.com/BrechtBa/prono.git
```

Create a www folder where files accessed from the web will reside.
```
mkdir ~/www
```


## Back-end
Create a python virtual environment for the django project, activate it and install the dependencies
```
virtualenv -p python3 ~/env
source ~/env/bin/activate
pip install django
pip install djangorestframework
pip install djangorestframework-jwt
```

Copy the django project from the temporary folder to the www folder
```
cp ~/tmp/prono/www/backend ~/www/backend
```

change some values in `settings.py` for instance the SECRET_KEY and set debug to False
We'll create a strong secret key randomly and store it in a file so if you update the project you can restore the secret key so user passwords are maintained
```
if [ ! -f ~/.secret_key ]; then
    echo "Create new salt"
	echo date +%s | sha256sum | base64 | head -c 32 > ~/.secret_key	
	chmod 700 ~/.secret_key
fi
secret_key=`cat ~.secret_key`

sed -i 's/^\(SECRET_KEY = \).*/\1$secret_key/' ~/www/backend/backend/settings.py
```

Now set debug to False
```
sed -i 's/^\(DEBUG = \).*/\1True/' ~/www/backend/backend/settings.py
```

Create or update the database and collect static files
```
cd ~/www/backend
python manage.py makemigrations
python manage.py migrate
manage.py collectstatic
```

Create a super user, you will be asked a username, email and password
```
python manage.py createsuperuser
```

Create a new apache virtual hosts configuration file pointing to the backend
from your project api url
```
$username="prono"
$apiurl="pronoapi.duckdns.org"
echo "<VirtualHost *:80>
        ServerName $apiurl
        ServerAlias $apiurl

        DocumentRoot /home/$username/www/backend
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined


        <Directory /home/$username/backend/backend>
                <Files wsgi.py>
                        Require all granted
                </Files>
        </Directory>


        WSGIDaemonProcess $username python-path=/home/$username/www/backend:/home/$username/env$
        WSGIProcessGroup $username
        WSGIScriptAlias / /home/$username/www/backend/backend/wsgi.py

</VirtualHost>" > ~/$apiurl".conf"
```

Next we'll need sudo privelidgest to alter file group owners and move the apache configuration file to the apache folder and enable the site
```
sudo chown :www-data ~/www/backend/db.sqlite3
sudo chmod 774 ~/www/backend/db.sqlite3

sudo chown :www-data ~/www/backend
sudo chmod 774 ~/www/backend

sudo cp ~/$apiurl".conf" /etc/apache2/sites-available/$apiurl".conf"
sudo a2ensite $apiurl".conf"
sudo /etc/init.d/apache2 restart
```


## Front-end
Serving the front-end is much simpler. Just copy the files from the repository to the www folder
```
cp ~/tmp/prono/www/frontend ~/www/frontend
```

Create a virtual hosts file
```
$username="prono"
$projecturl="prono.duckdns.org"
echo "<VirtualHost *:80>
        ServerName $projecturl
        DocumentRoot /home/$username/www/frontend
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        <Directory "/home/$username/www/frontend">
                Order allow,deny
                Allow from all
                # New directive needed in Apache 2.4.3:
                Require all granted
        </Directory>
</VirtualHost>" > ~/$projecturl".conf"
```

Again with sudo privelidges copy the file to the apache folder and enable
```
sudo cp ~/$projecturl".conf" /etc/apache2/sites-available/$projecturl".conf"
sudo a2ensite $projecturl".conf"
sudo /etc/init.d/apache2 restart
```

And with sudo privelidges chand the group ownership of some folders
```
sudo chown -r :www-data ~/www/frontend/images/avatars
```


