// Copyright (C) 2015 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Ensures lastIndex is not accessed when global and sticky are unset.
es6id: 21.2.5.2.2
info: >
    21.2.5.2.2 Runtime Semantics: RegExpBuiltinExec ( R, S )

    [...]
    12. Let flags be the value of R’s [[OriginalFlags]] internal slot.
    13. If flags contains "u", let fullUnicode be true, else let fullUnicode be
        false.
    [...]
    15. Repeat, while matchSucceeded is false
        [...]
        c. If r is failure, then
           [...]
           ii. Let lastIndex be AdvanceStringIndex(S, lastIndex, fullUnicode).
---*/

// TODO: Update the comment.

var thrower = {
  valueOf: function() {
    throw new Test262Error();
  }
};

var r = /./;
r.lastIndex = thrower;

var result = r.exec('abc');

assert.notSameValue(result, null);
assert.sameValue(result.length, 1);
assert.sameValue(result[0], 'a');
assert.sameValue(r.lastIndex, thrower);

