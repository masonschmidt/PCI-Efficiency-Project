from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import decimal

TABLE_ACCESS_KEY = "AKIARKHXIANXO77WR4X5"
TABLE_SECRET_ACCESS_KEY = "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"

dynamodb = boto3.resource( 'dynamodb',
    region_name='us-west-2',
    aws_access_key_id=TABLE_ACCESS_KEY,
    aws_secret_access_key=TABLE_SECRET_ACCESS_KEY,
)
table = dynamodb.Table('efficiency')
table.put_item(
   Item={
       'generator': 1,
       'startTimeFuel': 1,
       'startTimePower': 1,
       'recentTimeFuel': '1',
       'recentTimePower': 1,
       'powerTotal': 1,
       'fuelTotal': 1,
       'avgFuel': 1,
       'avgPower': 1,
       'efficiency': 1,
    }
)
