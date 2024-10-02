#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import request, jsonify, Blueprint

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------

peliculas_bp = Blueprint("peliculas", __name__)

class Catalogo:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()
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

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS pelicula (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            genero VARCHAR(255) NOT NULL,
            director VARCHAR(255) NOT NULL,
            duracion int NOT NULL,
            imagen_url VARCHAR(255),
            trailer_url VARCHAR(255),
            clasificacion ENUM('ATP', '+13', '+16', '+18'),
            sinopsis VARCHAR(450) NOT NULL)''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_pelicula(self):
        # Consultamos todas las peliculas en la base de datos
        self.cursor.execute("SELECT * FROM pelicula")
        pelicula = self.cursor.fetchall()
        return pelicula
    
    def consultar_pelicula(self, codigo):
        # Consultamos un pelicula a partir de su código
        self.cursor.execute(f"SELECT * FROM pelicula WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    def agregar_pelicula(self, nombre, genero, director, duracion, imagen, trailer, clasificacion, sinopsis):
        # Agregamos una nueva pelicula a la base de datos
        sql = "INSERT INTO pelicula (nombre, genero, director, duracion, imagen_url, trailer_url, clasificacion, sinopsis) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre, genero, director, duracion, imagen, trailer, clasificacion, sinopsis)
        self.cursor.execute(sql,valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def modificar_pelicula(self, codigo, nuevo_nombre, nuevo_genero, nuevo_director, nueva_duracion, nueva_imagen, nuevo_trailer, nueva_clasificacion, nueva_sinopsis):
        # Modificamos una pelicula existente en la base de datos
        sql = "UPDATE pelicula SET nombre = %s, genero = %s, director = %s, duracion = %s, imagen_url = %s, trailer_url = %s, clasificacion = %s, sinopsis = %s WHERE codigo = %s"
        valores = (nuevo_nombre, nuevo_genero, nuevo_director, nueva_duracion, nueva_imagen, nuevo_trailer, nueva_clasificacion, nueva_sinopsis, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def eliminar_pelicula(self, codigo):
        # Eliminamos una pelicula de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM pelicula WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------
# Crear una instancia de la clase Catalogo
catalogo = Catalogo(host="localhost", user="root", password="", database="pelicula")
# catalogo = Catalogo(host='Sinost.mysql.pythonanywhere-services.com', user='Sinost', password='cinemaCodo', database='Sinost$cinema')

# Carpeta para guardar las imagenes
ruta_destino = './static/imagenes/'
# ruta_destino = '/home/Sinost/mysite/static/imagenes/'

@peliculas_bp.route("/pelicula", methods=["GET"])
def listar_pelicula():
    pelicula = catalogo.listar_pelicula()
    return jsonify(pelicula)

@peliculas_bp.route("/pelicula/<int:codigo>", methods=["GET"])
def mostrar_pelicula(codigo):
    pelicula = catalogo.consultar_pelicula(codigo)
    if pelicula:
        return jsonify(pelicula)
    else:
        return "Pelicula no encontrado", 404

@peliculas_bp.route("/pelicula", methods=["POST"])
def agregar_pelicula():
    #Recojo los datos del form
    nombre = request.form['nombre']
    genero = request.form['genero']
    director = request.form['director']
    duracion = request.form['duracion']
    imagen = request.files['imagen']
    trailer = request.form['trailer']
    clasificacion = request.form['clasificacion']
    sinopsis = request.form['sinopsis']
    nombre_imagen = ""
    # Genero el nombre de la imagen
    nombre_imagen = secure_filename(imagen.filename) 
    nombre_base, extension = os.path.splitext(nombre_imagen) 
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

    nuevo_codigo = catalogo.agregar_pelicula(nombre, genero, director, duracion, nombre_imagen, trailer, clasificacion, sinopsis)
    if nuevo_codigo:    
        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        return jsonify({"mensaje": "Pelicula agregada correctamente.", "codigo": nuevo_codigo, "imagen": nombre_imagen}), 201
    else:
        return jsonify({"mensaje": "Error al agregar la pelicula."}), 500

@peliculas_bp.route("/pelicula/<int:codigo>", methods=["PUT"])
def modificar_pelicula(codigo):
    #Se recuperan los nuevos datos del formulario
    nuevo_nombre = request.form.get("nombre")
    nuevo_genero = request.form.get("genero")
    nuevo_director = request.form.get("director")
    nueva_duracion = request.form.get("duracion")
    nuevo_trailer = request.form.get("trailer")
    nueva_clasificacion = request.form.get("clasificacion")
    nueva_sinopsis = request.form.get("sinopsis")
    
    # Verifica si se proporcionó una nueva imagen
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        # Procesamiento de la imagen
        nombre_imagen = secure_filename(imagen.filename) 
        nombre_base, extension = os.path.splitext(nombre_imagen) 
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

        # Guardar la imagen en el servidor
        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        
        # Busco el producto guardado
        pelicula = catalogo.consultar_pelicula(codigo)
        if pelicula: # Si existe el producto...
            imagen_vieja = pelicula["imagen_url"]
            # Armo la ruta a la imagen
            ruta_imagen = os.path.join(ruta_destino, imagen_vieja)

            # Y si existe la borro.
            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)
    else:     
        pelicula = catalogo.consultar_pelicula(codigo)
        if pelicula:
            nombre_imagen = pelicula["imagen_url"]

# Se llama al método modificar_producto pasando el codigo del producto y los nuevos datos.
    if catalogo.modificar_pelicula(codigo, nuevo_nombre, nuevo_genero, nuevo_director, nueva_duracion, nombre_imagen, nuevo_trailer, nueva_clasificacion, nueva_sinopsis):
        return jsonify({"mensaje": "pelicula modificada"}), 200
    else:
        return jsonify({"mensaje": "pelicula no encontrada"}), 403

@peliculas_bp.route("/pelicula/<int:codigo>", methods=["DELETE"])
def eliminar_pelicula(codigo):
    # Primero, obtiene la información del producto para encontrar la imagen
    pelicula = catalogo.consultar_pelicula(codigo)
    if pelicula:
        # Eliminar la imagen asociada si existe
        ruta_imagen = os.path.join(ruta_destino, pelicula['imagen_url'])
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        # Luego, elimina el producto del catálogo
        if catalogo.eliminar_pelicula(codigo):
            return jsonify({"mensaje": "pelicula eliminada"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar la pelicula"}), 500
    else:
        return jsonify({"mensaje": "pelicula no encontrada"}), 404

if __name__ == "__main__":
    app.run(debug=True)