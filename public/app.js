const debugOutput = document.getElementById("debug");

function init() {
	fetch(window.location.href + "stats")
		.then((res) => res.json())
		.then((data) => {
			debugOutput.innerText = JSON.stringify(data, 0, 2);

			console.debug(data);
		});
}

init();