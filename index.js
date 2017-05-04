var KEY1 = 'key1'
var VAL1 = 'val1'
var KEY2 = 'key2'
var VAL2 = 'val2'
var KEY_MERGE = 'key_merge'
var VAL_MERGE_1 = {'foo': 1, 'bar': {'hoo': 1, 'boo': 1}, 'moo': {'a': 3}}
var VAL_MERGE_2 = {'bar': {'hoo': 2}, 'baz': 2, 'moo': {'a': 3}}
var VAL_MERGE_EXPECT = {'foo': 1, 'bar': {'hoo': 2, 'boo': 1}, 'baz': 2, 'moo': {'a': 3}}

function all(AsyncStorage, test) {
  test('should set and get', function testSetAndGet(t) {
    AsyncStorage.setItem(KEY1, VAL1, (err1) => {
      t.error(err1, 'testSetAndGet/setItem')
      AsyncStorage.getItem(KEY1, (err2, result) => {
        t.error(err2, 'testSetAndGet/getItem')
        t.deepEqual(result, VAL1, 'testSetAndGet setItem')
        t.end()
      })
    })
  })

  test('should get null for missing key', function testMissingGet(t) {
    AsyncStorage.getItem(KEY2, (err, result) => {
      t.error(err, 'testMissingGet/setItem')
      t.deepEqual(result, null, 'testMissingGet')
      t.end()
    })
  })

  test('check set twice results in a single key', function testSetTwice(t) {
    AsyncStorage.setItem(KEY1, VAL1, ()=>{
      AsyncStorage.setItem(KEY1, VAL1, ()=>{
        AsyncStorage.getItem(KEY1, (err, result) => {
          t.error(err, 'testSetTwice/setItem')
          t.deepEqual(result, VAL1, 'testSetTwice')
          t.end()
        })
      })
    })
  })

  test('test removeItem', function testRemoveItem(t) {
    AsyncStorage.setItem(KEY1, VAL1, ()=>{
      AsyncStorage.setItem(KEY2, VAL2, ()=>{
        AsyncStorage.getAllKeys((err, result) => {
          t.error(err, 'testRemoveItem/getAllKeys')
          t.ok(
            result.indexOf(KEY1) >= 0 && result.indexOf(KEY2) >= 0,
            'Missing KEY_1 or KEY_2 in ' + '(' + result + ')'
          )
          AsyncStorage.removeItem(KEY1, (err2) => {
            t.error(err2, 'testRemoveItem/removeItem')
            AsyncStorage.getItem(KEY1, (err3, result2) => {
              t.error(err3, 'testRemoveItem/getItem')
              t.deepEqual(
                result2,
                null,
                'testRemoveItem: key_1 present after delete'
              )
              AsyncStorage.getAllKeys((err4, result3) => {
                t.error(err4, 'testRemoveItem/getAllKeys')
                t.ok(
                  result3.indexOf(KEY1) === -1,
                  'Unexpected: KEY_1 present in ' + result3
                )
                t.end()
              })
            })
          })
        })
      })
    })
  })

  test('should merge values', function testMerge(t) {
    AsyncStorage.setItem(KEY_MERGE, JSON.stringify(VAL_MERGE_1), (err1) => {
      t.error(err1, 'testMerge/setItem')
      AsyncStorage.mergeItem(KEY_MERGE, JSON.stringify(VAL_MERGE_2), (err2) => {
        t.error(err2, 'testMerge/mergeItem')
        AsyncStorage.getItem(KEY_MERGE, (err3, result) => {
          t.error(err3, 'testMerge/setItem')
          t.deepEqual(JSON.parse(result), VAL_MERGE_EXPECT, 'testMerge')
          t.end()
        })
      })
    })
  })

  test('multi set and get', function testOptimizedMultiGet(t) {
    t.plan(6)
    let batch = [[KEY1, VAL1], [KEY2, VAL2]]
    let keys = batch.map(([key, value]) => key)
    AsyncStorage.multiSet(batch, (err1) => {
      ;[1, 2].forEach((i) => {
        t.error(err1, `${i} testOptimizedMultiGet/multiSet`)
        AsyncStorage.multiGet(keys, (err2, result) => {
          t.error(err2, `${i} testOptimizedMultiGet/multiGet`)
          t.deepEqual(result, batch, `${i} testOptimizedMultiGet multiGet`)
        })
      })
    })
  })
}

module.exports = {
  all: all,
}
