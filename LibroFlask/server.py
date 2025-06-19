import logging  # ← Necesario para usar logging.basicConfig
from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes import usuarios_bp, welcome_bp
from app.config.settings import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})  # ← más permisivo para desarrollo

# Linea anterior CORS(app, resources={r"/*": {"origins": ["http://localhost:4200", "http://localhost:8100"]}})

db.init_app(app)
app.register_blueprint(welcome_bp)       
app.register_blueprint(usuarios_bp, url_prefix="/usuarios")

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)  # Ya funciona 
    with app.app_context():
        db.create_all()
    app.run(debug=True)
