const { List } = require("immutable");
const { mapcat, map, juxt, filter, compose } = require("./operations");
const { listToList, reduceList } = require("./collections");

// TODO(uri): implement as transducers.
const all = reduceList((state, current) => state && current, true);
const any = reduceList((state, current) => state || current, false);

const testReduce = reduceList((s, c) => s + c, 0)(List.of(1, 2, 3)) == 6;
const testCompose =
  compose(
    (x) => x * 2,
    (x) => x + 1,
    (x) => x.size
  )(List.of("hi")) == 4;
const testFilter = listToList(filter((x) => x < 3))(
  List.of(1, 2, 3, 4, 5)
).equals(List.of(1, 2));
const testMap = listToList(map((x) => x < 3))(List.of(1, 2, 3, 4, 5)).equals(
  List.of(true, true, false, false, false)
);
const testComposeAndTransduce = listToList(
  compose(
    filter((x) => x < 3),
    map((x) => x + 1)
  )
)(List.of(1, 2, 3, 4, 5)).equals(List.of(2, 3));

const testJuxt = listToList(
  juxt(
    compose(
      filter((x) => x < 3),
      map((x) => x + 1)
    ),
    compose(
      map((x) => x + 1),
      filter((x) => x < 3)
    )
  )
)(List.of(1, 2, 3, 4, 5)).equals(List.of(List.of(2, 3), List.of(2)));

const testMapcat = listToList(mapcat(reduceList)((x) => List.of(x, x)))(
  List.of(1, 2)
).equals(List.of(1, 1, 2, 2));
const testAny = any(List.of(true, true, false, true));
const testAll = !all(List.of(true, true, false, true));

const testResults = List.of(
  testComposeAndTransduce,
  testMap,
  testReduce,
  testCompose,
  testFilter,
  testJuxt,
  testMapcat,
  testAll,
  testAny
);

console.log(all(testResults));
