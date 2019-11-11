# NodeJS Server Documentation

## Dependencies
#### Download NodeJS
Go to https://nodejs.org/en/download/ and download the latest NodeJS LTS Version.  

#### Install Dependencies
``` npm install express --save ```  
``` npm install helmet --save ```

## Run Program
Clone into the PCI-EFFICIENCY-PROJECT or Pull latest code from Github. Change Directories to PCI-EFFICIENCY-PROJECT/chase-node-testing/ and type:
``` node server.js ```

## Runtime Abilities
The Server is runing on ``` http://127.0.0.1:3000/ ```

| Relative Paths | Query String | Output1   | Output2 | Dynamic            | Browser            | cURL               |
|----------------|--------------|-----------|---------|--------------------|--------------------|--------------------|
| /              | -            | Hello     | GoodBye | :heavy_check_mark: | :heavy_check_mark: |                    |
| /              | ?id=time     | hr : m : s|    -    | :heavy_check_mark: | :heavy_check_mark: |                    |
| /              | ?id=random   | number    |    -    | :heavy_check_mark: | :heavy_check_mark: |                    |
| /testing       | -            | Hello     | GoodBye |                    | :heavy_check_mark: |                    |
| /testing       | ?id=time     | hr : m : s|    -    |                    | :heavy_check_mark: |                    |
| /testing       | ?id=random   | number    |    -    |                    | :heavy_check_mark: |                    |
| /ender         | -            | Hello     | GoodBye | :heavy_check_mark: |                    | :heavy_check_mark: |
| /ender         | ?id=time     | hr : m : s|    -    | :heavy_check_mark: |                    | :heavy_check_mark: |
| /ender         | ?id=random   | number    |    -    | :heavy_check_mark: |                    | :heavy_check_mark: |
