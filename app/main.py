from fastapi import FastAPI, Depends, HTTPException
from app import services, models, schemas
from app.db import get_db, engine
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/books/", response_model=list[schemas.Book])
def get_all_books(db: Session=Depends(get_db)):
    return services.get_books(db)

@app.post("/books/", response_model=schemas.Book)
def create_new_book(book: schemas.BookCreate, db:Session = Depends(get_db)):
    return services.create_book(db,book)

@app.get("/books/{id}", response_model=schemas.Book)
def get_book_by_id(id:int, db:Session = Depends(get_db)):
    book_queryset=services.get_book(db,id)
    if book_queryset:
        return book_queryset
    raise HTTPException(status_code=404, detail="Invalid Book ID provided")

@app.put("/books/{id}", response_model=schemas.Book)
def update_book(book:schemas.BookCreate, id: int, db:Session = Depends(get_db)):
    db_update = services.update_book(db,book,id)
    if not db_update:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_update

@app.delete("/books/{id}",response_model=schemas.Book)
def delete_book(id:int, db:Session = Depends(get_db)):
    delete_entry=services.delete_book(db,id)
    if delete_entry:
        return delete_entry
    raise HTTPException(status_code=404, detail="Book not found")