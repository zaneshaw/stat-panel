const debugOutput = document.getElementById("debug");
const debugResponse = document.getElementById("response-time");

function init() {
	const start = window.performance.now();
	fetch(window.location.href + "stats")
		.then((res) => res.json())
		.then((data) => {
			const end = window.performance.now();
			const responseTime = end - start;

			debugOutput.innerText = JSON.stringify(data, 0, 2);
			debugResponse.innerText = `Response time: ${(responseTime / 1000).toFixed(2)}s`

			console.debug(data, responseTime);
		});
}

init();