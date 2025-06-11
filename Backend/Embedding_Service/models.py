from sqlalchemy import Column, Integer, String
from pgvector.sqlalchemy import Vector
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String, nullable=False)
    embedding = Column(Vector(384))  # 384 for all-MiniLM-L6-v2
