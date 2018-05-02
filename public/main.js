const addItem = document.getElementById('add-item');

addItem.addEventListener('submit', function(event) {
    event.preventDefault();

    // const formData = new FormData(addItem);
    let newItem = {};

    for (let i = 0; i < addItem.elements.length; i++) {
        let fieldName = addItem.elements[i].name;
        let fieldValue = addItem.elements[i].value;

        if (fieldName === 'tags') {
            const selected = document.querySelectorAll('#tags option:checked');
            newItem[fieldName] = [];
            //selected is a node list so we use 'for of' to iterate
            for (let element of selected) {
                newItem[fieldName].push(element.value);
            }
        } else if (fieldName && fieldValue) newItem[fieldName] = fieldValue;
    }

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

    console.log(newItem);

    addItem.reset();
});
