import unittest
from Consumer.asyncRequests import create_key
from Consumer.asyncRequests import create_average

class TestHelperMethods(unittest.TestCase):

    def test_create_key(self):
        self.assertEqual(create_key(1, '2020-02-06T18:37:52.859Z'), 'generator0001/2020-02-06 18:37.json')

    def test_create_avgerage(self):
        data = list()
        data.append({'testing': 47.0})
        data.append({'testing': 5.0})
        data.append({'testing': 20.0})
        data.append({'testing': 127.0})
        data.append({'testing': 4.0})
        data.append({'testing': 1.0})
        data.append({'testing': 110.0})
        data.append({'testing': 6.0})
        data.append({'testing': 6.0})
        data.append({'testing': 47.0})

        self.assertEqual(create_average(data, 'testing'), 37.3)

if __name__ == '__main__':
    unittest.main()
