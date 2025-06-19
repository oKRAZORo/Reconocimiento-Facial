# app/services/embedding_storage.py

import numpy as np
from app.models import db
from app.models.embedding import EmbeddingFacial

def guardar_embedding(usuario_id: str, vector: np.ndarray, ruta_imagen: str = None):
    """
    Serializa y guarda un embedding facial.
    """
    # MODIFICADO: se fuerza a float32 antes de serializar
    vector_bytes = vector.astype(np.float32).tobytes()  # ← Modificado de float64 a float32
    emb = EmbeddingFacial(
        usuario_id=usuario_id,
        vector=vector_bytes,
        imagen_original=ruta_imagen
    )
    db.session.add(emb)
    db.session.commit()

def obtener_embeddings_en_memoria():
    """
    Recupera todos los embeddings de la BD como
    lista de tuplas (usuario_id, vector_numpy).
    """
    registros = EmbeddingFacial.query.all()
    return [
        # MODIFICADO: se lee como float32 en lugar de float64
        (e.usuario_id, np.frombuffer(e.vector, dtype=np.float32))  # ← Modificado de float64 a float32
        for e in registros
    ]

