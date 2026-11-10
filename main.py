from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def inicio():
    nombre = "rene"
    episodio = "Episodio 2"
    return render_template("index.html", nombre=nombre, episodio=episodio)
    
@app.route("/saludos/<nombre>")
def saludo(nombre):
    return f"hola!{nombre}"
@app.route("/todo/")
def todo():
    return"que más queres investigar"
if __name__ == "__main__":
    app.run(debug=True)
