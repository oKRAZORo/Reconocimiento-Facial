from flask import Blueprint
from flask_restful import Api

from app.routes.perfil_usuario import ObtenerPerfil, ActualizarPerfil

from .registro_datos       import RegistroDatos
from .registro_imagenes    import RegistroImagenes
from .autenticacion_usuario import AutenticacionUsuario
from .perfil_usuario       import ActualizarPerfil
from .listar_usuarios      import ListarUsuarios

usuarios_bp = Blueprint("usuarios", __name__)
api = Api(usuarios_bp)

api.add_resource(RegistroDatos,       "")
api.add_resource(RegistroImagenes,    "/photoupload/<string:id>")
api.add_resource(AutenticacionUsuario,"/validate-photo")
api.add_resource(ActualizarPerfil,    "/actualizar-perfil")
api.add_resource(ListarUsuarios,     "/listar")
api.add_resource(ObtenerPerfil, '/usuarios/perfil')       # GET perfil