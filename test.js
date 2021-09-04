const { List } = require("immutable");
const {
  all,
  any,
  mapcat,
  toList,
  map,
  juxt,
  filter,
  compose,
  reduce,
} = require("./index");

const testReduce = reduce((s, c) => s + c, 0)(List.of(1, 2, 3)) == 6;
const testCompose =
  compose(
    (x) => x * 2,
    (x) => x + 1,
    (x) => x.size
  )(List.of("hi")) == 4;
const testFilter = toList(filter((x) => x < 3))(List.of(1, 2, 3, 4, 5)).equals(
  List.of(1, 2)
);
const testMap = toList(map((x) => x < 3))(List.of(1, 2, 3, 4, 5)).equals(
  List.of(true, true, false, false, false)
);
const testComposeAndTransduce = toList(
  compose(
    filter((x) => x < 3),
    map((x) => x + 1)
  )
)(List.of(1, 2, 3, 4, 5)).equals(List.of(2, 3));

const testJuxt = toList(
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

const testMapcat = toList(mapcat((x) => List.of(x, x)))(List.of(1, 2)).equals(
  List.of(1, 1, 2, 2)
);
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
