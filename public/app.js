fetch(`${window.location.href}stats`)
	.then((res) => res.json())
	.then((data) => {
		console.log(data);
	});