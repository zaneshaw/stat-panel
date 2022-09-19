function init() {		
	getStat("cpu");
	getStat("memory");
	getStat("storage");
	getStat("network");
}

function getStat(stat) {
	const start = window.performance.now();
	fetch(window.location.href + `stats/${stat}`)
		.then((res) => res.json())
		.then((data) => {
			const end = window.performance.now();
			const responseTime = end - start;

			document.getElementById(`rt-${stat}`).innerText = `${(responseTime / 1000).toFixed(2)}s`
			document.getElementById(`debug-${stat}`).innerText = JSON.stringify(data, 0, 2);

			console.debug(data, responseTime);
		});
}

init();