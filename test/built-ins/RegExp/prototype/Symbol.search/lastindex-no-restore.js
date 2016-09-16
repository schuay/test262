// Copyright (C) 2015 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
es6id: 21.2.5.9
description: There are two possible writes to `lastIndex` in Symbol.search.
             The first occurs only if `lastIndex` is not initially equal to 0.
             The second occurs only if the initial value of `lastIndex` is not equal
             to its value after exec.
info: >
    [...]
    11. Let status be Set(rx, "lastIndex", previousLastIndex, true).
    [...]
features: [Symbol.search]
---*/

// TODO: Update the comment.

var lastIndexValue;
var lastIndexValueAfterExec;
var lastIndexReads;
var lastIndexWrites;
var execCallCount;
var result;

var fakeRe = {
  get lastIndex() {
    lastIndexReads++;
    return lastIndexValue;
  },
  set lastIndex(_) {
    lastIndexWrites++;
    lastIndexValue = _;
  },
  exec: function() {
    execCallCount++;
    lastIndexValue = lastIndexValueAfterExec;
    return null;
  }
};

function reset(value, valueAfterExec) {
  lastIndexValue = value;
  lastIndexValueAfterExec = valueAfterExec;
  lastIndexReads = 0;
  lastIndexWrites = 0;
  execCallCount = 0;
}

reset(0, 0);
result = RegExp.prototype[Symbol.search].call(fakeRe);
assert.sameValue(result, -1);
assert.sameValue(lastIndexValue, 0);
assert.sameValue(lastIndexReads, 2);
assert.sameValue(lastIndexWrites, 0);
assert.sameValue(execCallCount, 1);

reset(420, 420);
result = RegExp.prototype[Symbol.search].call(fakeRe);
assert.sameValue(result, -1);
assert.sameValue(lastIndexValue, 420);
assert.sameValue(lastIndexReads, 2);
assert.sameValue(lastIndexWrites, 1);
assert.sameValue(execCallCount, 1);
