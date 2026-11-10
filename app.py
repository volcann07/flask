"""Aplicación web AURA."""

import json
from pathlib import Path

from flask import Flask, jsonify, render_template

app = Flask(__name__)
DATA_FILE = Path(__file__).parent / "data" / "puntos_reciclaje.json"


@app.get("/")
def inicio():
    return render_template("index.html")


@app.get("/api/puntos-reciclaje")
def puntos_reciclaje():
    """Devuelve únicamente ubicaciones cargadas en el archivo de datos."""
    try:
        with DATA_FILE.open(encoding="utf-8") as archivo:
            data = json.load(archivo)
    except (OSError, json.JSONDecodeError):
        app.logger.exception("No se pudo leer el catálogo de puntos de reciclaje.")
        return jsonify({"error": "No se pudo cargar el catálogo de puntos."}), 500

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
