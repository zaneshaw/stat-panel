const http = require("http");
const express = require("express");
const si = require("systeminformation");

const app = express();
const server = http.createServer(app);

const hostname = "0.0.0.0";
const port = 3000;
const stats = {};

server.listen(port, hostname, () => {
  console.debug(`Server running at http://${hostname}:${port}/`);
});

app.get("/", async (req, res) => {
  console.debug("GET request on '/'");

  const data = await stats.getData();
  res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
});

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
    const cpuData = await si.cpu();
    const cpuSpeedData = await si.cpuCurrentSpeed();
    const cpuTempData = await si.cpuTemperature();

    const data = {
      manufacturer: cpuData.manufacturer,
      brand: cpuData.brand,
      cores: cpuData.physicalCores,
      threads: cpuData.cores,
      maxSpeed: cpuData.speedMax,
      speed: cpuSpeedData.avg,
      temp: cpuTempData?.main
    };

    return data;
  }
}

stats.memory = {
  data: async () => {
    const memData = await si.mem();
    const memLayoutData = await si.memLayout();

    const data = {
      size: memData.total,
      used: memData.active
    };

    return data;
  }
}

stats.network = {
  data: async () => {
    const iData = await si.networkInterfaces();
    const iLatData = await si.inetLatency();

    const data = {};
    data.latency = iLatData;
    data.publicIP = await (async () => {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();

      return data.ip;
    })();
    data.interfaces = iData.map((_, i) => {
      return obj = {
        name: iData[i].iface,
        ip: iData[i].ip4,
        speed: iData[i].speed,
        type: iData[i].type
      }
    });

    return data;
  }
}

stats.storage = {
  data: async () => {
    const fsData = await si.fsSize();
    const diskData = await si.diskLayout();

    const data = {};
    data.devices = fsData.map((_, i) => {
      return obj = {
        name: diskData[i].name,
        path: fsData[i].fs,
        size: fsData[i].size,
        used: fsData[i].used
      }
    });

    return data;
  }
}

process.removeAllListeners("warning"); // Debug line
