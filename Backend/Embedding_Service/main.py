from fastapi import FastAPI, Request, Depends
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from sqlalchemy.orm import Session

from sqlalchemy import text

from database import SessionLocal, engine
from models import Base, Document

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

class TextInput(BaseModel):
    text: str

def generate_embedding(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        model_output = model(**inputs)
    embeddings = model_output.last_hidden_state.mean(dim=1)
    return embeddings[0].tolist()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/embed")
def embed_text(input: TextInput, db: Session = Depends(get_db)):
    vector = generate_embedding(input.text)
    new_doc = Document(content=input.text, embedding=vector)
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return {"id": new_doc.id, "embedding": vector}

@app.post("/search")
def search_similar(input: TextInput, db: Session = Depends(get_db)):
    query_vector = generate_embedding(input.text)
    sql = text("""
        SELECT id, content
        FROM documents
        ORDER BY embedding <-> (:query_vector)::vector
        LIMIT 5
    """)

    result = db.execute(sql, {"query_vector": query_vector})
    return [{"id": row.id, "content": row.content} for row in result]