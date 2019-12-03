# Instructions for running

## Python Setup

1. Download python
2. Navigate to mason-python-testing
3. Follow the instructions here to use venv and install flask
https://flask.palletsprojects.com/en/1.1.x/installation/#installation
4. run the following
~~~
pip install redis
pip install apscheduler
pip install flask
~~~

5. Set the flask variable to endpoint.py as shown here
https://flask.palletsprojects.com/en/1.1.x/quickstart/

6. Install and run Redis
7. back on the console use
~~~
flask run
~~~
to hopefull start the server

8. Connect to the server using
~~~
curl http://127.0.0.1:5000/generator/1/fuelConsumed
~~~

9. Connect multiple clients or use different urls for different results
