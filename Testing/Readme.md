#Testing
There are currently two automated testing sections, GeneratorTesting and
ConsumerTests.

##GeneratorTesting
The generator testing includes two tests. One tests checks that the output is 
within the correct parameters the other tests stresses the generator model to
see if it can handle a large number of requests.

##ConsumerTests
The consumer testing uses a small number of unit tests to verify that some helper
functions in the consumer are correctly formatting data. All other testing is
currently done by hand because the consumer does not function outside of a larger
scale with data inputs from the generator model and output to s3.

##ReactTesting
React testing has not been automated at this time as React is still going through
restructures that would require reworking the tests.
