async function init() {
	setStorage();
	setMemory();
	setCPU();
	setNetwork();
}

async function getStat(stat) {
	const start = window.performance.now();

	const res = await fetch(window.location.href + `stats/${stat}`);
	const data = await res.json();

	const end = window.performance.now();
	const responseTime = end - start;

	return { values: data, rt: responseTime };
}

async function setStorage() {
	const data = await getStat("storage");
	const device = data.values.devices[0];
	const rt = (data.rt / 1000).toFixed(2);
	document.getElementById("rt-storage").innerText = `Loaded in ${rt}s`;

	document.getElementById("storage-total").innerText = b2GB(device.size);
	document.getElementById("storage-used").innerText = b2GB(device.used);
	document.getElementById("storage-free").innerText = b2GB(device.available);
	document.getElementById("storage-name").innerText = `${device.name} (${device.vendor})`;
	document.getElementById("storage-fs").innerText = device.fs;

	const percent = ((device.used / device.size) * 100).toFixed(2);
	document.getElementById("storage-percent").style.width = `${percent}%`;
	document.getElementById("storage-percent-label").innerText = `${percent}%`;
}

async function setMemory() {
	const data = await getStat("memory");
	const rt = (data.rt / 1000).toFixed(2);
	document.getElementById("rt-memory").innerText = `Loaded in ${rt}s`;

	document.getElementById("memory-total").innerText = b2GB(data.values.total);
	document.getElementById("memory-used").innerText = b2GB(data.values.active);
	document.getElementById("memory-free").innerText = b2GB(data.values.available);

	const percent = ((data.values.active / data.values.total) * 100).toFixed(2);
	document.getElementById("memory-percent").style.width = `${percent}%`;
	document.getElementById("memory-percent-label").innerText = `${percent}%`;
}

async function setCPU() {
	const data = await getStat("cpu");
	const rt = (data.rt / 1000).toFixed(2);
	document.getElementById("rt-cpu").innerText = `Loaded in ${rt}s`;

	document.getElementById("cpu-cores").innerText = data.values.physicalCores;
	document.getElementById("cpu-threads").innerText = data.values.cores;
	document.getElementById("cpu-brand").innerText = data.values.brand;
	document.getElementById("cpu-manufacturer").innerText = data.values.manufacturer;
}

async function setNetwork(i = null) {
	const data = await getStat("network");

	if (i === null) {
		i = data.values.interfaces.findIndex((obj) => {
			return obj.default;
		});
	}

	const interface = data.values.interfaces[i];

	const interfaces = data.values.interfaces;
	document.getElementById("network-radio").innerHTML = null;
	interfaces.forEach((_, index) => {
		document.getElementById("network-radio").innerHTML +=
			`<div onclick="changeNetworkInterface(${index})" class="py-1 px-3 bg-neutral-800 border-2 border-neutral-700 rounded-md cursor-pointer${index === i ? " radio-active" : ""}">${index + 1}</div>`;
	});

	const rt = (data.rt / 1000).toFixed(2);
	document.getElementById("rt-network").innerText = `Loaded in ${rt}s`;

	document.getElementById("network-public").innerText = data.values.publicIP;
	document.getElementById("network-private").innerText = interface.ip4;
	document.getElementById("network-name").innerText = interface.ifaceName;
	document.getElementById("network-type").innerText = interface.type.charAt(0).toUpperCase() + interface.type.slice(1) || "Unknown";
}

async function changeNetworkInterface(i) {
	setNetwork(i);
}

function b2GB(B) {
	const KB = B / 1000;
	const MB = KB / 1000;
	const GB = MB / 1000;

	return GB.toFixed(2);
}

init();