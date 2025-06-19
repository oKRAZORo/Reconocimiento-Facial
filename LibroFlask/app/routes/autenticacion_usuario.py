# app/routes/autenticacion_usuario.py

import io
import datetime
import logging
import base64

from flask import current_app, request
from flask_restful import Resource
from PIL import Image
import numpy as np
import face_recognition
import jwt

from app.models.usuario import Usuario
from app.services.embedding_storage import obtener_embeddings_en_memoria

log = logging.getLogger(__name__)

class AutenticacionUsuario(Resource):
    def post(self):
        if 'imagen' not in request.files:
            return {'mensaje': 'Imagen no enviada'}, 400

        img_file  = request.files['imagen']
        img_bytes = img_file.read()
        try:
            with Image.open(io.BytesIO(img_bytes)) as img:
                rgb_img = img.convert("RGB")
                arr     = np.asarray(rgb_img, dtype=np.uint8)
        except Exception as e:
            log.error(f"Error procesando imagen con PIL: {e}", exc_info=True)
            return {'mensaje': 'Formato de imagen no soportado'}, 400

        arr = np.ascontiguousarray(arr, dtype=np.uint8)

        try:
            encodings = face_recognition.face_encodings(arr)
        except Exception as e:
            log.error(f"Error en face_encodings: {e}", exc_info=True)
            return {'mensaje': 'No se pudo procesar la imagen'}, 400

        if not encodings:
            return {'mensaje': 'No se detectó ningún rostro'}, 400

        rostro_nuevo = encodings[0]
        embeddings = obtener_embeddings_en_memoria()

        mejor_distancia = float('inf')  # ← MODIFICADO: para seguimiento
        mejor_usuario = None            # ← MODIFICADO: para guardar match

        for usuario_id, vector_guardado in embeddings:
            if vector_guardado.shape != rostro_nuevo.shape:
                log.warning(f"Dimensiones incompatibles: BD={vector_guardado.shape}, nuevo={rostro_nuevo.shape}")  # ← MODIFICADO
                continue

            distancia = np.linalg.norm(vector_guardado - rostro_nuevo)
            log.debug(f"Comparando con {usuario_id}: distancia = {distancia:.4f}")  # ← MODIFICADO

            if distancia < mejor_distancia:
                mejor_distancia = distancia
                mejor_usuario = usuario_id

        # Cambia el umbral aquí según resultados
        UMBRAL = 0.55  # ← MODIFICADO: valor más flexible

        if mejor_usuario and mejor_distancia < UMBRAL:
            usuario = Usuario.query.get(mejor_usuario)
            if not usuario:
                return {'mensaje': 'Usuario encontrado pero no registrado'}, 400

            payload = {
                'user_id': usuario.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=3)
            }
            token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm='HS256')

            try:
                with Image.open(usuario.imagen) as img:
                    orig_w, orig_h = img.size
                    new_h = 256
                    new_w = int(orig_w * new_h / orig_h)
                    resample = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS
                    thumb = img.convert("RGB").resize((new_w, new_h), resample)
                    buffer = io.BytesIO()
                    thumb.save(buffer, format="JPEG")
                    img_b64 = base64.b64encode(buffer.getvalue()).decode("ascii")
                    data_url = f"data:image/jpeg;base64,{img_b64}"
            except Exception as e:
                log.error(f"Error procesando imagen del usuario: {e}", exc_info=True)
                data_url = None

            return {
                'mensaje': 'Autenticación exitosa',
                'token': token,
                'usuario': {
                    'id': usuario.id,
                    'nombre': usuario.nombre,
                    'email': usuario.email,
                    'imagen': usuario.imagen if usuario.imagen else None,
                },
                'foto_perfil': data_url
            }, 200

        return {'mensaje': 'No se encontró coincidencia facial'}, 401
