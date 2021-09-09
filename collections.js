const { List } = require("immutable");

const transduce =
  (reduce) => (reducer, initial) => (transducer) => (collection) =>
    reduce(transducer(reducer), initial)(collection);

const reduce = (head, tail, empty) => (reducer, initial) => (collection) =>
  empty(collection)
    ? initial
    : reduce(head, tail, empty)(reducer, reducer(initial, head(collection)))(
        tail(collection)
      );

const reduceList = reduce(
  (x) => x.get(0),
  (x) => x.slice(1),
  (x) => !x.size
);

const conjList = (state, current) => state.push(current);

const reduceArray = reduce(
  (x) => x[0],
  (x) => x.slice(1),
  (x) => !x.length
);

// Watch out, can easily become quadratic.
const conjArray = (state, current) => [...state, current];

const fromList = transduce(reduceList);

const listToList = fromList(conjList, List());

module.exports = {
  listToList,
  reduceArray,
  reduceList,
};
