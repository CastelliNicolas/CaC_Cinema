import mysql.connector

def crear_db():
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password=""
    )
    cursor = conexion.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS cac_cinema")
    print("Base de datos creada o ya existía.")
    conexion.close()

