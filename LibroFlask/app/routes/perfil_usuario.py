# app/routes/perfil_usuario.py

from flask_restful import Resource, reqparse
from flask import g
from app.auth.decoradores import token_required
from app.models.usuario import Usuario
from app.models import db

class ActualizarPerfil(Resource):
    @token_required
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('nombre', type=str, required=True, help='Nombre requerido')
        parser.add_argument('correo', type=str, required=True, help='Correo requerido')
        data = parser.parse_args()

        user_id = g.user_id
        usuario = Usuario.query.get(user_id)

        if not usuario:
            return {'mensaje': 'Usuario no encontrado'}, 404

        usuario.nombre = data['nombre']
        usuario.correo = data['correo']
        db.session.commit()

        return {'mensaje': 'Perfil actualizado correctamente'}, 200


class ObtenerPerfil(Resource):
    @token_required
    def get(self):
        user_id = g.user_id
        usuario = Usuario.query.get(user_id)

        if not usuario:
            return {'mensaje': 'Usuario no encontrado'}, 404

        return {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'imagen': usuario.imagen
        }, 200

