const { List } = require("immutable");
const { reduceArray } = require("./collections");

const compose =
  (...functions) =>
  (initial) =>
    reduceArray((s, v) => v(s), initial)(functions.reverse());

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

const concat = (reduce) => (step) => (state, current) =>
  reduce(step, state)(current);

const mapcat = (reduce) => (f) => compose(map(f), concat(reduce));

module.exports = {
  concat,
  mapcat,
  filter,
  map,
  juxt,
  compose,
};
