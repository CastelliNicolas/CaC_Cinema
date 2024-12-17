#--------------------------------------------------------------------
from flask import request, jsonify, Blueprint, session

from init_db import crear_db

import mysql.connector

from werkzeug.security import generate_password_hash, check_password_hash

#--------------------------------------------------------------------

usuarios_bp = Blueprint("usuarios", __name__)


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
                crear_db()
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS usuario (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre_usuario VARCHAR(255) NOT NULL,
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
    
    def consultar_usuario_email(self, email):
        self.cursor.execute(f"SELECT * FROM usuario WHERE email = %s", (email,))
        return self.cursor.fetchone()
    
    def agregar_usuario(self, nombre_usuario, apellido, email, contraseña, celular, genero, fecha_nacimiento):
        sql = "INSERT INTO usuario (nombre_usuario, apellido, email, contraseña, celular, genero, fecha_nacimiento) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre_usuario, apellido, email, contraseña, celular, genero, fecha_nacimiento)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def modificar_usuario2(self, id, cambios):
        set_clause = ", ".join([f"{col} = %s" for col in cambios.keys()])
        sql = f"UPDATE usuario SET {set_clause} WHERE id = %s"
        valores = list(cambios.values()) + [id]
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def modificar_usuario(self, codigo, nuevo_nombre_usuario, nuevo_email, nuevo_celular):
        slq = "UPDATE usuario SET nombre_usuario=%s, email=%s, celular=%s WHERE id=%s ;"
        valores = (nuevo_nombre_usuario, nuevo_email, nuevo_celular, codigo)
        self.cursor.execute(slq, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def eliminar_usuario(self, id):
        self.cursor.execute(f"DELETE FROM usuario WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    


#----------------------------------------------------------------------------
# Usuarios test
#----------------------------------------------------------------------------
usuario = Usuario(host="localhost", user="root", password="", database="cac_cinema")
@usuarios_bp.route("/usuario", methods=["GET"])
def listar_usuarios():
    usuarios = usuario.listar_usuarios()
    return jsonify(usuarios)

@usuarios_bp.route("/usuario/<int:id>", methods=["GET"])
def mostrar_usuario(id):
    usuario_data = usuario.consultar_usuario(id)
    if usuario_data:
        return jsonify(usuario_data)
    else:
        return "Usuario no encontrado", 404

@usuarios_bp.route("/usuario", methods=["POST"])
def agregar_usuario():
    print(request.form)
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    email = request.form['email']
    contraseña = request.form['pass']
    celular = request.form['celular']
    genero = request.form['genero']
    fecha_nacimiento = request.form['fecnac']

    contraseña_hash = generate_password_hash(contraseña, method="pbkdf2:sha256")

    nuevo_id = usuario.agregar_usuario(nombre, apellido, email, contraseña_hash, celular, genero, fecha_nacimiento)
    if nuevo_id:
        return jsonify({"mensaje": "Usuario agregado correctamente.", "id": nuevo_id}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el usuario."}), 500

@usuarios_bp.route("/usuario/<int:id>", methods=["PUT"])
def modificar_usuario(id):
    nuevo_nombre = request.form.get("nombre_usuario")
    nuevo_email = request.form.get("email")
    nuevo_celular = request.form.get("celular")

    print(nuevo_nombre, nuevo_celular, nuevo_email)


    cambios = {nuevo_nombre, nuevo_email, nuevo_celular}


    if usuario.modificar_usuario(id, nuevo_nombre, nuevo_email, nuevo_celular):
        return jsonify({"mensaje": "Usuario modificado"}), 200
    else:
        return jsonify({"error": "Error al modificar usuario"}), 400

@usuarios_bp.route("/usuario/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    if usuario.eliminar_usuario(id):
        return jsonify({"mensaje": "Usuario eliminado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404

@usuarios_bp.route("/login", methods=["POST"])
def login_usuario():
    
    email = request.form["email"]
    password = request.form["password"]
    print(f"Email recibido: {email}")
    print(f"Password recibido: {password}")
    if not email or not password:
        return jsonify({"error": "Faltan el email o la contraseña"}), 400
    # Verificar en la base de datos si el usuario es válido
    user = usuario.consultar_usuario_email(email)
    if not user:
        return jsonify({"error": "Correo incorrecto"}), 401
    
    if not check_password_hash(user["contraseña"], password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    """ if not password == user["contraseña"]:
        return jsonify({"error": "Contraseña incorrecta"}), 401 """
    session["user_id"] = user["id"]
    print(session)
         # Guardar el id del usuario en la sesión
    return jsonify({"id": user["id"], "nombre": user["nombre_usuario"]}), 200

@usuarios_bp.route("/perfil", methods=["GET"])
def perfil_usuario():
    print(session)
    if "user_id" in session:
        user_id = session["user_id"]
        user_info = usuario.consultar_usuario(user_id)
        return jsonify(user_info), 200
    else:
        return jsonify({"message": "Error al obtener informacion del usuario"}), 401

@usuarios_bp.route("/logout", methods=["POST"])
def logout_usuario():
    session.pop("user_id", None)
    return jsonify({"message": "Logout exitoso"}), 200



if __name__ == "__main__":
    usuarios_bp.run(debug=True)