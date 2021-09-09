const { List } = require("immutable");

const reduce = (head, tail, empty) => (reducer, initial) => (collection) =>
  empty(collection)
    ? initial
    : reduceList(reducer, reducer(initial, head(collection)))(tail(collection));

const reduceList = reduce(
  (x) => x.get(0),
  (x) => x.slice(1),
  (x) => !x.size
);

const compose =
  (...functions) =>
  (initial) =>
    reduceList((s, v) => v(s), initial)(List(functions).reverse());

const juxt =
  (...transducers) =>
  (step) => {
    const reducers = List(transducers.map((t) => t(step)));
    return (state, current) =>
      reducers.map((r, i) => r(state.size ? state.get(i) : List(), current));
  };

const map = (f) => (step) => (state, current) => step(state, f(current));

const filter = (f) => (step) => (state, current) =>
  f(current) ? step(state, current) : state;

const concat = (step) => (state, current) => reduceList(step, state)(current);

const mapcat = (f) => compose(map(f), concat);

const transduce = (reducer, initial) => (transducer) => (collection) =>
  reduceList(transducer(reducer), initial)(collection);

const toList = transduce((state, current) => state.push(current), List());

const all = reduceList((state, current) => state && current, true);
const any = reduceList((state, current) => state || current, false);

module.exports = {
  all,
  any,
  mapcat,
  toList,
  filter,
  map,
  juxt,
  compose,
  reduceList,
};
