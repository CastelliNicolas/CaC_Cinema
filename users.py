#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify

# Instalar con pip install flask-cors
from flask_cors import CORS, cross_origin

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------


app = Flask(__name__)
CORS(app)  # Esto habilitará CORS para todas las rutas


class Usuario:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
        )
        self.cursor = self.conn.cursor(dictionary=True)
        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS usuario (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            contraseña VARCHAR(255) NOT NULL,
            celular INT NOT NULL,
            genero ENUM('Masculino', 'Femenino', 'Otro', 'Noindica'),
            fecha_nacimiento DATE NOT NULL)''')
        self.conn.commit()

        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_usuarios(self):
        self.cursor.execute("SELECT * FROM usuario")
        usuarios = self.cursor.fetchall()
        return usuarios
    
    def consultar_usuario(self, id):
        self.cursor.execute(f"SELECT * FROM usuario WHERE id = {id}")
        return self.cursor.fetchone()

    def agregar_usuario(self, nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento):
        sql = "INSERT INTO usuario (nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def modificar_usuario(self, id, nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, nuevo_celular, nuevo_genero, nuevo_fecha_nacimiento):
        sql = "UPDATE usuario SET nombre = %s, apellido = %s, email = %s, contraseña = %s, celular = %s, genero = %s, fecha_nacimiento = %s WHERE id = %s"
        valores = (nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, nuevo_celular, nuevo_genero, nuevo_fecha_nacimiento, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def eliminar_usuario(self, id):
        self.cursor.execute(f"DELETE FROM usuario WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    


#----------------------------------------------------------------------------
# Usuarios test
#----------------------------------------------------------------------------
usuario = Usuario(host="localhost", user="root", password="", database="usuario")
@app.route("/usuario", methods=["GET"])
def listar_usuarios():
    usuarios = usuario.listar_usuarios()
    return jsonify(usuarios)

@app.route("/usuario/<int:id>", methods=["GET"])
def mostrar_usuario(id):
    usuario_data = usuario.consultar_usuario(id)
    if usuario_data:
        return jsonify(usuario_data)
    else:
        return "Usuario no encontrado", 404

@app.route("/usuario", methods=["POST"])
def agregar_usuario():
    print(request.form)
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    email = request.form['email']
    contraseña = request.form['pass']
    celular = request.form['celular']
    genero = request.form['genero']
    fecha_nacimiento = request.form['fecnac']
    nuevo_id = usuario.agregar_usuario(nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento)
    if nuevo_id:
        return jsonify({"mensaje": "Usuario agregado correctamente.", "id": nuevo_id}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el usuario."}), 500

@app.route("/usuario/<int:id>", methods=["PUT"])
def modificar_usuario(id):
    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nuevo_email = request.form.get("email")
    nuevo_password = request.form.get("password")
    nuevo_celular = request.form.get("celular")
    nuevo_genero = request.form.get("genero")
    nuevo_fecha_nacimiento = request.form.get("fecha_nacimiento")
    if usuario.modificar_usuario(id, nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, nuevo_celular, nuevo_genero, nuevo_fecha_nacimiento):
        return jsonify({"mensaje": "Usuario modificado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 403

@app.route("/usuario/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    if usuario.eliminar_usuario(id):
        return jsonify({"mensaje": "Usuario eliminado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404




if __name__ == "__main__":
    app.run(debug=True)