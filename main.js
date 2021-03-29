// autogempa.xml
// gempaterkini.xml
// gempadirasakan.xml
const BASEURL = "https://gempa.yapie.me/api/gempa";

const autogempa = document.getElementById("autogempa");
const gempaterkini = document.getElementById("gempaterkini");
const gempadirasakan = document.getElementById("gempadirasakan");

const gempaTerbaruLoading = document.getElementById("gempa-terbaru-loading");
const gempaTerkiniLoading = document.getElementById("gempa-terkini-loading");
const gempaDirasakanLoading = document.getElementById(
  "gempa-dirasakan-loading"
);

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
  const data = await getData(path);
  const res = data.map(
    compose(
      join(""),
      objToHtmlString,
      setWilayah,
      setKeys(path)
    )
  );
  return res;
}

function removeLoading(id) {
  id.style.display = "none";
}

function showError(id) {
  id.innerHTML = `<p class="has-text-centered has-text-danger">Failed to fetch data</p>`;
}

gempa("autogempa")
  .then((res) => {
    removeLoading(gempaTerbaruLoading);
    compose(
      render(autogempa),
      addPadding
    )(res);
  })
  .catch(() => {
    removeLoading(gempaTerbaruLoading);
    showError(autogempa);
  });

gempa("gempaterkini")
  .then((res) => {
    removeLoading(gempaTerkiniLoading);
    compose(
      render(gempaterkini),
      join(""),
      addPadding,
      takeThree
    )(res);
  })
  .catch(() => {
    removeLoading(gempaTerkiniLoading);
    showError(gempaterkini);
  });

gempa("gempadirasakan")
  .then((res) => {
    removeLoading(gempaDirasakanLoading);
    compose(
      render(gempadirasakan),
      join(""),
      addPadding,
      takeThree
    )(res);
  })
  .catch(() => {
    removeLoading(gempaDirasakanLoading);
    showError(gempadirasakan);
  });
