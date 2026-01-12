from app.models import Book
from sqlalchemy.orm import Session
from app.schemas import BookCreate, BookUpdate

def create_book(db: Session, data: BookCreate ):
    book_instance = Book(**data.model_dump())
    db.add(book_instance)
    db.commit()
    db.refresh(book_instance)
    return book_instance

def get_books(db: Session):
    return db.query(Book).all()

def get_book(db: Session, book_id:int):
    return db.query(Book).filter(Book.id==book_id).first()

def update_book(db:Session, book: BookUpdate, book_id:int):
    print("PATCH payload received", book.dict())
    
    db_update = db.query(Book).filter(Book.id==book_id).first()
    print("DB book before update:",db_update)
    if not db_update:
        return None
    if book.title is not None:
        db_update.title = book.title
    if book.author is not None:
        db_update.author = book.author
    if book.description is not None:
        db_update.description = book.description
    if book.year is not None:
        db_update.year = book.year
    print("After applying patch:", db_update)
    db.add(db_update)
    db.commit()
    db.refresh(db_update)
    return db_update

def delete_book(db:Session, id:int):
    book_queryset = db.query(Book).filter(Book.id==id).first()
    if book_queryset:
        db.delete(book_queryset)
        db.commit()
    return book_queryset
