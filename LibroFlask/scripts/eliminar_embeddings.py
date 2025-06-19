# scripts/eliminar_embeddings.py

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask
from app.config.settings import Config
from app.models import db
from app.models.embedding import EmbeddingFacial

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    cantidad = EmbeddingFacial.query.delete()
    db.session.commit()
    print(f"✅ Se eliminaron {cantidad} embeddings.")

    # Comando pa borrar embedding: python scripts/eliminar_embeddings.py
