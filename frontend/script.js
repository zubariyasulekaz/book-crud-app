document.addEventListener("DOMContentLoaded", ()=>{
    const API_URL = "http://localhost:8000/books/";

async function fetchBooks(){
    const response = await fetch(API_URL);
    const books = await response.json();

    const list = document.getElementById("book-results");
    list.innerHTML= "";

    books.forEach(book => {
        list.innerHTML += `
        <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.description}</td>
        <td>${book.year}<td>
        <td>
          <button onclick="deleteBook(${book.id})">Delete</button>
        </td>
        </tr>`;
        
    });

}

window.saveBook = async function (){
    const idField=document.getElementById('bookId');
    const id= idField.value.trim();
    const title= document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description= document.getElementById('description').value;
    const year= parseInt(document.getElementById('year').value);

    const bookData={title,author,description,year};

    try{
        if (id && !isNaN(id)){
        const checkResponse = await fetch (`${API_URL}${id}`);
        if (checkResponse.status===404){
            alert("Error: Book ID " + id + " does not exist. You can only update already available Books.");
            resetForm();
        return;
            }
        const updateResponse=await fetch(`${API_URL}${id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(bookData)
        });
        if (!updateResponse.ok){
            alert("Failed to update book");
            return;
        }
        alert("Book #"+id+"updated successfully")
        idField.value="";
        }else{
        const response = await fetch(`${API_URL}`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(bookData)
        });
        if (response.ok){
            alert("New Book added successfully!")
            idField.value="";
        }
        else{
            alert("Failed to add Book, Enter all the fields and use correct datatype");
            return;
        }
    }
    
    fetchBooks();
    resetForm();
    }catch(error){
    console.error("Save Error:",error);
    alert("Server Error: Connection lost")
    }
};



function resetForm(){
    document.getElementById('bookId').value="";
    document.getElementById('title').value="";
    document.getElementById('author').value="";
    document.getElementById('description').value="";
    document.getElementById('year').value="";
    document.querySelector('#bookForm button').innerText = "Save Book";
}
window.findBook = async function () {
    const id = document.getElementById("searchId").value;
    const result = document.getElementById("book-results");

    try{
        const response = await fetch(API_URL + id);
        if (!response.ok) throw new Error("Book not found");

        const book = await response.json();
        result.innerHTML = ` 
        <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.description}</td>
        <td>${book.year}<td>
        </tr>`;
    } catch{
        result.innerText = "Book not found";
    }

}


window.deleteBook = async function (id){
    if (!confirm("Are you sure you want to delete this book?")) return;
    await fetch(API_URL + id,
        {
            method:"DELETE"
        }
    );
    fetchBooks();
}

window.showAllBooks = function() {
    fetchBooks();
}
window.hideBooks= function(){
    document.getElementById("book-results").innerHTML = "";
};
});
