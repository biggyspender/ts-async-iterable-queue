# ts-async-iterable-queue

A queue structure implementing AsyncIterableIterator&lt;T&gt;

[![npm version](http://img.shields.io/npm/v/ts-async-iterable-queue.svg?style=flat)](https://npmjs.org/package/ts-async-iterable-queue "View this project on npm")
[![Build Status](https://travis-ci.org/biggyspender/ts-async-iterable-queue.svg?branch=master)](https://travis-ci.org/biggyspender/ts-async-iterable-queue)

## Usage

```typescript
import { createAsyncQueue } from 'ts-async-iterable-queue'

const q = createAsyncQueue<number>();

const postToQueue= async () => {
    for (let x = 0; x < 100; ++x) {
        await delay(1)
        q.enqueue(x)
    }
    q.complete();
}

const receiveFromQueue= async () => {
    let i = 0;
    for await (const ii of q) {
        if(i++ !== ii){
            throw Error()
        }
    }
    if(ii !== 100){
        throw Error()
    }
    console.log("queue completed!")
}

postToQueue()       // fire-and-forget
receiveFromQueue()  // fire-and-forget

```


### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
