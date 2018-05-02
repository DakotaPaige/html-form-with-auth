const addItem = document.getElementById('add-item');

addItem.addEventListener('submit', function(event) {
    event.preventDefault();
    addItem.reset();

    // const formData = new FormData(addItem);
    // const newItem = {};

    // for ([key, value] of formData.entries()) {
    //     newItem[key] = value;
    // }

    // fetch('http://localhost:4000/items', {
    //     method: 'POST',
    //     body: JSON.stringify(newItem),
    //     headers: {
    //         'content-type': 'application/json'
    //     }
    // })
    //     .then(res => res.json())
    //     .then(addItem.reset());

    // console.log(newItem);
});
