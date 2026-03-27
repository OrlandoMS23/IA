import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist

#AMBIA AQUI LAS EPOCAS
epocas = 20

#CAMBIA AQUI EL NOMBRE DEL MODELO
nombre_modelo = f"modelo_mnist_{epocas}_epocas.keras"

# CARGAR EL DATASET MNIST
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# NORMALIZAR: DE 0-255 A 0-1
x_train = x_train / 255.0
x_test = x_test / 255.0

# REDIMENSIONAR PARA CNN
x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)

print("Forma de x_train:", x_train.shape)
print("Forma de x_test:", x_test.shape)

# DEFINIR LA ARQUITECTURA DE LA CNN
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),

    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# COMPILAR
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print("Iniciando entrenamiento...")
model.fit(x_train, y_train, epochs=epocas, validation_data=(x_test, y_test))

# GUARDAR MODELO
model.save(nombre_modelo)
print(f"\nModelo guardado exitosamente como '{nombre_modelo}'")