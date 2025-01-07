import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../styles/Valicacion.css";

const ValidarCuenta = () => {
  const [mensaje, setMensaje] = useState("Validando cuenta...");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validarCuenta = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMensaje("Token no proporcionado.");
        return;
      }

      try {
        // Llamada al backend para validar el token
        const response = await axios.get(
          `http://localhost:3000/api/validar?token=${token}`
        );
        if (response.data.success) {
          setMensaje("Cuenta activada exitosamente");
        } else {
          setMensaje("El enlace no es valido o ya fue usado.");
        }
      } catch (error) {
        console.error("Error al validar el token:", error);
        setMensaje("Hubo un error al validar la cuenta. Intenta nuevamente.");
      }
    };

    validarCuenta();
  }, [searchParams]);

  return (
    <div className="validar-container">
      <h1>{mensaje}</h1>
    </div>
  );
};

export default ValidarCuenta;
