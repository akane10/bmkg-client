// autogempa.xml
// gempaterkini.xml
// gempadirasakan.xml
// lasttsunami.xml

const autogempa = document.getElementById('autogempa');
const gempaterkini = document.getElementById('gempaterkini');
const gempadirasakan = document.getElementById('gempadirasakan');
const lasttsunami = document.getElementById('lasttsunami');

const BASEURL = 'https://gempa.yapie.me/api/gempa';

async function getData(path) {
  try {
    const { data } = await axios.get(`${BASEURL}/${path}`);
    // console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
}
const objToString = (obj) =>
  Object.entries(obj).map(
    ([key, value]) => `<div class="has-text-centered"> ${key}: ${value} </div>`
  );

async function gempa(path) {
  const { data } = await getData(path);

  return data.map((i) => {
    return objToString(i).join('');
  });
}

const render = (id) => (html) => (id.innerHTML += html);

gempa('autogempa').then(render(autogempa));
gempa('gempaterkini').then(render(gempaterkini));
gempa('gempadirasakan').then(render(gempadirasakan));
gempa('lasttsunami').then(render(lasttsunami));
