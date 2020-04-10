# Generator efficiency deployment
This document specifies how to launch the project from end to end including a
generator data simulator, a generator data consumer, an aws DynamoDB repository
for the data, and a react front end that can access the repository and display
the information on graphs. Many of these parts are designed to be
interchangeable such as including data from real generators or using a different
customized front end system.

## Basic Project Setup
Clone the repository located at
https://github.com/masonschmidt/PCI-Efficiency-Project  

Install npm (more info needed)  

Install python 3.7, instructions can be found at
https://www.ics.uci.edu/~pattis/common/handouts/pythoneclipsejava/python.html  

## Deploying a Generator Simulator

## Deploying a Raw Data Consumer  

### Windows  
Windows users can install dependencies using the install script located in
"PCI-Efficiency-Project/Install Scripts/ConsumerDependencies.bat"  

Windows users can also run the consumer using the start script located in
"PCI-Efficiency-Project/Start Scripts/start_consumer.bat"  

The connection locations for input and output can be changed by editing
"Consumer/asyncRequests.py"

### Linux or manual installation
Linux users should navigate to the main director "PCI-Efficiency-Project" and
install a virtual environment using python's venv. They should then activate the
environment and install the dependencies using the following commands.  
```
pip install aiohttp
pip install python-dateutil
pip install boto3
```   

After the dependencies are install you can run the consumer using
```
python "Consumer\asyncRequests.py"
```  

The connection locations for input and output can be changed by editing
"Consumer/asyncRequests.py"

###  

## Deploying AWS Data Repository with DynamoDB

## Deploying a React Front End
