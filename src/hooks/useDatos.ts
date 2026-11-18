import { useCallback, useEffect, useState } from 'react';

// Hook reutilizable (S15): la página delega aquí el estado de datos, carga y error de un servicio
export function useDatos<T>(cargar: () => Promise<T>, inicial: T) {
  const [datos, setDatos] = useState<T>(inicial);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState<number>(0);

  useEffect(() => {
    let activo = true; // evita actualizar estado de una petición obsoleta
    cargar()
      .then(d => { if (activo) setDatos(d); })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [cargar, intento]);

  const recargar = useCallback(() => {
    setCargando(true);
    setError(null);
    setIntento(n => n + 1);
  }, []);

  return { datos, setDatos, cargando, error, recargar };
}
