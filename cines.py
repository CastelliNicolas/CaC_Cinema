import mysql.connector
from flask import Blueprint, request, jsonify
from init_db import crear_db

cines_bp = Blueprint("cines", __name__)

class Cines:
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
                crear_db()
                self.conn.database = database
            else:
                raise err
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS cine (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            nombre_cine VARCHAR(255) NOT NULL,
            direccion VARCHAR(255) NOT NULL,
            cant_salas INT NOT NULL);''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_cines(self):
        self.cursor.execute("SELECT * FROM cine;")
        return self.cursor.fetchall()
    
    def agregar_cine(self, nombre_cine, direccion, cant_salas):
        sql = "INSERT INTO cine (nombre_cine, direccion, cant_salas) VALUES (%s, %s, %s);"
        valores = (nombre_cine, direccion, cant_salas)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid
    
    def consultar_cine(self, codigo):
        self.cursor.execute(f"SELECT * FROM cine WHERE codigo = {codigo};")
        return self.cursor.fetchone()
    
    def modificar_cine(self, codigo, nuevo_nombre, nueva_direccion, nueva_cant_salas):
        sql = "UPDATE cine SET nombre_cine= %s, direccion= %s, cant_salas= %s WHERE codigo= %s;"
        valores = (nuevo_nombre, nueva_direccion, nueva_cant_salas, codigo)  
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def eliminar_cine(self, codigo):
        self.cursor.execute(f"DELETE FROM cine WHERE codigo={codigo};")
        self.conn.commit()
        return self.cursor.rowcount > 0
    

#----------------------------------------------------------------------------
# cines test
#----------------------------------------------------------------------------

cines = Cines(host="localhost", user="root", password="", database="cac_cinema")

@cines_bp.route("/cine", methods=["GET"])
def listar_cines():
    list_cines = cines.listar_cines()
    return list_cines

@cines_bp.route("/cine", methods=["POST"])
def agregar_cine():
    nombre_cine = request.form["nombre_cine"]
    direccion = request.form["direccion"]
    cant_salas = request.form["cant_salas"]

    nuevo_cine = cines.agregar_cine(nombre_cine, direccion, cant_salas)
    if nuevo_cine:
        return jsonify({"mensaje":"Cine agregado correctamente", "Codigo":nuevo_cine, "Nombre":nombre_cine, "Direccion":direccion, "Cantidad de salas": cant_salas}), 201
    else:
        return jsonify({"Error": "Error al agregar el cine."}), 500
    
@cines_bp.route("/cine/<int:codigo>", methods=["GET"])
def mostrar_cine(codigo):
    cine = cines.consultar_cine(codigo)
    if cine:
        return jsonify(cine)
    else:
        return jsonify({"Mensaje": "Cine no encontrado."}), 404

@cines_bp.route("/cine/<int:codigo>", methods=["PUT"])
def modificar_cine(codigo):
    nuevo_nombre = request.form.get("nombre_cine")
    nueva_direccion = request.form.get("direccion")
    nueva_cant_salas = request.form.get("cant_salas")

    if cines.modificar_cine(codigo, nuevo_nombre, nueva_direccion, nueva_cant_salas):
        return jsonify({"Mensaje": "Cine actualizado correctamente"}), 200
    else:
        return jsonify({"Mensaje":"Cine no encontrado"}), 403
    
@cines_bp.route("/cine/<int:codigo>", methods=["DELETE"])
def eliminar_cine(codigo):
    if cines.eliminar_cine(codigo):
        return jsonify({"Mensaje": "Cine eliminado correctamente"}), 200
    else:
        return jsonify({"Mensaje": "Cine no encontrado"}), 403


if __name__ == "__main__":
    cines_bp.run(debug=True)