const url = 'http://127.0.0.1:3000/users';

const userHTML = user => `<div class ="user"><span class="user-id">${user.id}</span> ${user.name}</div>`;
const usersHTML = users => `<div id="users">${users.map(user => userHTML(user)).join("")}</div>`;

const inputHTML = name => `<input placeholder="Write the name here" value="${name}">`;
const buttonHTML = (text, method) => `<button type="submit" data-method="${method}">${text}</button>`;

const formHTML = (user) => `
<form id="form" data-id="${user.id}">
  ${inputHTML(user.name)}
  ${buttonHTML("Save", "PATCH")}
  ${buttonHTML("Replace", "PUT")}
</form>
`;

const fetchData = async (url, id, method = "GET", body = { name: "" }) => {
    try {
        const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();

    } catch (error) {
        console.error(error);
    }
}

const handleInput = ({ target }) => {
    target.setAttribute("value", target.value);
}

const handleSubmit = async e => {
    e.preventDefault();

    const method = e.submitter.getAttribute("data-method");
    const id = parseInt(e.target.getAttribute("data-id"));
    const result = await fetchData(
        url,
        id,
        method,
        method === "PATCH" ?
            { name: e.target.querySelector("input").value } :
            method === "PUT" ?
                { name: e.target.querySelector("input").value, id } :
                { name: "" }
    );
    if (result.state === 'DONE') {
        const users = await fetchData(url);
        document.getElementById("users").outerHTML = usersHTML(users);
    }
    // fetchData(url, e.target.getAttribute("data-id"), method, method === "PATCH" ? { name: e.target.querySelector("input").value } : { name: "" })
}

const main = async _ => {
    const users = await fetchData(url);
    const root = document.getElementById("root");
    root.insertAdjacentHTML("beforeend", usersHTML(users));
    root.insertAdjacentHTML("beforeend", formHTML({ id: 0, name: "" })); // Insert the form initially
    window.addEventListener("click", handleClick);
    window.addEventListener("input", handleInput);
    window.addEventListener("submit", handleSubmit);
};

const handleClick = async ({ target }) => {
    const userTarget = target.classList.contains('user') ? target : target.closest('.user');

    if (userTarget) {
        const userId = userTarget.querySelector('.user-id').textContent;

        const response = await fetch(`${url}/${userId}`);
        const data = await response.json();

        // Access the input element within the form
        const form = document.getElementById('form');
        const inputElement = form.querySelector('input');

        // Set the value of the input element
        inputElement.value = data.name;

        // Update the data-id attribute of the form
        form.dataset.id = userId;
        //   const inputElement = userTarget.querySelector('input');
        //   inputElement.value = data.name;

        //   document.getElementById('form').dataset.id = userId;
    }
};


window.addEventListener("load", main);
// window.addEventListener("click", handleClick); //korábbi hely, ahol lefutott, most a mainben van