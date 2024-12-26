import mysql.connector
from flask import Blueprint, request, jsonify
from init_db import crear_db
from datetime import datetime

funciones_bp = Blueprint("funciones", __name__)

class FuncionesP:
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
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS funcion (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            codigo_pelicula INT,
            horario TIME NOT NULL,
            fecha DATE NOT NULL,
            codigo_cine INT,
            sala INT NOT NULL,
            FOREIGN KEY (codigo_pelicula) REFERENCES pelicula(codigo) ON DELETE CASCADE,
            FOREIGN KEY (codigo_cine) REFERENCES cine(codigo) ON DELETE CASCADE);''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_funciones(self):
        self.cursor.execute("""SELECT funcion.codigo, pelicula.nombre_pelicula AS funcion_pelicula, DATE_FORMAT(funcion.horario, '%H:%i') 
                            AS horario, DATE_FORMAT(funcion.fecha, '%d/%m/%Y') AS fecha, cine.nombre_cine AS funcion_cine, funcion.sala FROM funcion
                            JOIN pelicula ON funcion.codigo_pelicula = pelicula.codigo
                            JOIN cine ON funcion.codigo_cine = cine.codigo;
                            """)
        funcion = self.cursor.fetchall()
        return funcion
    
    def consultar_funcion(self, codigo):
        sql = ("SELECT funcion.codigo, funcion.codigo_pelicula, funcion.codigo_cine, pelicula.nombre_pelicula AS funcion_pelicula, pelicula.imagen_url AS funcion_pelicula_imagen, "
        "DATE_FORMAT(funcion.horario, '%H:%i') AS horario, "
        "funcion.fecha, cine.nombre_cine AS funcion_cine, cine.direccion AS funcion_cine_direccion ,funcion.sala "
        "FROM funcion "
        "JOIN pelicula ON funcion.codigo_pelicula = pelicula.codigo "
        "JOIN cine ON funcion.codigo_cine = cine.codigo "
        "WHERE funcion.codigo = %s;")
        valores = (codigo,)
        self.cursor.execute(sql, valores)
        return self.cursor.fetchone()
    
    def agregar_funcion(self, codigo_pelicula, horario, fecha, cine, sala):
        sql = "INSERT INTO funcion (codigo_pelicula, horario, fecha, codigo_cine, sala) VALUES (%s, %s, %s, %s, %s)"
        valores = (codigo_pelicula, horario, fecha, cine, sala)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid
    
    def modificar_funcion(self, codigo, nuevo_codigo_pelicula, nuevo_horario, nueva_fecha, nuevo_cine, nueva_sala):
        slq = "UPDATE funcion SET codigo_pelicula=%s, horario=%s, fecha=%s, codigo_cine=%s, sala=%s WHERE codigo=%s"
        valores = (nuevo_codigo_pelicula, nuevo_horario, nueva_fecha, nuevo_cine, nueva_sala, codigo)
        self.cursor.execute(slq, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def eliminar_funcion(self, codigo):
        self.cursor.execute(f"DELETE FROM funcion WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

#----------------------------------------------------------------------------
# funciones test
#----------------------------------------------------------------------------

funciones = FuncionesP(host="localhost", user="root", password="", database="cac_cinema")

@funciones_bp.route("/funcion", methods=["GET"])
def listar_funcion():
    funciones_list = funciones.listar_funciones()
    return jsonify(funciones_list)

@funciones_bp.route("/funcion/<int:codigo>", methods=["GET"])
def mostrar_funcion(codigo):
    funcion = funciones.consultar_funcion(codigo)
    if funcion:
        return jsonify(funcion)
    else:
        return "Funcion no encontrado", 404

@funciones_bp.route("/funcion", methods=["POST"])
def agregar_funcion():
    #Recojo los datos del form
    pelicula = request.form['codigo_pelicula']
    horario = request.form['horario']
    fecha = request.form['fecha']
    cine = request.form['codigo_cine']
    sala = request.form['sala']
    
    nuevo_codigo = funciones.agregar_funcion(pelicula, horario, fecha, cine, sala)
    if nuevo_codigo:
        return jsonify({"mensaje": "Funcion agregada correctamente.", "codigo": nuevo_codigo, "pelicula": pelicula}), 201
    else:
        return jsonify({"mensaje": "Error al agregar la funcion."}), 500

@funciones_bp.route("/funcion/<int:codigo>", methods=["PUT"])
def modificar_pelicula(codigo):

    nueva_pelicula = request.form.get("codigo_pelicula")
    nuevo_horario = request.form.get("horario")
    nueva_fecha = request.form.get("fecha")
    nuevo_cine = request.form.get("codigo_cine")
    nueva_sala = request.form.get("sala")

    if funciones.modificar_funcion(codigo, nueva_pelicula, nuevo_horario, nueva_fecha, nuevo_cine, nueva_sala):
        return jsonify({"mensaje": "Funcion modificada"}), 200
    else:
        return jsonify({"mensaje": "Funcion no encontrada"}), 403

@funciones_bp.route("/funcion/<int:codigo>", methods=["DELETE"])
def eliminar_pelicula(codigo):
    if funciones.eliminar_funcion(codigo):
        return jsonify({"mensaje": "Usuario eliminado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404

if __name__ == "__main__":
    funciones_bp.run(debug=True)