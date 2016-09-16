// Copyright (C) 2015 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Ensures lastIndex is read and reset to 0 when global is set
             and the match fails.
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

var lastIndexReads;
var result;

var r = /a/g;

function reset(value) {
  r.lastIndex = {
    valueOf: function() {
      lastIndexReads++;
      return value;
    }
  };
  lastIndexReads = 0;
}

reset(42);  // lastIndex beyond end of string.
result = r.exec('abc');
assert.sameValue(result, null);
assert.sameValue(r.lastIndex, 0);
assert.sameValue(lastIndexReads, 1);

reset(-1);  // No match.
result = r.exec('nbc');
assert.sameValue(result, null);
assert.sameValue(r.lastIndex, 0);
assert.sameValue(lastIndexReads, 1);
