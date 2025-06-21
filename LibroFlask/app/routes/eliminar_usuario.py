# app/routes/eliminar_usuario.py
import os
from flask_restful import Resource
from flask import jsonify
from app.models import db, Usuario, EmbeddingFacial # mismo import que usas en registro_datos

class EliminarUsuario(Resource):
    def delete(self, id):
        usuario = Usuario.query.get(id)
        if usuario is None:
            return {"error": "Usuario no encontrado"}, 404

        EmbeddingFacial.query.filter_by(usuario_id=id).delete()
        # (opcional) eliminar la foto en disco si guardas la ruta
        if getattr(usuario, "imagen_path", None):
            try:
                os.remove(usuario.imagen_path)
            except OSError:
                pass

        db.session.delete(usuario)
        db.session.commit()
        return {"message": "Usuario eliminado"}, 200
