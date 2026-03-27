import cv2
import numpy as np
import tensorflow as tf

#CAMBIA AQUI EL MODELO QUE QUIERES USAR
nombre_modelo = "modelo_mnist_20_epocas.keras"

# CARGAR EL MODELO
try:
    model = tf.keras.models.load_model(nombre_modelo)
    print(f"Modelo cargado correctamente: {nombre_modelo}")
except:
    print(f"Error: No se encontró '{nombre_modelo}'. Ejecuta primero Entrenador.py")
    exit()

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("No se pudo abrir la cámara.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    #frame = cv2.flip(frame, 1)

    #CUADRO DE ENFOQUE
    x1, y1 = 200, 150
    x2, y2 = 450, 400

    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

    # EXTRAER EL AREA DEL CUADRO
    roi = frame[y1:y2, x1:x2]

    # PREPROCESAMIENTO SIMPLE
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 0)

    # UMBRAL BINARIO INVERTIDO
    _, thresh = cv2.threshold(blur, 100, 255, cv2.THRESH_BINARY_INV)

    # REDIMENSIONAR A 28x28
    resized = cv2.resize(thresh, (28, 28))
    normalized = resized / 255.0
    reshaped = normalized.reshape(1, 28, 28, 1)

    # PREDICCION
    prediction = model.predict(reshaped, verbose=0)
    digit = np.argmax(prediction)
    confianza = np.max(prediction)

    #UMBRAL DE CONFIANZA
    if confianza > 0.70:
        cv2.putText(
            frame,
            f"DIGITO: {digit} ({int(confianza * 100)}%)",
            (200, 130),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )
    else:
        cv2.putText(
            frame,
            f"DUDOSO: {digit} ({int(confianza * 100)}%)",
            (200, 130),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 255),
            2
        )

    cv2.putText(
        frame,
        f"Modelo: {nombre_modelo}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2
    )

    cv2.imshow("Reconocimiento", frame)
    cv2.imshow("Vista de la IA", thresh)

    # SALIR CON Q O ESC
    tecla = cv2.waitKey(1) & 0xFF
    if tecla == ord('q') or tecla == 27:
        break

cap.release()
cv2.destroyAllWindows()