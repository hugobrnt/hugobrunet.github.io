---
title: "Binary Search, and Why It's O(log n)"
date: 2026-06-11
description: "My notes on binary search: the algorithm, an implementation, and where the logarithm comes from."
---

This post exists to show you everything a blog post here can contain:
plain text, code with syntax highlighting, and math. Delete it once you
have written your own first post.

## The idea

Binary search finds a value in a **sorted** array by repeatedly cutting
the search range in half. Compare the middle element to the target: if
it's too small, the answer must be in the right half; too big, the left
half.

## An implementation

```python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

## Where the logarithm comes from

Each step halves the range, so after $k$ steps the range has size
$n / 2^k$. The search ends when the range reaches size 1:

$$
\frac{n}{2^k} = 1 \iff k = \log_2 n
$$

So the number of steps grows logarithmically: the complexity is
$O(\log n)$. Doubling the array adds just *one* extra step.
