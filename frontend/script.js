document.addEventListener("DOMContentLoaded", ()=>{
    const API_URL = "http://localhost:8000/books/";

let editingBookId = null; 

async function fetchBooks(){
    try{
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
        <td>${book.year}</td>
        <td>
            <button onclick="editBook(${book.id})">Edit</button>
          <button onclick="deleteBook(${book.id})">Delete</button>
        </td>
        </tr>`;
        
    });
    }catch(error){
        console.error("FetchBooks error: ",error)
    }
}

window.saveBook = async function (){
    const title= document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description= document.getElementById('description').value;
    const year= parseInt(document.getElementById('year').value);

    const bookData={title,author,description,year};

    try{
        if (editingBookId !== null){
            const updateData={
                title: title || null,
                author: author || null,
                description: description || null,
                year: isNaN(year) ? null : year
            };
            
            if (Object.keys(updateData).length === 0){
                alert("Please Change atleast one Field to update");
                return;
            }
            console.log("Patch Data:", updateData)
            const response=await fetch(`${API_URL}${editingBookId}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(updateData)
            });
            if (!response.ok){
                const errText = await response.text();
                console.error("Patch failed:",errText);
                alert("Failed to update Book");
                return;
            }
            alert("Book Updated successfully");
            

        }else{
        const response = await fetch(`${API_URL}`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(bookData)
        });
        if (response.ok){
            alert("New Book added successfully!")
        }
        else{
            alert("Failed to add Book");
            return;
        }
    }
    
    }catch(error){
    console.error("Save Error:",error);
    alert("Server Error: Connection lost")
    }
    editingBookId = null;
    resetForm();
    fetchBooks();
    
};

window.editBook = async function (id){
    try{    
        const checkResponse = await fetch (`${API_URL}${id}`);
        if (!checkResponse.ok){
            alert("Error: Book not found.");
            resetForm();
        return;
            }
        const book = await checkResponse.json()
        document.getElementById('title').value = book.title || "";
        document.getElementById('author').value = book.author || "";
        document.getElementById('description').value = book.description || "";
        document.getElementById('year').value = book.year || "";
        editingBookId = id;
       
        }catch(error){
            console.error("Edit error:", error);
            alert ("Failed to load Book")
        }
    };

function resetForm(){
    console.log("resetform called")
    document.getElementById('title').value="";
    document.getElementById('author').value="";
    document.getElementById('description').value="";
    document.getElementById('year').value="";
    document.querySelector('#bookForm button').innerText = "Save Book";
    editingBookId=null;
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
