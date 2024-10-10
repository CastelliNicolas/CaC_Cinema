from flask import Flask
from users import usuarios_bp
from peliculas import peliculas_bp
from flask_cors import CORS

app = Flask(__name__)
app.config["SECRET_KEY"] = "p233456!#L"
CORS(app, supports_credentials=True)

# Registrar los Blueprints
app.register_blueprint(usuarios_bp, url_prefix='/')
app.register_blueprint(peliculas_bp, url_prefix='/')

if __name__ == '__main__':
    app.run()
