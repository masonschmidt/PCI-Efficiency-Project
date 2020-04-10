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

### NPM for Windows
Head to https://nodejs.org/en/download/ and download and Install the Latest
Long-Term Support (LTS) Node Js. With Downloading Node, you should have also
have downloaded a support package with CLI called NPM.

### NPM for Linux
Open the Terminal and use the commands  
```
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install nodejs -y
sudo apt-get install npm -y
```
to download Node JS.
With Downloading Node, you should have also have downloaded a support package with CLI called NPM.

### Installing Python

Install python 3.7, instructions can be found at
https://www.ics.uci.edu/~pattis/common/handouts/pythoneclipsejava/python.html  

## Deploying a Generator Simulator

### Windows

Windows users can install dependencies using the install script located in
"PCI-Efficiency-Project/Install Scripts/GeneratorDependencies.bat"  

Windows users can also run the consumer using the start script located in
"PCI-Efficiency-Project/Start Scripts/start_generator.bat"  

### Linux or manual installation

Install the dependencies using the following command line commands.
```
npm install express --save
npm install connect-timeout --save
npm install seedrandom --save
```
Now all dependencies should be correct and you should be able to run the server.
Run the command  
```
node generator_model.js
```
and it should create endpoints at http://127.0.0.1/3001


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


## Deploying AWS Data Repository with AWS S3
### Create S3 buckets
	Go to : https://us-east-2.console.aws.amazon.com/console/home?region=us-east-2
	From top click on “Services”
	From Storage click on S3
	From S3 page
	  Click on “Create Bucket”
	  Choose bucket name and click on “Create Bucket”
### Setting up Bucket permissions
	Click on created bucket
	Go to “Permissions”
	Go to “Bucket Policy”
	Add bucket policy and save  – see example below

```
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"PublicRead",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::examplebucket/*"]
    }
  ]
}
```

	Go to CORS configuration
	See example below

```
<CORSConfiguration>
 <CORSRule>
   <AllowedOrigin>http://www.example.com</AllowedOrigin>
   <AllowedMethod>PUT</AllowedMethod>
   <AllowedMethod>POST</AllowedMethod>
   <AllowedMethod>DELETE</AllowedMethod>
   <AllowedHeader>*</AllowedHeader>
  <MaxAgeSeconds>3000</MaxAgeSeconds>
  <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
  <ExposeHeader>x-amz-request-id</ExposeHeader>
  <ExposeHeader>x-amz-id-2</ExposeHeader>
 </CORSRule>
</CORSConfiguration>
```
### Setting up Identity and Access management (IAM)
  	Go to : https://us-east-2.console.aws.amazon.com/console/home?region=us-east-2
  	From top click on “Services”
  	From Security, Identity, & Compliance click on IAM
  	From the sidebar click on Users  
  	Click on Add user
  	Choose user name
  	From access type: check Programmatic access
  	Click Next
  	From set permissions click on Attach existing policies directly
  	Choose access types: choose AdministratorAccess
  	Click Next
  	Skip add tags and click on Next
  	Click on Create user

## Deploying a React Front End
