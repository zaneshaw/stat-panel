const http = require("http");
const express = require("express");
const si = require("systeminformation");
const path = require("path");

const app = express();
const server = http.createServer(app);

const hostname = "0.0.0.0";
const port = 3000;
const stats = {};

server.listen(port, hostname, () => {
  console.debug(`Server running!`);
  console.debug(`Local network: http://localhost:${port}/`);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/stats", async (req, res) => {
  res.json(await stats.getData());
});

app.get("/stats/:slug", async (req, res) => {
  // res.json(await stats.cpu.data());
  const stat = req.params.slug;

  let data = {};
  if (stats.hasOwnProperty(stat)) {
    if (stats[stat].data) {
      data = await stats[stat].data();
      return res.json(data);
    }
  }
  res.status(404).send(`<pre>Stat '${stat}' doesn't exist!</pre>`);
});

stats.values = {
  cpu: {
    cpu: "manufacturer, brand, physicalCores, cores, speedMax",
    cpuCurrentSpeed: "avg",
    cpuTemperature: "main"
  },
  memory: {
    mem: "total, active, available"
  },
  network: {
    networkInterfaces: "ifaceName, ip4, speed, type, default"
  },
  storage: {
    diskLayout: "name, vendor",
    fsSize: "fs, size, used, available"
  }
}

stats.getData = async () => {
  const data = {
    cpu: await stats.cpu.data(),
    memory: await stats.memory.data(),
    network: await stats.network.data(),
    storage: await stats.storage.data()
  }
  return data;
}

stats.cpu = {
  data: async () => {
    const cpuData = await si.get(stats.values.cpu);

    return Object.assign({}, ...Object.values(cpuData));
  }
}

stats.memory = {
  data: async () => {
    const memData = await si.get(stats.values.memory);

    return Object.assign({}, ...Object.values(memData));
  }
}

stats.network = {
  data: async () => {
    const data = {};
    data.publicIP = await (async () => {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();

      return data.ip;
    })();
    data.interfaces = await (async () => {
      const data = await si.get(stats.values.network);

      return Object.assign([], ...Object.values(data));
    })();


    return data;
  }
}

stats.storage = {
  data: async () => {
    const storageData = await si.get(stats.values.storage);

    const joined = [];
    storageData.diskLayout.forEach((_, index) => {
      joined.push({
        ...storageData.diskLayout[index],
        ...storageData.fsSize[index]
      });
    });

    return { devices: joined };
  }
}

process.removeAllListeners("warning"); // Debug line
