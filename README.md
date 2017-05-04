# AsyncStorage Test

Run tests that check if a module conforms to the AsyncStorage API that exists in React Native.

## Installation

```
npm install asyncstorage-test
```

## Usage

```js
var tape = require('tape')
var MyAsyncStorage = require('./my-async-storage')
var AsyncStorageTest = require('asyncstorage-test')

AsyncStorageTest.all(MyAsyncStorage, tape)
```

## License

MIT