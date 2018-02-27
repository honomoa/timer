# Install

```sh
$ npm i --save honomoa/timer
```

# Usage
Single timer

```js
const Timer = require('timer');

Timer.start();                            // Start the timer

/* running your code */

Timer.stop();                             // Stop the timer

Timer.print();                            // Print the duration

console.log(Timer.getResult());           // Return ISO-8601 duration format
console.log(Timer.getResultISO8601());    // Return ISO-8601 duration format

console.log(Timer.getResultS());          // Return duration seconds
console.log(Timer.getResultMS());         // Return duration milliseconds
```

Multiple timer

```js
const Timer = require('timer');

Timer.start('a');                         // Start the timer A

/* running your code */

Timer.stop('a');                          // Stop the timer A
Timer.start('b');                         // Start the timer B

/* running your code */

Timer.stop('b');                          // Stop the timer B

Timer.print('a');                         // Print the duration of timer A
Timer.print('b');                         // Print the duration of timer B

console.log(Timer.getResult('a'));        // Return ISO-8601 duration format of timer A
console.log(Timer.getResultISO8601('b')); // Return ISO-8601 duration format of timer B

console.log(Timer.getResultS('a'));       // Return duration seconds of timer A
console.log(Timer.getResultMS('b'));      // Return duration milliseconds of timer B
```

Lap timer

```js
const Timer = require('timer');

Timer.start();                            // Start the timer

/* running your code */

Timer.lap();                              // lap the timer

/* running your code */

Timer.lap();                              // lap the timer

/* running your code */

Timer.lap();                              // lap the timer

/* running your code */

Timer.stop();                             // Stop the timer

Timer.print();                             // Print the laps and duration

console.log(Timer.getResult());            // Return ISO-8601 format of laps and duration
console.log(Timer.getResultISO8601());     // Return ISO-8601 format of laps and duration

console.log(Timer.getResultS());           // Return seconds format of laps and duration
console.log(Timer.getResultMS());          // Return milliseconds format of laps and duration
```

