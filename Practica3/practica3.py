import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import yfinance as yf

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# DESCARGAR DATOS DE BITCOIN
datos_bitcoin = yf.download("BTC-USD", start="2020-01-01", end="2024-01-01")

# USAR SOLO LA COLUMNA DE CIERRE
datos_cierre = datos_bitcoin[["Close"]].copy()

print("Primeros datos descargados:")
print(datos_cierre.head())

# NORMALIZAR LOS DATOS
escalador = MinMaxScaler()
datos_normalizados = escalador.fit_transform(datos_cierre)

# CREAR SECUENCIAS PARA LSTM
entradas = []
salidas = []
ventana_tiempo = 10

for i in range(ventana_tiempo, len(datos_normalizados)):
    entradas.append(datos_normalizados[i - ventana_tiempo:i])
    salidas.append(datos_normalizados[i])

entradas = np.array(entradas)
salidas = np.array(salidas)

# MOSTRAR FORMA DE LOS DATOS
print("\nForma de entradas:", entradas.shape)
print("Forma de salidas:", salidas.shape)

# CREAR MODELO
modelo = Sequential()
modelo.add(LSTM(50, input_shape=(entradas.shape[1], 1)))
modelo.add(Dense(1))

# COMPILAR MODELO
modelo.compile(optimizer="adam", loss="mean_squared_error")

print("\nIniciando entrenamiento...")
modelo.fit(entradas, salidas, epochs=10, batch_size=16, verbose=1)

# HACER PREDICCIONES
predicciones = modelo.predict(entradas)

# REGRESAR A ESCALA ORIGINAL
predicciones_reales = escalador.inverse_transform(predicciones)
valores_reales = escalador.inverse_transform(salidas)

# CREAR TABLA DE RESULTADOS
tabla_resultados = pd.DataFrame({
    "Real": valores_reales.flatten(),
    "Prediccion": predicciones_reales.flatten()
})

# CAMBIAR EL INDICE: 0 POR "Hoy"
tabla_resultados.index = ["Hoy" if i == 0 else i for i in range(len(tabla_resultados))]

# CALCULAR PRECISION APROXIMADA CON MAPE
error_porcentual = np.mean(np.abs((valores_reales - predicciones_reales) / valores_reales)) * 100
precision_aproximada = 100 - error_porcentual

print(f"\nPrecision aproximada del modelo: {precision_aproximada:.2f}%")

# CREAR COPIA FORMATEADA PARA MOSTRAR Y GUARDAR
tabla_resultados_formateada = tabla_resultados.copy()
tabla_resultados_formateada["Real"] = tabla_resultados_formateada["Real"].apply(lambda x: f"${x:,.2f}")
tabla_resultados_formateada["Prediccion"] = tabla_resultados_formateada["Prediccion"].apply(lambda x: f"${x:,.2f}")

print("\nPrimeras 10 filas de resultados:")
print(tabla_resultados_formateada.head(10))

# GUARDAR RESULTADOS EN CSV
tabla_resultados_formateada.to_csv("resultados_bitcoin.csv", index=True)
print("\nSe guardo el archivo resultados_bitcoin.csv")

# GRAFICA
plt.figure(figsize=(10, 5))
plt.plot(valores_reales, label="Real")
plt.plot(predicciones_reales, label="Prediccion")
plt.legend()
plt.title("Prediccion de Bitcoin con LSTM")
plt.xlabel("Tiempo")
plt.ylabel("Precio")
plt.grid(True)

# FORMATO MONEDA EN EJE Y
eje = plt.gca()
eje.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, pos: f'${x:,.0f}'))

plt.show()