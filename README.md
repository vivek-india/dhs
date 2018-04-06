REFER: https://github.com/Pylons/pyramid-cookiecutter-alchemy

1. Create a python pyramid project from scratch, the easy way is to use
Cookiecutter. To use Cookiecutter, create a local virtual environment using
virtualenv and install Cookiecutter in that environment.

    * virtualenv venv
    * venv/bin/pip install Cookiecutter 

2. Generate a Pyramid project, following the prompts from the command.
    * cookiecutter gh:Pylons/pyramid-cookiecutter-alchemy


    * Follow below steps as suggested by cookiecutter
        1. Change directory into your newly created project.
            cd dhs
        
        2. Add pymysql dpenendency in 'requires' field of setup.py file.
            

        3. Create a Python virtual environment.
            virtualenv venv
        
        4. Upgrade packaging tools.
            venv/bin/pip install --upgrade pip setuptools
        
        5. Install the project in editable mode with its testing requirements.
            venv/bin/pip install -e ".[testing]"
        
        6. change database string development.ini file
            COMMENT : # sqlalchemy.url = sqlite:///%(here)s/dhs.sqlite
            ADD: sqlalchemy.url = mysql://root:cloud123@localhost/dhs.db

        7. Run seutp.py
            venv/bin/python setup.py develop
            venv/bin/python setup.py install (Use install once dev is done)

        8. Create Database
            * mysql -uroot -pcloud123
              create database dhs_db
            * Generate Product Tables
              ./venv/bin/python parse_product_yaml.py

        9. Configure the database:
            venv/bin/initialize_dhs_db development.ini
        
        Run your project's tests.
            venv/bin/pytest
        
        Run your project.
            venv/bin/pserve development.ini



