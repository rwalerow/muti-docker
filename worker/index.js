const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    post: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index){
    if(index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
    console.log(`message: ${message}`);
    console.log('Type dla message: ' + typeof message);
    console.log(`calculated value is: ${fib(parseInt(message))}`);
    redisClient.hset('values', message, fib(parseInt(message)));
  });
sub.subscribe('insert');