// autogempa.xml
// gempaterkini.xml
// gempadirasakan.xml

const autogempa = document.getElementById("autogempa");
const gempaterkini = document.getElementById("gempaterkini");
const gempadirasakan = document.getElementById("gempadirasakan");

const compose = (...functions) => (args) =>
  functions.reduceRight((arg, fn) => fn(arg), args);

const trace = (label) => (value) => {
  console.log(`${label}: ${value}`);
  return value;
};

const render = (id) => (html) => (id.innerHTML += html);
const take = (num) => (arr) => arr.slice(0, num);
const join = (str) => (arr) => arr.join(str);
const takeThree = take(3);

const BASEURL = "https://gempa.yapie.me/api/gempa";

async function getData(path) {
  try {
    const { data } = await axios.get(`${BASEURL}/${path}`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

function handleValue(value) {
  if (Array.isArray(value)) {
    return value.map((i) => `<div> ${i} </div>`).join("");
  } else {
    return value;
  }
}

const objToHtmlString = (obj) =>
  Object.entries(obj).map(([key, value]) => {
    if (key === "shakemap") {
      return `
    <div class="has-text-centered"> 
      <div class="title is-size-5" style="margin-bottom:0">
        ${key}
      </div>
      <div>
        <a href="${handleValue(value)}">
          <img 
            width="400"
            alt="shakemap image" 
            src="${handleValue(value) || "-"} ">
        </a>
      </div>
    </div>
    `;
    } else {
      return `
    <div class="has-text-centered"> 
      <div class="title is-size-5" style="margin-bottom:0">
        ${key}
      </div>
      <div>
        ${handleValue(value) || "-"} 
      </div>
    </div>
    `;
    }
  });

const setWilayah = (obj) => {
  const values = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key.includes("wilayah")) {
      acc.push(value);
    }
    return acc;
  }, []);

  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key.includes("wilayah") && values.length > 0) {
      acc["wilayah"] = values;
      return acc;
    } else {
      acc[key] = value;
      return acc;
    }
  }, {});

  return { ...result };
};

const setKeys = (key) => (obj) => {
  const gempaTerbaruKeys = [
    "tanggal",
    "jam",
    "magnitude",
    "potensi",
    "area",
    "wilayah",
    "keterangan",
    "dirasakan",
    "shakemap",
  ];

  const gempaTerikiniKeys = [
    "tanggal",
    "jam",
    "magnitude",
    "potensi",
    "area",
    "wilayah",
    "keterangan",
  ];

  const gempaDirasakanKeys = [
    "tanggal",
    "jam",
    "magnitude",
    "area",
    "wilayah",
    "keterangan",
    "dirasakan",
  ];

  let keys = [];

  if (key === "autogempa") {
    keys = gempaTerbaruKeys;
  } else if (key === "gempaterkini") {
    keys = gempaTerikiniKeys;
  } else {
    keys = gempaDirasakanKeys;
  }
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key) || key.includes("wilayah")) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const addPadding = (arr) =>
  arr.map((i) => `<div style="padding-bottom:20px">${i}</div>`);

async function gempa(path) {
  const data = (await getData(path)) || [];
  return data.map(
    compose(
      join(""),
      objToHtmlString,
      setWilayah,
      setKeys(path)
    )
  );
}

gempa("autogempa").then(
  compose(
    render(autogempa),
    addPadding
  )
);
gempa("gempaterkini").then(
  compose(
    render(gempaterkini),
    join(""),
    addPadding,
    takeThree
  )
);
gempa("gempadirasakan").then(
  compose(
    render(gempadirasakan),
    join(""),
    addPadding,
    takeThree
  )
);
