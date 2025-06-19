# scripts/eliminar_todos_usuarios.py (En carpeta LibroFlask pa que funcione)

import os
import sys
import shutil

# Asegura que podamos importar 'app'
sys.path.append(os.path.abspath("."))

from app.config.settings import Config
from app.models.usuario import Usuario
from app.models.embedding import EmbeddingFacial
from app.models import db
from flask import Flask

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    # Elimina registros de la BD
    num_embeddings = EmbeddingFacial.query.delete()
    num_usuarios = Usuario.query.delete()
    db.session.commit()
    print(f"🧹 Se eliminaron {num_usuarios} usuarios y {num_embeddings} embeddings.")

    # Limpia carpeta 'uploads/'
    uploads_path = os.path.join(os.getcwd(), "uploads")
    if os.path.exists(uploads_path):
        for archivo in os.listdir(uploads_path):
            archivo_path = os.path.join(uploads_path, archivo)
            if os.path.isfile(archivo_path):
                os.remove(archivo_path)
        print("🗑️  Se eliminaron todas las imágenes de la carpeta 'uploads/'")
    else:
        print("⚠️  La carpeta 'uploads/' no existe")
